const crypto = require("crypto");
const mongoose = require("mongoose");

const Booking = require("../../models/Booking");
const Payment = require("../../models/Payment");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const { queryVnpayTransaction } = require("../../utils/vnpayQuery");
const {
  formatVnpDate,
  buildQuery,
  signVnpay,
  verifyVnpay,
} = require("../../utils/vnpay");

const ACTIVE_STATUSES = ["PENDING", "PROCESSING"];

const getCustomerId = (req) => req.user._id || req.user.id;

const isSuccess = (params) =>
  params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00";

// Only explicit failures may release the active-payment lock. In particular,
// response 07 can mean the customer was debited and must be reconciled.
const FAILURE_RESPONSE_CODES = new Set([
  "09", "10", "11", "12", "13", "24", "51", "65", "75", "79",
]);
const isConfirmedFailure = (params) =>
  params.vnp_TransactionStatus === "02" &&
  FAILURE_RESPONSE_CODES.has(params.vnp_ResponseCode);

const isValidAmount = (amount) =>
  Number.isSafeInteger(amount) &&
  amount > 0 &&
  Number.isSafeInteger(amount * 100);

const ipnReply = (res, code, message) =>
  res.status(200).json({
    RspCode: code,
    Message: message,
  });

// Tạo thanh to`án VNPAY cho Booking
const createVnpayPayment = async (req, res, next) => {
  try {
    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Chỉ Customer được thanh toán",
      });
    }

    const bookingId = req.params?.bookingId || req.body?.bookingId;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "bookingId không hợp lệ",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: getCustomerId(req),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Booking",
      });
    }

    if (booking.status !== "CONFIRMED" || booking.paymentStatus !== "UNPAID") {
      return res.status(400).json({
        success: false,
        code: "BOOKING_NOT_PAYABLE",
        message: "Chỉ lịch đặt đã được cơ sở xác nhận và chưa thanh toán mới có thể thanh toán.",
      });
    }

    if (!isValidAmount(booking.totalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Số tiền thanh toán không hợp lệ",
      });
    }

    // Tìm Business từ BranchService của Booking
    const branchService = await BranchService.findById(booking.branchServiceId);

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ của chi nhánh",
      });
    }

    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // Kiểm tra có Payment đang hoạt động không
    const activePayment = await Payment.findOne({
      bookingId: booking._id,
      status: { $in: ACTIVE_STATUSES },
    });

    if (activePayment) {
      const expired =
        activePayment.expiresAt && activePayment.expiresAt <= new Date();

      return res.status(409).json({
        success: false,
        code: expired
          ? "PAYMENT_RECONCILIATION_REQUIRED"
          : "PAYMENT_IN_PROGRESS",
        message: expired
          ? "Phiên thanh toán đã hết hạn. Cần xác minh kết quả với VNPAY trước khi tạo lượt mới."
          : "Booking đang có phiên thanh toán. Vui lòng chờ kết quả.",
        data: {
          paymentId: activePayment._id,
          expiresAt: activePayment.expiresAt,
        },
      });
    }

    if (
      !process.env.VNP_TMN_CODE ||
      !process.env.VNP_HASH_SECRET ||
      !process.env.VNP_URL ||
      !process.env.VNP_RETURN_URL
    ) {
      throw new Error("Thiếu cấu hình VNPAY");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

    const paymentCode = crypto.randomBytes(12).toString("hex");

    let payment;

    const creationSession = await mongoose.startSession();
    try {
      await creationSession.withTransaction(async () => {
        // Both payment creation and cancellation write this Booking. A racing
        // cancellation causes a write conflict and a fresh state check on retry.
        const locked = await Booking.updateOne(
          {
            _id: booking._id,
            customerId: getCustomerId(req),
            status: "CONFIRMED",
            paymentStatus: "UNPAID",
            totalPrice: booking.totalPrice,
          },
          { $inc: { __v: 1 } },
          { session: creationSession },
        );
        if (locked.matchedCount !== 1) {
          throw Object.assign(new Error("Booking không còn có thể thanh toán"), {
            code: "BOOKING_NOT_PAYABLE",
          });
        }
        [payment] = await Payment.create(
          [{
            paymentCode,
            bookingId: booking._id,
            customerId: booking.customerId,
            businessId: branch.businessId,
            amount: booking.totalPrice,
            currency: "VND",
            method: "VNPAY",
            provider: "VNPAY",
            status: "PENDING",
            expiresAt,
            metadata: {
              vnpCreateDate: formatVnpDate(now),
            },
          }],
          { session: creationSession },
        );
      });
    } catch (error) {
      if (error.code === "BOOKING_NOT_PAYABLE") {
        return res.status(409).json({
          success: false,
          code: error.code,
          message: error.message,
        });
      }
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Đã có phiên thanh toán được tạo. Vui lòng kiểm tra lại.",
        });
      }

      throw error;
    } finally {
      await creationSession.endSession();
    }

    const params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Amount: payment.amount * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: payment.paymentCode,
      vnp_OrderInfo: `Thanh toan booking ${booking.bookingCode}`,
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_IpAddr: req.ip || req.socket.remoteAddress || "127.0.0.1",
      vnp_CreateDate: formatVnpDate(now),
      vnp_ExpireDate: formatVnpDate(expiresAt),
    };

    const secureHash = signVnpay(params);

    const paymentUrl =
      `${process.env.VNP_URL}?` +
      buildQuery(params) +
      `&vnp_SecureHash=${secureHash}`;

    await Payment.updateOne(
      {
        _id: payment._id,
        status: "PENDING",
      },
      {
        $set: { status: "PROCESSING" },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Tạo thanh toán VNPAY thành công",
      data: {
        bookingId: booking._id,
        paymentId: payment._id,
        paymentCode: payment.paymentCode,
        amount: payment.amount,
        expiresAt,
        paymentUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Nhận IPN từ VNPAY
const vnpayIpn = async (req, res) => {
  try {
    const params = req.query;

    if (!verifyVnpay(params)) {
      return ipnReply(res, "97", "Invalid signature");
    }

    if (params.vnp_TmnCode !== process.env.VNP_TMN_CODE) {
      return ipnReply(res, "97", "Invalid merchant");
    }

    const payment = await Payment.findOne({
      paymentCode: params.vnp_TxnRef,
      method: "VNPAY",
    });

    if (!payment) {
      return ipnReply(res, "01", "Order not found");
    }

    if (
      !Number.isSafeInteger(Number(params.vnp_Amount)) ||
      Number(params.vnp_Amount) !== payment.amount * 100
    ) {
      return ipnReply(res, "04", "Invalid amount");
    }

    if (!ACTIVE_STATUSES.includes(payment.status)) {
      return ipnReply(res, "02", "Order already confirmed");
    }

    const success = isSuccess(params);

    const session = await mongoose.startSession();

    let resultCode = "00";
    let resultMessage = "Confirm Success";

    try {
      await session.withTransaction(async () => {
        // withTransaction may rerun the callback after a write conflict.
        resultCode = "00";
        resultMessage = "Confirm Success";
        const currentPayment = await Payment.findById(payment._id)
          .select("+metadata")
          .session(session);

        if (
          !currentPayment ||
          !ACTIVE_STATUSES.includes(currentPayment.status)
        ) {
          resultCode = "02";
          resultMessage = "Order already confirmed";
          return;
        }

        const booking = await Booking.findById(
          currentPayment.bookingId,
        ).session(session);

        if (!booking) {
          resultCode = "01";
          resultMessage = "Booking not found";
          return;
        }

        if (booking.totalPrice !== currentPayment.amount) {
          resultCode = "04";
          resultMessage = "Invalid amount";
          return;
        }

        currentPayment.metadata = {
          ...(currentPayment.metadata || {}),
          responseCode: params.vnp_ResponseCode,
          transactionStatus: params.vnp_TransactionStatus,
          bankCode: params.vnp_BankCode,
          reconciliationRequired: false,
        };
        delete currentPayment.metadata.reconciliationReason;
        currentPayment.transactionId = String(params.vnp_TransactionNo || "");

        if (success) {
          if (
            booking.paymentStatus !== "UNPAID" ||
            booking.status !== "CONFIRMED"
          ) {
            // Persist the verified payment evidence without overwriting a
            // cancelled/settled booking or permitting another payment attempt.
            currentPayment.status = "PROCESSING";
            currentPayment.metadata.reconciliationRequired = true;
            currentPayment.metadata.reconciliationReason = "BOOKING_NOT_PAYABLE";
            await currentPayment.save({ session });
            return;
          }

          currentPayment.status = "PAID";
          currentPayment.paidAt = new Date();

          booking.paymentStatus = "PAID";

          await booking.save({ session });
        } else if (isConfirmedFailure(params)) {
          currentPayment.status = "FAILED";
          currentPayment.failedAt = new Date();
          currentPayment.failureReason = `VNPAY response: ${params.vnp_ResponseCode}`;
        } else {
          currentPayment.status = "PROCESSING";
          currentPayment.metadata.reconciliationRequired = true;
          currentPayment.metadata.reconciliationReason = "UNSETTLED_VNPAY_RESULT";
        }

        await currentPayment.save({ session });
      });
    } finally {
      await session.endSession();
    }

    return ipnReply(res, resultCode, resultMessage);
  } catch (error) {
    console.error("VNPAY IPN:", error);

    return ipnReply(res, "99", "Unknown error");
  }
};
//Return URL
const vnpayReturn = async (req, res, next) => {
  try {
    const params = req.query;

    if (
      !verifyVnpay(params) ||
      params.vnp_TmnCode !== process.env.VNP_TMN_CODE
    ) {
      return res.status(400).json({
        success: false,
        message: "Phản hồi VNPAY không hợp lệ",
      });
    }

    const payment = await Payment.findOne({
      paymentCode: params.vnp_TxnRef,
      method: "VNPAY",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Payment",
      });
    }

    if (Number(params.vnp_Amount) !== payment.amount * 100) {
      return res.status(400).json({
        success: false,
        message: "Số tiền không khớp",
      });
    }

    if (process.env.FRONTEND_URL) {
      const redirectUrl = new URL("/payment-result", process.env.FRONTEND_URL);

      redirectUrl.searchParams.set("bookingId", String(payment.bookingId));

      return res.redirect(302, redirectUrl.toString());
    }

    return res.json({
      success: true,
      message: "Đã nhận phản hồi VNPAY",
      data: {
        bookingId: payment.bookingId,
        paymentStatus: payment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
// kiểm tra trạng thái thanh toán của Booking
const getPaymentStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    const { bookingId } = req.params;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "bookingId không hợp lệ",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: getCustomerId(req),
    }).select("bookingCode status paymentStatus totalPrice");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Booking",
      });
    }

    const payments = await Payment.find({
      bookingId: booking._id,
      customerId: getCustomerId(req),
    })
      .select(
        "paymentCode amount method status expiresAt paidAt failedAt createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy trạng thái thanh toán thành công",
      data: {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        bookingStatus: booking.status,
        paymentStatus: booking.paymentStatus,
        totalPrice: booking.totalPrice,
        payments,
      },
    });
  } catch (error) {
    next(error);
  }
};

