
const mongoose = require("mongoose");

const User = require("../../models/User");
const Booking = require("../../models/Booking");
const Payment = require("../../models/Payment");
const Review = require("../../models/Review");

// GET /api/admin/users/:id/kpis
const getUserKPIs = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra ID
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ",
      });
    }

    // 2. Kiểm tra tài khoản tồn tại và là CUSTOMER
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
        message: "KPI này chỉ áp dụng cho tài khoản CUSTOMER",
      });
    }

    // 3. Lấy số liệu từ các collection
    const [
      totalBookings,
      completedBookings,
      paymentTotals,
      totalReviews,
    ] = await Promise.all([
      // Tổng số booking (bao gồm cả đã hủy)
      Booking.countDocuments({
        customerId: user._id,
      }),

      // Booking hoàn thành
      Booking.countDocuments({
        customerId: user._id,
        status: "COMPLETED",
      }),

      // Tổng số tiền thanh toán thành công
      Payment.aggregate([
        {
          $match: {
            customerId: user._id,
            status: "PAID",
            currency: "VND",
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" },
          },
        },
      ]),

      // Tổng đánh giá đã tạo (gồm VISIBLE và HIDDEN)
      Review.countDocuments({
        customerId: user._id,
      }),
    ]);

    const totalSpent = paymentTotals[0]?.totalSpent ?? 0;

    return res.status(200).json({
      success: true,
      message: "Lấy thống kê khách hàng thành công",
      data: {
        totalBookings,
        completedBookings,
        totalSpent,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Admin getUserKPIs error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê khách hàng",
    });
  }
};

module.exports = {
  getUserKPIs,
};
