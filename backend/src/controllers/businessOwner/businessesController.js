const mongoose = require("mongoose");
const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const Review = require("../../models/Review");
const parseRegistration = require("../../utils/businessRegistration");

const getBusinessProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({ success: false, message: "Bạn không có quyền xem hồ sơ cơ sở" });
    }
    const business = await Business.findOne({ ownerId: req.user._id || req.user.id }).lean();
    if (!business) {
      return res.status(200).json({ success: true, data: { business: null, branches: [], stats: null } });
    }
    const [branches, services, ratings] = await Promise.all([
      Branch.find({ businessId: business._id }).select("name address status").sort({ createdAt: 1 }).lean(),
      Service.countDocuments({ businessId: business._id, status: "ACTIVE" }),
      Review.aggregate([
        { $match: { businessId: business._id, status: "VISIBLE" } },
        { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      ]),
    ]);
    return res.status(200).json({ success: true, data: {
      business, branches,
      stats: { branches: branches.length, activeBranches: branches.filter((item) => item.status === "ACTIVE").length,
        services, averageRating: ratings[0]?.averageRating || 0, totalReviews: ratings[0]?.totalReviews || 0 },
      owner: { fullName: req.user.fullName, email: req.user.email, avatar: req.user.avatar },
    } });
  } catch (error) { next(error); }
};

const updateBusiness = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({ success: false, message: "Bạn không có quyền cập nhật hồ sơ cơ sở" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID doanh nghiệp không hợp lệ" });
    }
    const strings = ["name", "description", "logo", "phone", "email", "businessType", "licenseNumber", "website", "socialUrl", "note"];
    const allowed = [...strings, "address", "openingHours", "images", "policies"];
    const body = req.body;
    const invalid = (message) => res.status(400).json({ success: false, message });
    if (!body || typeof body !== "object" || Array.isArray(body) || !Object.keys(body).length || Object.keys(body).some((key) => !allowed.includes(key))) {
      return invalid("Dữ liệu cập nhật hồ sơ không hợp lệ");
    }
    const updates = {};
    for (const field of strings) {
      if (body[field] === undefined) continue;
      if (typeof body[field] !== "string" || body[field].length > 5000 || (field === "name" && !body[field].trim())) {
        return invalid(`${field} không hợp lệ (tối đa 5000 ký tự)`);
      }
      updates[field] = body[field].trim();
    }
    for (const field of ["logo", "website", "socialUrl"]) {
      if (updates[field] && !/^https?:\/\/[^\s]+$/i.test(updates[field])) return invalid("Đường dẫn phải bắt đầu bằng http:// hoặc https://");
    }
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) return invalid("Email không hợp lệ");
    for (const field of ["images", "policies"]) {
      if (body[field] === undefined) continue;
      if (!Array.isArray(body[field]) || body[field].length > 100 || !body[field].every((item) => typeof item === "string" && item.length <= 5000)) {
        return invalid(`${field} phải là mảng tối đa 100 chuỗi`);
      }
      updates[field] = body[field].map((item) => item.trim()).filter(Boolean);
    }
    if (updates.images?.some((url) => !/^https?:\/\/[^\s]+$/i.test(url))) return invalid("Hình ảnh phải là đường dẫn HTTP/HTTPS");
    if (body.address !== undefined) {
      if (!body.address || typeof body.address !== "object" || Array.isArray(body.address) ||
        Object.entries(body.address).some(([key, value]) => !["detail", "street", "ward", "district", "province", "city"].includes(key) || typeof value !== "string" || value.length > 1000)) {
        return invalid("Địa chỉ không hợp lệ");
      }
      for (const [key, value] of Object.entries(body.address)) updates[`address.${key}`] = value.trim();
    }
    if (body.openingHours !== undefined) {
      if (!Array.isArray(body.openingHours) || body.openingHours.length > 100 || !body.openingHours.every((item) => item &&
        typeof item.day === "string" && item.day.trim() && item.day.length <= 100 && typeof item.time === "string" && item.time.trim() && item.time.length <= 100)) {
        return invalid("Giờ hoạt động cần có ngày và khung giờ hợp lệ");
      }
      updates.openingHours = body.openingHours.map(({ day, time }) => ({ day: day.trim(), time: time.trim() }));
    }
    if (!Object.keys(updates).length) return invalid("Chưa có thông tin cần cập nhật");
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id || req.user.id },
      { $set: updates }, { new: true, runValidators: true },
    );
    if (!business) return res.status(404).json({ success: false, message: "Không tìm thấy cơ sở thuộc tài khoản của bạn" });
    return res.status(200).json({ success: true, message: "Cập nhật hồ sơ cơ sở thành công", data: business });
  } catch (error) { next(error); }
};

// ==============================
// POST - Tạo Business
// ==============================
const createBusiness = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") return res.status(403).json({ success: false, message: "Bạn không có quyền đăng ký cơ sở" });
    const registration = parseRegistration(req.body);
    if (registration.error) return res.status(400).json({ success: false, message: registration.error });
    const ownerId = req.user._id || req.user.id;
    if (await Business.findOne({ ownerId })) return res.status(409).json({ success: false, message: "Tài khoản đã có hồ sơ cơ sở. Vui lòng tải lại để kiểm tra trạng thái." });
    const slug = registration.data.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) return res.status(400).json({ success: false, message: "Không thể tạo đường dẫn từ tên cơ sở" });
    if (await Business.findOne({ slug })) return res.status(409).json({ success: false, message: "Tên đường dẫn cơ sở đã tồn tại. Vui lòng dùng tên khác." });
    const business = await Business.create({ ...registration.data, ownerId, slug, status: "PENDING", averageRating: 0, totalReviews: 0 });
    return res.status(201).json({ success: true, message: "Đã gửi hồ sơ cơ sở, đang chờ Admin duyệt", data: business });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "Hồ sơ cơ sở đã tồn tại. Vui lòng tải lại để kiểm tra." });
    next(error);
  }
};

const resubmitBusiness = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") return res.status(403).json({ success: false, message: "Bạn không có quyền gửi hồ sơ cơ sở" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "ID cơ sở không hợp lệ" });
    const registration = parseRegistration(req.body);
    if (registration.error) return res.status(400).json({ success: false, message: registration.error });
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id || req.user.id, status: "REJECTED" },
      { $set: { ...registration.data, status: "PENDING" } }, { new: true, runValidators: true },
    );
    if (!business) return res.status(409).json({ success: false, message: "Chỉ có thể gửi lại hồ sơ bị từ chối thuộc tài khoản của bạn. Vui lòng kiểm tra trạng thái mới nhất." });
    return res.status(200).json({ success: true, message: "Đã gửi lại hồ sơ để Admin duyệt", data: business });
  } catch (error) { next(error); }
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
  resubmitBusiness,
  getBusinessProfile,
  updateBusiness,
  createBusiness,
  getAllBusinesses,
  getBusinessesById,
};
