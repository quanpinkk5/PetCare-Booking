
const mongoose = require("mongoose");

const Review = require("../../models/Review");
const Booking = require("../../models/Booking");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const Business = require("../../models/Business");

// ============================================
// KHÁCH HÀNG TẠO ĐÁNH GIÁ DỊCH VỤ
// POST /api/customer/reviews
// ============================================

const createReview = async (req, res, next) => {
  try {
    // Lấy mã khách hàng đang đăng nhập
    const customerId = req.user._id || req.user.id;

    // Lấy dữ liệu khách hàng gửi lên
    const {
      bookingId,
      rating,
      comment,
      images,
    } = req.body;

    // Kiểm tra mã lịch đặt
    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Mã lịch đặt không hợp lệ",
      });
    }

    // Kiểm tra số sao đánh giá
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Số sao đánh giá phải là số nguyên từ 1 đến 5",
      });
    }

    // Kiểm tra nội dung đánh giá
    if (
      comment !== undefined &&
      typeof comment !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Nội dung đánh giá phải là chuỗi",
      });
    }

    // Kiểm tra danh sách hình ảnh
    if (
      images !== undefined &&
      (
        !Array.isArray(images) ||
        !images.every(
          (image) => typeof image === "string"
        )
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Danh sách hình ảnh không hợp lệ",
      });
    }

    // Kiểm tra lịch đặt thuộc khách hàng
    const booking = await Booking.findOne({
      _id: bookingId,
      customerId,
    }).lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch đặt của bạn",
      });
    }

    // Chỉ được đánh giá lịch đã hoàn thành
    if (booking.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được đánh giá lịch đặt đã hoàn thành",
      });
    }

    // Kiểm tra lịch đặt đã được đánh giá chưa
    const existingReview = await Review.findOne({
      bookingId,
    }).lean();

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "Lịch đặt này đã được đánh giá",
      });
    }

    // Lấy thông tin dịch vụ tại chi nhánh
    const branchService = await BranchService.findById(
      booking.branchServiceId
    ).lean();

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ của lịch đặt",
      });
    }

    // Lấy thông tin chi nhánh
    const branch = await Branch.findById(
      branchService.branchId
    ).lean();

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // Kiểm tra cơ sở kinh doanh tồn tại
    const business = await Business.findById(
      branch.businessId
    ).lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cơ sở kinh doanh",
      });
    }

    // Kiểm tra dịch vụ thuộc cơ sở kinh doanh
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: business._id,
    }).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    // Tạo đánh giá
    const review = await Review.create({
      bookingId: booking._id,
      customerId,
      businessId: business._id,
      branchId: branch._id,
      serviceId: service._id,
      rating,
      comment: comment || "",
      images: images || [],
      status: "VISIBLE",
    });

    return res.status(201).json({
      success: true,
      message: "Đánh giá dịch vụ thành công",
      data: review,
    });

  } catch (error) {
    // Xử lý trường hợp hai yêu cầu đánh giá
    // cùng một lịch đặt được gửi đồng thời
    if (
      error.code === 11000 &&
      error.keyPattern?.bookingId
    ) {
      return res.status(409).json({
        success: false,
        message: "Lịch đặt này đã được đánh giá",
      });
    }

    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    // Lấy mã khách hàng và mã đánh giá
    const customerId = req.user._id || req.user.id;
    const { id } = req.params;

    // Kiểm tra mã đánh giá
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Mã đánh giá không hợp lệ",
      });
    }

    // Chỉ cho phép cập nhật các trường này
    const allowedFields = ["rating", "comment", "images"];
    const fields = Object.keys(req.body || {});

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp thông tin cần cập nhật",
      });
    }

    if (fields.some((field) => !allowedFields.includes(field))) {
      return res.status(400).json({
        success: false,
        message: "Có trường thông tin không được phép cập nhật",
      });
    }

    const { rating, comment, images } = req.body;

    // Kiểm tra số sao nếu có cập nhật
    if (
      rating !== undefined &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "Số sao đánh giá phải là số nguyên từ 1 đến 5",
      });
    }

    // Kiểm tra nội dung nếu có cập nhật
    if (
      comment !== undefined &&
      typeof comment !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Nội dung đánh giá phải là chuỗi",
      });
    }

    // Kiểm tra hình ảnh nếu có cập nhật
    if (
      images !== undefined &&
      (
        !Array.isArray(images) ||
        !images.every((image) => typeof image === "string")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Danh sách hình ảnh không hợp lệ",
      });
    }

    // Tạo dữ liệu cập nhật
    const updateData = {};

    if (rating !== undefined) {
      updateData.rating = rating;
    }

    if (comment !== undefined) {
      updateData.comment = comment;
    }

    if (images !== undefined) {
      updateData.images = images;
    }

    // Chỉ cập nhật đánh giá thuộc khách hàng và đang hiển thị
    const review = await Review.findOneAndUpdate(
      {
        _id: id,
        customerId,
        status: "VISIBLE",
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy đánh giá được phép cập nhật",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    // Lấy mã khách hàng đang đăng nhập
    const customerId = req.user._id || req.user.id;

    // Lấy mã đánh giá
    const { id } = req.params;

    // Kiểm tra mã đánh giá
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Mã đánh giá không hợp lệ",
      });
    }

    // Chỉ ẩn đánh giá của khách hàng đang đăng nhập
    // và đánh giá hiện đang hiển thị
    const review = await Review.findOneAndUpdate(
      {
        _id: id,
        customerId,
        status: "VISIBLE",
      },
      {
        $set: {
          status: "HIDDEN",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá có thể xóa của bạn",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    // Lấy ID khách hàng từ token
    const customerId = req.user._id || req.user.id;

    // Lấy tất cả đánh giá của khách hàng
    const reviews = await Review.find({
      customerId,
    })
      .populate("bookingId", "bookingCode bookingType status")
      .populate("businessId", "name logo")
      .populate("branchId", "name address")
      .populate("serviceId", "name serviceType")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy tất cả đánh giá của khách hàng thành công",
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
    updateReview,
    deleteReview,
    getMyReviews,
};
