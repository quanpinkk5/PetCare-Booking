const mongoose = require("mongoose");

const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const Business = require("../../models/Business");

const validateBody = (body, creating = false) => {
  const allowed = ["price", "pricingUnit", "durationMinutes", "capacity", "petTypes", "status", ...(creating ? ["branchId", "serviceId"] : [])];
  if (!body || typeof body !== "object" || Array.isArray(body) || !Object.keys(body).length || Object.keys(body).some((key) => !allowed.includes(key))) return "Dữ liệu dịch vụ chi nhánh không hợp lệ";
  if ((creating || body.price !== undefined) && (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0)) return "Giá phải là số không âm";
  if ((creating || body.pricingUnit !== undefined) && !["PER_SERVICE", "PER_DAY"].includes(body.pricingUnit)) return "Đơn vị tính không hợp lệ";
  if (body.durationMinutes !== undefined && body.durationMinutes !== null && (!Number.isSafeInteger(body.durationMinutes) || body.durationMinutes <= 0)) return "Thời lượng phải là số nguyên dương";
  if ((creating || body.capacity !== undefined) && (!Number.isSafeInteger(body.capacity) || body.capacity <= 0)) return "Công suất phải là số nguyên dương";
  if ((creating || body.petTypes !== undefined) && (!Array.isArray(body.petTypes) || !body.petTypes.length || body.petTypes.some((pet) => !["DOG", "CAT"].includes(pet)) || new Set(body.petTypes).size !== body.petTypes.length)) return "Chọn Chó và/hoặc Mèo, không trùng lặp";
  if (body.status !== undefined && !["ACTIVE", "INACTIVE"].includes(body.status)) return "Trạng thái không hợp lệ";
  return null;
};

