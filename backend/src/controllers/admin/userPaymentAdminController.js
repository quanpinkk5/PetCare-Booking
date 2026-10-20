
const mongoose = require("mongoose");

const User = require("../../models/User");
const Payment = require("../../models/Payment");

// Đăng ký model phục vụ populate
require("../../models/Booking");
require("../../models/BranchService");
require("../../models/Service");

// GET /api/admin/users/:id/payments
const getUserPayments = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra ID
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ",
      });
    }

    // 2. Kiểm tra người dùng tồn tại và là CUSTOMER
    const user = await User.findById(id)
      .select("_id role")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.role !== "CUSTOMER") {
      return res.status(400).json({
        success: false,
        message: "Chỉ hỗ trợ xem thanh toán của CUSTOMER",
      });
    }

    // 3. Kiểm tra phân trang
    const rawPage = String(req.query.page ?? "1");
    const rawLimit = String(req.query.limit ?? "5");

    if (
      !/^\d+$/.test(rawPage) ||
      !/^\d+$/.test(rawLimit)
    ) {
      return res.status(400).json({
        success: false,
        message: "page và limit phải là số nguyên dương",
      });
    }

    const page = Number(rawPage);
    const limit = Number(rawLimit);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "page phải >= 1 và limit từ 1 đến 50",
      });
    }

    // 4. Chỉ lấy payment của Customer này
    const filter = {
      customerId: user._id,
    };

    // 5. Lấy payment và thông tin dịch vụ
    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .select(
          "_id paymentCode bookingId amount currency " +
          "method status paidAt createdAt"
        )
        .populate({
          path: "bookingId",
          select: "bookingCode branchServiceId",
          populate: {
            path: "branchServiceId",
            select: "serviceId",
            populate: {
              path: "serviceId",
              select: "name",
            },
          },
        })
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Payment.countDocuments(filter),
    ]);

    // 6. Chuyển dữ liệu dễ sử dụng cho frontend
    const formattedPayments = payments.map((payment) => {
      const booking = payment.bookingId;
      const branchService = booking?.branchServiceId;
      const service = branchService?.serviceId;

      return {
        _id: payment._id,
        paymentCode: payment.paymentCode,

        bookingCode: booking?.bookingCode || "Không xác định",
        serviceName: service?.name || "Không xác định",

        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,

        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Lấy lịch sử thanh toán thành công",
      data: {
        payments: formattedPayments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin getUserPayments error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy lịch sử thanh toán",
    });
  }
};

module.exports = {
  getUserPayments,
};
