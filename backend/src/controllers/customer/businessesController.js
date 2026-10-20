const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const mongoose = require("mongoose");
// GET /api/customer/businesses
const getAllBusinesses = async (req, res, next) => {
  try {
    const { search = "", location = "", sort = "newest" } = req.query;
    const minRating = Number(req.query.minRating ?? 0);
    const sorts = {
      newest: { createdAt: -1, _id: -1 },
      rating: { averageRating: -1, totalReviews: -1, _id: -1 },
      popular: { totalReviews: -1, averageRating: -1, _id: -1 },
    };

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
    if (typeof search !== "string" || typeof location !== "string" ||
        typeof sort !== "string" || !Object.hasOwn(sorts, sort) ||
        !Number.isFinite(minRating) || minRating < 0 || minRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Bộ lọc tìm kiếm không hợp lệ",
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

    if (minRating > 0) filter.averageRating = { $gte: minRating };
    if (location.trim()) {
      const escapedLocation = location.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = { $regex: escapedLocation, $options: "i" };
      const ids = await Branch.distinct("businessId", {
        status: "ACTIVE",
        $or: [{ "address.province": regex }, { "address.district": regex },
          { "address.ward": regex }, { "address.detail": regex }, { address: regex }],
      });
      filter._id = { $in: ids };
    }

    // Lấy danh sách và tổng số doanh nghiệp
    const [businesses, total] = await Promise.all([
      Business.find(filter)
        .select(
          "name slug description logo images phone averageRating totalReviews",
        )
        .sort(sorts[sort])
        .skip(skip)
        .limit(limit)
        .lean(),

      Business.countDocuments(filter),
    ]);

    const branches = businesses.length ? await Branch.find({
      businessId: { $in: businesses.map((item) => item._id) }, status: "ACTIVE",
    }).select("businessId name address").sort({ createdAt: -1, _id: -1 }).lean() : [];
    const branchesByBusiness = new Map();
    for (const branch of branches) {
      const key = branch.businessId.toString();
      if (!branchesByBusiness.has(key)) branchesByBusiness.set(key, []);
      branchesByBusiness.get(key).push(branch);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách doanh nghiệp thành công",
      data: businesses.map((business) => ({
        ...business, branches: branchesByBusiness.get(business._id.toString()) || [],
      })),
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
