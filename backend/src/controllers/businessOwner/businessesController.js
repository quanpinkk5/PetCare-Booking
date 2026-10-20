const Business = require("../../models/Business");

// ==============================
// POST - Tạo Business
// ==============================
const createBusiness = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền quản lý doanh nghiệp",
      });
    }

    // 2. Lấy dữ liệu từ frontend
    const {
      name,
      description,
      logo,
      images,
      phone,
      email,
    } = req.body;

    // 3. Kiểm tra tên Business
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên doanh nghiệp không được để trống",
      });
    }

    // 4. Kiểm tra các field dạng String
    const stringFields = [
      "description",
      "logo",
      "phone",
      "email",
    ];

    for (const field of stringFields) {
      if (
        req.body[field] !== undefined &&
        typeof req.body[field] !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} phải là chuỗi`,
        });
      }
    }

    // 5. Kiểm tra images
    if (
      images !== undefined &&
      (
        !Array.isArray(images) ||
        !images.every((image) => typeof image === "string")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "images phải là mảng các chuỗi",
      });
    }

    // 6. Lấy ID chủ doanh nghiệp từ JWT
    const ownerId = req.user._id || req.user.id;

    // 7. Tạo slug từ tên Business
    const slug = name
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Không thể tạo slug từ tên doanh nghiệp",
      });
    }

    // 8. Kiểm tra slug trùng
    const existingBusiness = await Business.findOne({
      slug,
    });

    if (existingBusiness) {
      return res.status(409).json({
        success: false,
        message: "Tên đường dẫn doanh nghiệp đã tồn tại",
      });
    }

    // 9. Tạo Business
    const business = await Business.create({
      ownerId,
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      logo: logo?.trim() || "",
      images: images || [],
      phone: phone?.trim() || "",
      email: email?.trim() || "",
      status: "PENDING",
      averageRating: 0,
      totalReviews: 0,
    });

    // 10. Trả kết quả
    return res.status(201).json({
      success: true,
      message: "Đăng ký doanh nghiệp thành công, đang chờ duyệt",
      data: business,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Thông tin doanh nghiệp đã tồn tại",
      });
    }

    next(error);
  }
};

// ==============================
// GET - Danh sách Business của Owner
// ==============================
const getAllBusinesses = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền quản lý doanh nghiệp",
      });
    }

    // 2. Lấy ID chủ doanh nghiệp từ JWT
    const ownerId = req.user._id || req.user.id;

    // 3. Lấy tất cả Business của Owner
    const businesses = await Business.find({
      ownerId,
    }).sort({ createdAt: -1 });

    // 4. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách doanh nghiệp thành công",
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

// GET - Lấy Businesses theo ID
// ==============================
const getBusinessesById = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền quản lý doanh nghiệp",
      });
    }

    // 2. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 3. Lấy ID Business từ URL
    const businessId = req.params.id;

    // 4. Kiểm tra ID có hợp lệ không
    if (!mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({
        success: false,
        message: "ID doanh nghiệp không hợp lệ",
      });
    }

    // 5. Tìm Business theo ID và Owner
    const business = await Business.findOne({
      _id: businessId,
      ownerId,
    });

    // 6. Không tìm thấy Business
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy doanh nghiệp",
      });
    }

    // 7. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin doanh nghiệp thành công",
      data: business,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusinessesById,
};