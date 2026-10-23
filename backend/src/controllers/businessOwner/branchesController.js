const mongoose = require("mongoose");
const Branch = require("../../models/Branch");
const Business = require("../../models/Business");
const BranchService = require("../../models/BranchService");
const Booking = require("../../models/Booking");

const validateBranchBody = (body, creating = false) => {
  const allowed = ["name", "phone", "email", "address", "openingHours", "images", ...(creating ? ["businessId"] : ["status"])];
  if (!body || Array.isArray(body) || typeof body !== "object" || !Object.keys(body).length || Object.keys(body).some((key) => !allowed.includes(key))) return "Dữ liệu chi nhánh không hợp lệ";
  for (const field of ["name", "phone", "email"]) {
    if (body[field] !== undefined && (typeof body[field] !== "string" || body[field].length > 1000)) return `${field} không hợp lệ`;
  }
  if (body.name !== undefined && !body.name.trim()) return "Tên chi nhánh không được để trống";
  if (body.status !== undefined && !["ACTIVE", "INACTIVE"].includes(body.status)) return "Trạng thái chi nhánh không hợp lệ";
  if (body.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return "Email không hợp lệ";
  if (body.address !== undefined && (!body.address || Array.isArray(body.address) || typeof body.address !== "object" ||
    Object.entries(body.address).some(([key, value]) => !["detail", "street", "ward", "district", "province", "city"].includes(key) || typeof value !== "string" || value.length > 1000))) return "Địa chỉ không hợp lệ";
  if (body.images !== undefined && (!Array.isArray(body.images) || body.images.length > 100 || !body.images.every((url) => typeof url === "string" && url.length <= 5000 && /^https?:\/\/[^\s]+$/i.test(url)))) return "Hình ảnh phải là mảng tối đa 100 đường dẫn HTTP/HTTPS";
  if (body.openingHours !== undefined && (!Array.isArray(body.openingHours) || body.openingHours.length > 100 || !body.openingHours.every((item) => item && typeof item === "object" &&
    typeof item.day === "string" && item.day.trim() && item.day.length <= 100 && typeof item.time === "string" && item.time.trim() && item.time.length <= 100))) return "Giờ hoạt động cần có ngày và khung giờ hợp lệ";
  return null;
};

// Date-only booking dates are stored at UTC midnight; choose the calendar month in Vietnam.
const getMonthBounds = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "numeric" }).formatToParts(now);
  const year = Number(parts.find((item) => item.type === "year").value);
  const month = Number(parts.find((item) => item.type === "month").value) - 1;
  return { previous: new Date(Date.UTC(year, month - 1, 1)), current: new Date(Date.UTC(year, month, 1)), next: new Date(Date.UTC(year, month + 1, 1)) };
};

const getBranches = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") return res.status(403).json({ success: false, message: "Bạn không có quyền xem danh sách chi nhánh" });
    const business = await Business.findOne({ ownerId: req.user._id || req.user.id }).select("name logo").lean();
    if (!business) return res.status(200).json({ success: true, business: null, data: [] });
    const branches = await Branch.find({ businessId: business._id }).sort({ createdAt: -1, _id: -1 }).lean();
    if (!branches.length) return res.status(200).json({ success: true, business, data: [] });
    const ids = branches.map((branch) => branch._id);
    const bounds = getMonthBounds();
    const [services, bookings] = await Promise.all([
      BranchService.aggregate([
        { $match: { branchId: { $in: ids }, status: "ACTIVE" } },
        { $lookup: { from: "services", localField: "serviceId", foreignField: "_id", as: "service" } },
        { $unwind: "$service" },
        { $match: { "service.businessId": business._id, "service.status": "ACTIVE" } },
        { $group: { _id: "$branchId", count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { status: { $ne: "CANCELLED" }, $or: [
          { bookingType: "APPOINTMENT", bookingDate: { $gte: bounds.previous, $lt: bounds.next } },
          { bookingType: "BOARDING", checkInDate: { $gte: bounds.previous, $lt: bounds.next } },
        ] } },
        { $lookup: { from: "branchServices", localField: "branchServiceId", foreignField: "_id", as: "offering" } },
        { $unwind: "$offering" },
        { $match: { "offering.branchId": { $in: ids } } },
        { $project: { branchId: "$offering.branchId", date: { $cond: [{ $eq: ["$bookingType", "BOARDING"] }, "$checkInDate", "$bookingDate"] } } },
        { $group: { _id: "$branchId", current: { $sum: { $cond: [{ $gte: ["$date", bounds.current] }, 1, 0] } }, previous: { $sum: { $cond: [{ $lt: ["$date", bounds.current] }, 1, 0] } } } },
      ]),
    ]);
    const serviceMap = new Map(services.map((item) => [String(item._id), item.count]));
    const bookingMap = new Map(bookings.map((item) => [String(item._id), item]));
    return res.status(200).json({ success: true, business, data: branches.map((branch) => ({
      ...branch, serviceCount: serviceMap.get(String(branch._id)) || 0,
      monthlyBookings: bookingMap.get(String(branch._id))?.current || 0,
      previousMonthBookings: bookingMap.get(String(branch._id))?.previous || 0,
    })) });
  } catch (error) { next(error); }
};

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

    const validationError = validateBranchBody(req.body, true);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

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

    const validationError = validateBranchBody(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

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
  getBranches,
  getMonthBounds,
  createBranch,
  updateBranch,
  getBranchById,
};