// ==============================
// POST - Thêm dịch vụ vào chi nhánh
// ==============================
const createBranchService = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thêm dịch vụ vào chi nhánh",
      });
    }

    const validationError = validateBody(req.body, true);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    // 2. Lấy dữ liệu
    const {
      branchId,
      serviceId,
      price,
      pricingUnit,
      durationMinutes,
      capacity,
      petTypes,
      status,
    } = req.body;

    // 3. Kiểm tra ID
    if (
      !mongoose.isValidObjectId(branchId) ||
      !mongoose.isValidObjectId(serviceId)
    ) {
      return res.status(400).json({
        success: false,
        message: "branchId hoặc serviceId không hợp lệ",
      });
    }

    // 4. Kiểm tra giá
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Giá dịch vụ phải là số không âm",
      });
    }

    // 5. Kiểm tra đơn vị tính giá
    if (!["PER_SERVICE", "PER_DAY"].includes(pricingUnit)) {
      return res.status(400).json({
        success: false,
        message: "pricingUnit phải là PER_SERVICE hoặc PER_DAY",
      });
    }

    // 6. Kiểm tra thời gian
    if (
      durationMinutes !== undefined && durationMinutes !== null &&
      (!Number.isInteger(durationMinutes) || durationMinutes <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "durationMinutes phải là số nguyên dương",
      });
    }

    // 7. Kiểm tra sức chứa
    if (
      capacity !== undefined &&
      (!Number.isInteger(capacity) || capacity <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "capacity phải là số nguyên dương",
      });
    }

    // 8. Kiểm tra loại thú cưng
    if (
      petTypes !== undefined &&
      (!Array.isArray(petTypes) ||
        petTypes.length === 0 ||
        !petTypes.every((type) => ["DOG", "CAT"].includes(type)))
    ) {
      return res.status(400).json({
        success: false,
        message: "petTypes phải là mảng gồm DOG hoặc CAT",
      });
    }

    // 9. Kiểm tra trạng thái
    if (status !== undefined && !["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status phải là ACTIVE hoặc INACTIVE",
      });
    }

    // 10. Lấy Owner ID từ JWT
    const ownerId = req.user._id || req.user.id;

    // 11. Tìm chi nhánh
    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 12. Kiểm tra Business của chi nhánh thuộc Owner
    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Chi nhánh không thuộc doanh nghiệp của bạn",
      });
    }

    // 13. Tìm dịch vụ
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    // 14. Kiểm tra Service và Branch thuộc cùng Business
    if (
      !service.businessId ||
      String(service.businessId) !== String(branch.businessId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ không thuộc cùng doanh nghiệp với chi nhánh",
      });
    }

    // 15. Kiểm tra Service đang hoạt động
    if (service.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ đang ngừng hoạt động",
      });
    }

    if (branch.status !== "ACTIVE") return res.status(400).json({ success: false, message: "Chi nhánh đang tạm dừng hoạt động" });
    if (pricingUnit !== (service.serviceType === "BOARDING" ? "PER_DAY" : "PER_SERVICE") ||
      (service.serviceType === "APPOINTMENT" && !Number.isSafeInteger(durationMinutes))) {
      return res.status(400).json({ success: false, message: "Đơn vị tính hoặc thời lượng không phù hợp với loại dịch vụ" });
    }

    // 16. Kiểm tra dịch vụ đã được thêm vào chi nhánh chưa
    const existingBranchService = await BranchService.findOne({
      branchId,
      serviceId,
    });

    if (existingBranchService) {
      return res.status(409).json({
        success: false,
        message: "Dịch vụ đã tồn tại trong chi nhánh này",
      });
    }

    // 17. Tạo BranchService
    const branchService = await BranchService.create({
      branchId,
      serviceId,
      price,
      pricingUnit,
      durationMinutes,
      capacity,
      petTypes,
      status: status || "ACTIVE",
    });

    // 18. Trả kết quả
    return res.status(201).json({
      success: true,
      message: "Thêm dịch vụ vào chi nhánh thành công",
      data: branchService,
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "Dịch vụ đã tồn tại trong chi nhánh này" });
    next(error);
  }
};
// ==============================
// GET - Danh sách dịch vụ của chi nhánh
// ==============================
const getAllBranchServices = async (req, res, next) => {
  try {
    if (req.user.role !== "BUSINESS_OWNER") return res.status(403).json({ success: false, message: "Bạn không có quyền xem dịch vụ chi nhánh" });
    const { branchId } = req.query;
    if (branchId !== undefined && !mongoose.isValidObjectId(branchId)) return res.status(400).json({ success: false, message: "branchId không hợp lệ" });
    const business = await Business.findOne({ ownerId: req.user._id || req.user.id }).select("name").lean();
    if (!business) return res.status(200).json({ success: true, business: null, branches: [], services: [], data: [] });
    const [branches, services] = await Promise.all([
      Branch.find({ businessId: business._id }).select("name address images status").sort({ name: 1 }).lean(),
      Service.find({ businessId: business._id }).select("name description serviceType images status categoryId").populate("categoryId", "name code").sort({ name: 1 }).lean(),
    ]);
    if (branchId && !branches.some((branch) => String(branch._id) === branchId)) return res.status(404).json({ success: false, message: "Không tìm thấy chi nhánh thuộc doanh nghiệp của bạn" });
    const ids = branchId ? [branches.find((branch) => String(branch._id) === branchId)._id] : branches.map((branch) => branch._id);
    const data = ids.length ? await BranchService.find({ branchId: { $in: ids } })
      .populate({ path: "branchId", select: "name address images status" })
      .populate({ path: "serviceId", match: { businessId: business._id }, select: "name description serviceType images status categoryId", populate: { path: "categoryId", select: "name code" } })
      .sort({ createdAt: -1, _id: -1 }).lean() : [];
    return res.status(200).json({ success: true, business, branches, services, total: data.length, data });
  } catch (error) { next(error); }
};
// ==============================
// GET - Xem chi tiết BranchService
// ==============================
const getBranchServiceById = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem dịch vụ của chi nhánh",
      });
    }

    // 2. Lấy ID từ URL
    const branchServiceId = req.params.id;

    // 3. Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ chi nhánh không hợp lệ",
      });
    }

    // 4. Lấy Owner ID từ JWT
    const ownerId = req.user._id || req.user.id;

    // 5. Tìm BranchService
    const branchService = await BranchService.findById(
      branchServiceId
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 6. Tìm Branch
    const branch = await Branch.findById(
      branchService.branchId
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 7. Kiểm tra Business thuộc Owner
    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc chi nhánh của bạn",
      });
    }

    // 8. Lấy thông tin Service
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: branch.businessId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của chi nhánh",
      });
    }

    // 9. Populate thông tin chi nhánh và dịch vụ
    await branchService.populate([
      {
        path: "branchId",
        select: "name phone email address images status",
      },
      {
        path: "serviceId",
        select: "name description serviceType images status categoryId",
        populate: {
          path: "categoryId",
          select: "name code description",
        },
      },
    ]);

    // 10. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết dịch vụ của chi nhánh thành công",
      data: branchService,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
