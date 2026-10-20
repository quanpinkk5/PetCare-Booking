
const mongoose = require("mongoose");

const Payment = require("../../models/Payment");
const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Business = require("../../models/Business");

const VALID_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
];

const VALID_METHODS = [
  "CASH",
  "VNPAY",
  "MOMO",
  "BANK_TRANSFER",
];

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidDateOnly = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const parsed = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

const formatPayment = (payment) => {
  const booking = payment.bookingId;
  const customer = payment.customerId;
  const business = payment.businessId;

  return {
    _id: payment._id,
    paymentCode: payment.paymentCode,

    booking: booking
      ? {
          _id: booking._id,
          bookingCode: booking.bookingCode,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        }
      : null,

    customer: customer
      ? {
          _id: customer._id,
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          avatar: customer.avatar,
        }
      : null,

    business: business
      ? {
          _id: business._id,
          name: business.name,
        }
      : null,

    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    provider: payment.provider || "",
    transactionId: payment.transactionId || "",
    status: payment.status,

    paidAt: payment.paidAt,
    failedAt: payment.failedAt,
    failureReason: payment.failureReason || "",

    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
};

const populatePayment = (query) =>
  query
    .populate({
      path: "bookingId",
      select: "bookingCode status paymentStatus",
    })
    .populate({
      path: "customerId",
      select: "fullName phone email avatar",
    })
    .populate({
      path: "businessId",
      select: "name",
    });

// ==========================================
// GET /api/admin/payments
// Danh sách + lọc + phân trang
// ==========================================
const getPayments = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      method = "all",
      fromDate = "",
      toDate = "",
    } = req.query;

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        parseInt(req.query.limit, 10) || 10
      )
    );

    if (
      status !== "all" &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái thanh toán không hợp lệ.",
      });
    }

    if (
      method !== "all" &&
      !VALID_METHODS.includes(method)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phương thức thanh toán không hợp lệ.",
      });
    }

    if (
      (fromDate && !isValidDateOnly(fromDate)) ||
      (toDate && !isValidDateOnly(toDate))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Ngày lọc phải có định dạng YYYY-MM-DD hợp lệ.",
      });
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message:
          "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
      });
    }

    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (method !== "all") {
      filter.method = method;
    }

    // Lọc theo ngày TẠO giao dịch.
    // Ranh giới ngày được tính theo giờ Việt Nam.
    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(
          `${fromDate}T00:00:00.000+07:00`
        );
      }

      if (toDate) {
        filter.createdAt.$lte = new Date(
          `${toDate}T23:59:59.999+07:00`
        );
      }
    }

    const trimmedSearch = String(search).trim();

    if (trimmedSearch) {
      const regex = new RegExp(
        escapeRegex(trimmedSearch),
        "i"
      );

      // Tìm cả thông tin ở các collection liên quan.
      const [
        matchedCustomers,
        matchedBookings,
        matchedBusinesses,
      ] = await Promise.all([
        User.find({
          $or: [
            { fullName: regex },
            { phone: regex },
          ],
        })
          .select("_id")
          .lean(),

        Booking.find({
          bookingCode: regex,
        })
          .select("_id")
          .lean(),

        Business.find({
          name: regex,
        })
          .select("_id")
          .lean(),
      ]);

      filter.$or = [
        { paymentCode: regex },
        { transactionId: regex },
        {
          customerId: {
            $in: matchedCustomers.map(
              (item) => item._id
            ),
          },
        },
        {
          bookingId: {
            $in: matchedBookings.map(
              (item) => item._id
            ),
          },
        },
        {
          businessId: {
            $in: matchedBusinesses.map(
              (item) => item._id
            ),
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, paymentDocuments] =
      await Promise.all([
        Payment.countDocuments(filter),

        populatePayment(
          Payment.find(filter)
            .sort({
              createdAt: -1,
              _id: -1,
            })
            .skip(skip)
            .limit(limit)
        ).lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        payments: paymentDocuments.map(
          formatPayment
        ),

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(
      "[Admin] getPayments:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Có lỗi khi lấy danh sách thanh toán.",
    });
  }
};

// ==========================================
// GET /api/admin/payments/metrics
// Thống kê toàn bộ giao dịch
// ==========================================
const getPaymentMetrics = async (req, res) => {
  try {
    const [
      totalPayments,
      pendingPayments,
      processingPayments,
      paidPayments,
      failedPayments,
      paidAmountResult,
    ] = await Promise.all([
      Payment.countDocuments(),

      Payment.countDocuments({
        status: "PENDING",
      }),

      Payment.countDocuments({
        status: "PROCESSING",
      }),

      Payment.countDocuments({
        status: "PAID",
      }),

      Payment.countDocuments({
        status: "FAILED",
      }),

      Payment.aggregate([
        {
          $match: {
            status: "PAID",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalPayments,
        pendingPayments,
        processingPayments,
        paidPayments,
        failedPayments,
        totalPaidAmount:
          paidAmountResult[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error(
      "[Admin] getPaymentMetrics:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Có lỗi khi lấy thống kê thanh toán.",
    });
  }
};

// ==========================================
// GET /api/admin/payments/:id
// Chi tiết giao dịch
// ==========================================
const getPaymentDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID thanh toán không hợp lệ.",
      });
    }

    const paymentDocument = await populatePayment(
      Payment.findById(id)
    ).lean();

    if (!paymentDocument) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giao dịch.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        payment: formatPayment(paymentDocument),
      },
    });
  } catch (error) {
    console.error(
      "[Admin] getPaymentDetail:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Có lỗi khi lấy chi tiết thanh toán.",
    });
  }
};

module.exports = {
  getPayments,
  getPaymentMetrics,
  getPaymentDetail,
};