const alreadyPaidReply = (res, booking, paymentId) =>
  res.status(200).json({
    success: true,
    code: "PAYMENT_ALREADY_PAID",
    message: "Booking đã được xác nhận thanh toán. Không tạo Payment mới.",
    data: {
      bookingId: booking._id,
      ...(paymentId && { paymentId }),
      paymentStatus: "PAID",
    },
  });

const retryVnpayPayment = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });
    }
    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Chỉ Customer được thanh toán",
      });
    }

    const bookingId = req.params?.bookingId || req.body?.bookingId;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "bookingId không hợp lệ",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: getCustomerId(req),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Booking",
      });
    }

    if (booking.paymentStatus === "PAID") {
      return alreadyPaidReply(res, booking);
    }

    if (booking.status !== "CONFIRMED" || booking.paymentStatus !== "UNPAID") {
      return res.status(409).json({
        success: false,
        code: "BOOKING_NOT_PAYABLE",
        message: "Chỉ lịch đặt đã được cơ sở xác nhận và chưa thanh toán mới có thể thanh toán.",
      });
    }

    const activePayment = await Payment.findOne({
      bookingId: booking._id,
      method: "VNPAY",
      status: { $in: ["PENDING", "PROCESSING"] },
    })
      .select("+metadata")
      .sort({ createdAt: -1 });

    // Không có Payment đang xử lý:
    // tái sử dụng API create hiện có.
    if (!activePayment) {
      return createVnpayPayment(req, res, next);
    }

    if (!activePayment.expiresAt || activePayment.expiresAt > new Date()) {
      return res.status(409).json({
        success: false,
        code: "PAYMENT_IN_PROGRESS",
        message: "Phiên thanh toán cũ chưa hết hạn",
        data: {
          paymentId: activePayment._id,
          expiresAt: activePayment.expiresAt,
        },
      });
    }

    // BƯỚC 1: Tra cứu VNPAY.
    let result;

    try {
      result = await queryVnpayTransaction(activePayment, booking);
    } catch (error) {
      console.error(
        "QueryDR error:",
        error.code,
        error.message,
        error.cause?.cause?.code || error.cause?.code || "",
      );

      // An IPN may have settled the booking while the QueryDR request failed.
      const refreshedBooking = await Booking.findOne({
        _id: booking._id,
        customerId: getCustomerId(req),
      });
      if (refreshedBooking?.paymentStatus === "PAID") {
        return alreadyPaidReply(res, refreshedBooking);
      }

      return res.status(503).json({
        success: false,
        code: "QUERYDR_UNAVAILABLE",
        message:
          error.gatewayResponseCode === "99"
            ? "VNPAY trả lỗi tra cứu 99. Chưa xác minh được giao dịch cũ; vui lòng thử lại sau hoặc liên hệ hỗ trợ đối soát."
            : "Chưa xác minh được giao dịch cũ. Vui lòng thử lại sau.",
        data: {
          bookingId: booking._id,
          paymentId: activePayment._id,
          reasonCode: error.code || "QUERYDR_UNKNOWN_ERROR",
          ...(error.gatewayResponseCode && {
            gatewayResponseCode: error.gatewayResponseCode,
          }),
        },
      });
    }

    // BƯỚC 2: VNPAY xác nhận đã thanh toán.
    if (result.responseCode === "00" && result.transactionStatus === "00") {
      const session = await mongoose.startSession();

      try {
        let outcome = "MANUAL_RECONCILIATION";

        await session.withTransaction(async () => {
          // MongoDB can run this callback again after a write conflict.
          outcome = "MANUAL_RECONCILIATION";
          const currentPayment = await Payment.findById(activePayment._id)
            .select("+metadata")
            .session(session);

          const currentBooking = await Booking.findById(booking._id).session(
            session,
          );

          if (!currentPayment || !currentBooking) {
            outcome = "NOT_FOUND";
            return;
          }

          if (currentPayment.status === "PAID") {
            if (currentBooking.paymentStatus === "PAID") outcome = "PAID";
            return;
          }

          if (
            !["PENDING", "PROCESSING"].includes(currentPayment.status) ||
            currentBooking.status !== "CONFIRMED" ||
            currentBooking.paymentStatus !== "UNPAID" ||
            currentBooking.totalPrice !== currentPayment.amount ||
            currentPayment.amount !== activePayment.amount ||
            currentPayment.paymentCode !== activePayment.paymentCode ||
            String(currentPayment.bookingId) !== String(booking._id)
          ) {
            outcome = "MANUAL_RECONCILIATION";
            return;
          }

          currentPayment.status = "PAID";
          currentPayment.paidAt = new Date();
          currentPayment.transactionId = String(result.transactionNo);

          currentPayment.metadata = {
            ...(currentPayment.metadata || {}),
            queryResponseCode: result.responseCode,
            queryTransactionStatus: result.transactionStatus,
            reconciliationRequired: false,
          };
          delete currentPayment.metadata.reconciliationReason;

          currentBooking.paymentStatus = "PAID";

          await currentPayment.save({ session });
          await currentBooking.save({ session });
          outcome = "PAID";
        });

        if (outcome !== "PAID") {
          return res.status(409).json({
            success: false,
            code: "MANUAL_RECONCILIATION_REQUIRED",
            message:
              "Giao dịch đã có tiền hoặc dữ liệu thay đổi. Cần đối soát trước khi tiếp tục.",
          });
        }

        return alreadyPaidReply(res, booking, activePayment._id);
      } finally {
        await session.endSession();
      }
    }

    // BƯỚC 3: VNPAY xác nhận giao dịch bị lỗi.
    if (result.responseCode === "00" && result.transactionStatus === "02") {
      // Chỉ chuyển trạng thái nếu Payment vẫn đang xử lý.
      // Index unique sẽ ngăn hai Payment active cùng Booking.
      const updated = await Payment.findOneAndUpdate(
        {
          _id: activePayment._id,
          bookingId: booking._id,
          paymentCode: activePayment.paymentCode,
          amount: activePayment.amount,
          method: "VNPAY",
          status: { $in: ["PENDING", "PROCESSING"] },
        },
        {
          $set: {
            status: "FAILED",
            failedAt: new Date(),
            failureReason: "VNPAY QueryDR confirmed failed",
            "metadata.queryResponseCode": result.responseCode,
            "metadata.queryTransactionStatus": result.transactionStatus,
            "metadata.reconciliationRequired": false,
          },
          $unset: { "metadata.reconciliationReason": "" },
        },
        { new: true },
      );

      if (!updated) {
        return res.status(409).json({
          success: false,
          code: "PAYMENT_STATE_CHANGED",
          message: "Payment vừa thay đổi trạng thái. Vui lòng kiểm tra lại.",
        });
      }

      // BƯỚC 4: Tạo Payment và paymentUrl mới
      // bằng logic createVnpayPayment đã có.
      return createVnpayPayment(req, res, next);
    }

    // BƯỚC 5: Chưa rõ kết quả.
    return res.status(409).json({
      success: false,
      code: "PAYMENT_RECONCILIATION_REQUIRED",
      message:
        "VNPAY chưa xác nhận giao dịch đã kết thúc an toàn. Chưa thể thanh toán lại.",
      data: {
        paymentId: activePayment._id,
        responseCode: result.responseCode,
        transactionStatus: result.transactionStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVnpayPayment,
  vnpayIpn,
  vnpayReturn,
  getPaymentStatus,
  retryVnpayPayment,
};
