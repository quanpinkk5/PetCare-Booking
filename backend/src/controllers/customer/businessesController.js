const Business = require("../../models/Business");
const mongoose = require("mongoose");
// GET /api/customer/businesses
const getAllBusinesses = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    // Validate phân trang
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "page hoặc limit không hợp lệ",
      });
    }

    // Validate tìm kiếm
    if (typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "search phải là chuỗi",
      });
    }

    const skip = (page - 1) * limit;

    // Escape ký tự đặc biệt trong regex
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Chỉ hiển thị doanh nghiệp đã được duyệt
    const filter = {
      status: "APPROVED",
    };

    if (escapedSearch) {
      filter.name = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    // Lấy danh sách và tổng số doanh nghiệp
    const [businesses, total] = await Promise.all([
      Business.find(filter)
        .select(
          "name slug description logo images phone averageRating totalReviews",
        )
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Business.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách doanh nghiệp thành công",
      data: businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// GET - Xem chi tiết doanh nghiệp
// ======================================
const getBusinessById = async (req, res, next) => {
  try {
    // 1. Lấy ID từ URL
    const { id } = req.params;

    // 2. Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID doanh nghiệp không hợp lệ",
      });
    }

    // 3. Tìm doanh nghiệp đã được Admin duyệt
    const business = await Business.findOne({
      _id: id,
      status: "APPROVED",
    })
      .select(
        "name slug description logo images phone email averageRating totalReviews createdAt",
      )
      .lean();

    // 4. Không tìm thấy doanh nghiệp
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy doanh nghiệp",
      });
    }

    // 5. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết doanh nghiệp thành công",
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessById,
};
