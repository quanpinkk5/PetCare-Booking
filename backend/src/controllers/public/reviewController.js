const Review = require("../../models/Review");

// ============================================
// LẤY TẤT CẢ ĐÁNH GIÁ CÔNG KHAI
// GET /api/reviews
// ============================================

const getAllReviews = async (req, res, next) => {
  try {
    // Chỉ lấy các đánh giá đang hiển thị
    const reviews = await Review.find({
      status: "VISIBLE",
    })
      .populate("customerId", "fullName avatar")
      .populate("businessId", "name logo")
      .populate("branchId", "name address")
      .populate("serviceId", "name serviceType")
      .populate("businessReply.repliedBy", "fullName avatar")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đánh giá thành công",
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
};