// PATCH - Cập nhật BranchService
// ==============================
const updateBranchService = async (req, res, next) => {
  try {
    // 1. Kiểm tra quyền Business Owner
    if (req.user.role !== "BUSINESS_OWNER") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật dịch vụ chi nhánh",
      });
    }

    // 2. Kiểm tra ID BranchService
    const branchServiceId = req.params.id;

    if (!mongoose.isValidObjectId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ chi nhánh không hợp lệ",
      });
    }

    const validationError = validateBody(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    // 3. Lấy Owner ID từ JWT
    const ownerId = req.user._id || req.user.id;

    // 4. Tìm BranchService
    const branchService = await BranchService.findById(
      branchServiceId
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // 5. Tìm chi nhánh
    const branch = await Branch.findById(branchService.branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi nhánh",
      });
    }

    // 6. Kiểm tra Business thuộc Owner
    const business = await Business.findOne({
      _id: branch.businessId,
      ownerId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc chi nhánh của bạn",
      });
    }

    // 7. Kiểm tra Service thuộc cùng Business
    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: branch.businessId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không thuộc doanh nghiệp của chi nhánh",
      });
    }

    // 8. Lấy dữ liệu cập nhật
    const {
      price,
      pricingUnit,
      durationMinutes,
      capacity,
      petTypes,
      status,
    } = req.body;

    // 9. Kiểm tra có dữ liệu cập nhật hay không
    const updates = {
      price,
      pricingUnit,
      durationMinutes,
      capacity,
      petTypes,
      status,
    };

    const hasUpdates = Object.values(updates).some(
      (value) => value !== undefined
    );

    if (!hasUpdates) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu hợp lệ để cập nhật",
      });
    }

    // 10. Kiểm tra giá
    if (
      price !== undefined &&
      (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Giá dịch vụ phải là số không âm",
      });
    }

    // 11. Kiểm tra đơn vị tính giá
    if (
      pricingUnit !== undefined &&
      !["PER_SERVICE", "PER_DAY"].includes(pricingUnit)
    ) {
      return res.status(400).json({
        success: false,
        message: "pricingUnit phải là PER_SERVICE hoặc PER_DAY",
      });
    }

    // 12. Kiểm tra thời gian thực hiện
    if (
      durationMinutes !== undefined && durationMinutes !== null &&
      (
        !Number.isInteger(durationMinutes) ||
        durationMinutes <= 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "durationMinutes phải là số nguyên dương",
      });
    }

    // 13. Kiểm tra sức chứa
    if (
      capacity !== undefined &&
      (
        !Number.isInteger(capacity) ||
        capacity <= 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "capacity phải là số nguyên dương",
      });
    }

    // 14. Kiểm tra loại thú cưng
    if (
      petTypes !== undefined &&
      (
        !Array.isArray(petTypes) ||
        petTypes.length === 0 ||
        !petTypes.every((type) => ["DOG", "CAT"].includes(type)) ||
        new Set(petTypes).size !== petTypes.length
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "petTypes phải là mảng không trùng gồm DOG hoặc CAT",
      });
    }

    // 15. Kiểm tra trạng thái
    if (
      status !== undefined &&
      !["ACTIVE", "INACTIVE"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "status phải là ACTIVE hoặc INACTIVE",
      });
    }

    // 16. Không cho bật ACTIVE nếu Service gốc đang INACTIVE
    if (status === "ACTIVE" && (service.status !== "ACTIVE" || branch.status !== "ACTIVE")) {
      return res.status(400).json({
        success: false,
        message: "Không thể kích hoạt vì dịch vụ gốc hoặc chi nhánh đang ngừng hoạt động",
      });
    }

    if (pricingUnit !== undefined && pricingUnit !== (service.serviceType === "BOARDING" ? "PER_DAY" : "PER_SERVICE")) {
      return res.status(400).json({ success: false, message: "Đơn vị tính không phù hợp với loại dịch vụ" });
    }
    if (service.serviceType === "APPOINTMENT" && durationMinutes === null) return res.status(400).json({ success: false, message: "Dịch vụ hẹn lịch cần thời lượng phục vụ" });
    if (status === "ACTIVE" && (service.serviceType === "APPOINTMENT" && (!Number.isSafeInteger(durationMinutes ?? branchService.durationMinutes) || (durationMinutes ?? branchService.durationMinutes) <= 0) ||
      !(capacity ?? branchService.capacity) || !(petTypes ?? branchService.petTypes)?.length ||
      (pricingUnit ?? branchService.pricingUnit) !== (service.serviceType === "BOARDING" ? "PER_DAY" : "PER_SERVICE"))) {
      return res.status(400).json({ success: false, message: "Cần hoàn thiện thời lượng, công suất, loài thú cưng và đơn vị tính trước khi kích hoạt" });
    }

    // 17. Cập nhật các field được gửi lên
    if (price !== undefined) {
      branchService.price = price;
    }

    if (pricingUnit !== undefined) {
      branchService.pricingUnit = pricingUnit;
    }

    if (durationMinutes !== undefined) {
      branchService.durationMinutes = durationMinutes;
    }

    if (capacity !== undefined) {
      branchService.capacity = capacity;
    }

    if (petTypes !== undefined) {
      branchService.petTypes = petTypes;
    }

    if (status !== undefined) {
      branchService.status = status;
    }

    // 18. Lưu dữ liệu
    await branchService.save();

    // 19. Populate thông tin liên quan
    await branchService.populate([
      {
        path: "branchId",
        select: "name address images status",
      },
      {
        path: "serviceId",
        select: "name description images serviceType status categoryId",
        populate: {
          path: "categoryId",
          select: "name code",
        },
      },
    ]);

    // 20. Trả kết quả
    return res.status(200).json({
      success: true,
      message: "Cập nhật dịch vụ tại chi nhánh thành công",
      data: branchService,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createBranchService,
  getAllBranchServices,
  getBranchServiceById,
    updateBranchService,
};
