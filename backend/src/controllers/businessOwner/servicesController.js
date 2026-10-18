const mongoose = require("mongoose");
const Service = require("../../models/Service");
const Business = require("../../models/Business");
const ServiceCategory = require("../../models/ServiceCategory");


// ==============================
// POST - Tạo dịch vụ
// ==============================
const createService = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tạo dịch vụ",
      });
    }

    // 2. Lấy dữ liệu từ request
    const {
      businessId,
      categoryId,
      name,
      description,
      serviceType,
      images,
    } = req.body;

    // 3. Kiểm tra ID
    if (
      !mongoose.isValidObjectId(businessId) ||
      !mongoose.isValidObjectId(categoryId)
    ) {
      return res.status(400).json({
        success: false,
        message: "businessId hoặc categoryId không hợp lệ",
      });
    }

    // 4. Kiểm tra tên dịch vụ
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên dịch vụ không được để trống",
      });
    }

    // 5. Kiểm tra loại dịch vụ
    if (!["APPOINTMENT", "BOARDING"].includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: "Loại dịch vụ không hợp lệ",
      });
    }

    // 6. Kiểm tra dữ liệu khác
    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "description phải là chuỗi",
      });
    }

    if (
      images !== undefined &&
      (!Array.isArray(images) ||
        !images.every((image) => typeof image === "string"))
    ) {
      return res.status(400).json({
        success: false,
        message: "images phải là mảng các chuỗi",
      });
    }

    // 7. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 8. Kiểm tra Business thuộc Owner
    const business = await Business.findOne({
      _id: businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy doanh nghiệp thuộc tài khoản của bạn",
      });
    }

    // 9. Kiểm tra danh mục dịch vụ do Admin tạo
    const category = await ServiceCategory.findOne({
      _id: categoryId,
      status: "ACTIVE",
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục dịch vụ không tồn tại hoặc đã ngừng hoạt động",
      });
    }

    // 10. Tạo dịch vụ
    const service = await Service.create({
      businessId,
      categoryId,
      name: name.trim(),
      description: description?.trim() || "",
      serviceType,
      images: images || [],
      status: "ACTIVE",
    });

    // 11. Trả kết quả
    return res.status(201).json({
      success: true,
      message: "Tạo dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET - Danh sách dịch vụ của Business
// ==============================
const getAllServices = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem dịch vụ",
      });
    }

    // 2. Lấy businessId từ query
    const { businessId } = req.query;

    if (!mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({
        success: false,
        message: "businessId không hợp lệ",
      });
    }

    // 3. Kiểm tra quyền sở hữu Business
    const ownerId = req.user._id || req.user.id;

    const business = await Business.findOne({
      _id: businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy doanh nghiệp thuộc tài khoản của bạn",
      });
    }

    // 4. Lấy danh sách dịch vụ
    const services = await Service.find({
      businessId,
    })
      .populate("categoryId", "name code")
      .sort({ createdAt: -1 });

    // 5. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách dịch vụ thành công",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// PATCH - Cập nhật dịch vụ
// ==============================
const updateService = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật dịch vụ",
      });
    }

    // 2. Lấy ID dịch vụ từ URL
    const serviceId = req.params.id;

    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ không hợp lệ",
      });
    }

    // 3. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 4. Tìm dịch vụ
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    // 5. Kiểm tra Business có thuộc Owner không
    const business = await Business.findOne({
      _id: service.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc doanh nghiệp của bạn",
      });
    }

    // 6. Lấy dữ liệu cập nhật
    const {
      categoryId,
      name,
      description,
      serviceType,
      images,
      status,
    } = req.body;

    // 7. Kiểm tra tên dịch vụ
    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Tên dịch vụ không hợp lệ",
      });
    }

    // 8. Kiểm tra mô tả
    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "description phải là chuỗi",
      });
    }

    // 9. Kiểm tra loại dịch vụ
    if (
      serviceType !== undefined &&
      !["APPOINTMENT", "BOARDING"].includes(serviceType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Loại dịch vụ không hợp lệ",
      });
    }

    // 10. Kiểm tra images
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

    // 11. Kiểm tra trạng thái
    if (
      status !== undefined &&
      !["ACTIVE", "INACTIVE"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái dịch vụ không hợp lệ",
      });
    }

    // 12. Nếu đổi danh mục, kiểm tra danh mục mới
    if (categoryId !== undefined) {
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "categoryId không hợp lệ",
        });
      }

      const category = await ServiceCategory.findOne({
        _id: categoryId,
        status: "ACTIVE",
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Danh mục không tồn tại hoặc đã ngừng hoạt động",
        });
      }

      service.categoryId = categoryId;
    }

    // 13. Chỉ cập nhật các field được gửi lên
    if (name !== undefined) {
      service.name = name.trim();
    }

    if (description !== undefined) {
      service.description = description.trim();
    }

    if (serviceType !== undefined) {
      service.serviceType = serviceType;
    }

    if (images !== undefined) {
      service.images = images;
    }

    if (status !== undefined) {
      service.status = status;
    }

    // 14. Lưu thay đổi
    await service.save();

    // 15. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Cập nhật dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// GET - Xem chi tiết dịch vụ
// ==============================
const getServiceById = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem dịch vụ",
      });
    }

    // 2. Lấy ID dịch vụ từ URL
    const serviceId = req.params.id;

    // 3. Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ không hợp lệ",
      });
    }

    // 4. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 5. Tìm dịch vụ theo ID
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    // 6. Kiểm tra Business có thuộc Owner không
    const business = await Business.findOne({
      _id: service.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc doanh nghiệp của bạn",
      });
    }

    // 7. Lấy thông tin danh mục của dịch vụ
    await service.populate("categoryId", "name code description");

    // 8. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createService,
  getAllServices,
    updateService,
    getServiceById,
};