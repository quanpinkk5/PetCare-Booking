const mongoose = require("mongoose");
const Branch = require("../../models/Branch");
const Business = require("../../models/Business");

// POST - Tạo chi nhánh
const createBranch = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tạo chi nhánh",
      });
    }

    // 2. Lấy dữ liệu từ frontend
    const { businessId, name, phone, email, address, openingHours, images } =
      req.body;

    // 3. Kiểm tra businessId
    if (!mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({
        success: false,
        message: "businessId không hợp lệ",
      });
    }

    // 4. Kiểm tra tên chi nhánh
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên chi nhánh không được để trống",
      });
    }

    // 5. Kiểm tra dữ liệu
    if (
      (phone !== undefined && typeof phone !== "string") ||
      (email !== undefined && typeof email !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "phone và email phải là chuỗi",
      });
    }

    if (
      address !== undefined &&
      (address === null ||
        typeof address !== "object" ||
        Array.isArray(address))
    ) {
      return res.status(400).json({
        success: false,
        message: "address phải là object",
      });
    }

    if (openingHours !== undefined && !Array.isArray(openingHours)) {
      return res.status(400).json({
        success: false,
        message: "openingHours phải là mảng",
      });
    }

    if (images !== undefined && !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "images phải là mảng",
      });
    }

    // 6. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 7. Kiểm tra Business có thuộc Owner không
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

    // 8. Tạo chi nhánh
    const branch = await Branch.create({
      businessId,
      name: name.trim(),
      phone: phone?.trim() || "",
      email: email?.trim() || "",
      address,
      openingHours,
      images,
      status: "ACTIVE",
    });

    // 9. Trả kết quả
    return res.status(201).json({
      success: true,
      message: "Tạo chi nhánh thành công",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// PATCH - Cập nhật chi nhánh
// ==============================
const updateBranch = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật chi nhánh",
      });
    }

    // 2. Lấy ID chi nhánh từ URL
    const branchId = req.params.id;

    if (!mongoose.isValidObjectId(branchId)) {
      return res.status(400).json({
        success: false,
        message: "ID chi nhánh không hợp lệ",
      });
    }

    // 3. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 4. Tìm chi nhánh
    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 5. Kiểm tra Business có thuộc Owner không
    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh thuộc doanh nghiệp của bạn",
      });
    }

    // 6. Lấy dữ liệu cập nhật
    const { name, phone, email, address, openingHours, images, status } =
      req.body;

    // 7. Kiểm tra dữ liệu
    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({
        success: false,
        message: "Tên chi nhánh không hợp lệ",
      });
    }

    if (
      (phone !== undefined && typeof phone !== "string") ||
      (email !== undefined && typeof email !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "phone và email phải là chuỗi",
      });
    }

    if (
      address !== undefined &&
      (address === null ||
        typeof address !== "object" ||
        Array.isArray(address))
    ) {
      return res.status(400).json({
        success: false,
        message: "address phải là object",
      });
    }

    if (openingHours !== undefined && !Array.isArray(openingHours)) {
      return res.status(400).json({
        success: false,
        message: "openingHours phải là mảng",
      });
    }

    if (images !== undefined && !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "images phải là mảng",
      });
    }

    if (status !== undefined && !["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái chi nhánh không hợp lệ",
      });
    }

    // 8. Chỉ cập nhật các field được gửi lên
    if (name !== undefined) branch.name = name.trim();
    if (phone !== undefined) branch.phone = phone.trim();
    if (email !== undefined) branch.email = email.trim();
    if (address !== undefined) branch.address = address;
    if (openingHours !== undefined) {
      branch.openingHours = openingHours;
    }
    if (images !== undefined) branch.images = images;
    if (status !== undefined) branch.status = status;

    // 9. Lưu thay đổi
    await branch.save();

    // 10. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Cập nhật chi nhánh thành công",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// GET - Xem chi tiết chi nhánh
// ==============================
const getBranchById = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem chi nhánh",
      });
    }

    // 2. Lấy ID chi nhánh từ URL
    const branchId = req.params.id;

    // 3. Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(branchId)) {
      return res.status(400).json({
        success: false,
        message: "ID chi nhánh không hợp lệ",
      });
    }

    // 4. Lấy ID Owner từ JWT
    const ownerId = req.user._id || req.user.id;

    // 5. Tìm chi nhánh theo ID
    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 6. Kiểm tra Business có thuộc Owner không
    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh thuộc doanh nghiệp của bạn",
      });
    }

    // 7. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết chi nhánh thành công",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createBranch,
  updateBranch,
  getBranchById,
};
