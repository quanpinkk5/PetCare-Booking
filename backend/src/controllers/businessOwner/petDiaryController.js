
const mongoose = require("mongoose");

const Booking = require("../../models/Booking");
const PetDiary = require("../../models/PetDiary");
const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const BranchService = require("../../models/BranchService");
const Pet = require("../../models/Pet");
const User = require("../../models/User");

// Các loại hoạt động tương ứng AddDiaryModal.jsx
const ACTIVITY_TYPES = [
  "meal",
  "med",
  "exercise",
  "hygiene",
  "health",
  "grooming",
  "rest",
];

const isValidId = (id) =>
  typeof id === "string" &&
  mongoose.Types.ObjectId.isValid(id) &&
  /^[a-f\d]{24}$/i.test(String(id));

const sendError = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

// ==========================================
// KIỂM TRA QUYỀN OWNER ĐỐI VỚI BOOKING
// ==========================================

const getOwnedBoarding = async (bookingId, ownerId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    bookingType: "BOARDING",
  });

  if (!booking) return null;

  const businesses = await Business.find({
    ownerId,
  }).select("_id");

  if (businesses.length === 0) {
    return null;
  }

  const businessIds = businesses.map(
    (business) => business._id
  );

  const branches = await Branch.find({
    businessId: { $in: businessIds },
  }).select("_id");

  if (branches.length === 0) {
    return null;
  }

  const branchIds = branches.map(
    (branch) => branch._id
  );

  const ownedService = await BranchService.findOne({
    _id: booking.branchServiceId,
    branchId: { $in: branchIds },
  }).select("_id");

  if (!ownedService) return null;

  return booking;
};

// ==========================================
// GET /:bookingId/diaries
// DANH SÁCH NHẬT KÝ CHĂM SÓC
// ==========================================

const getBoardingDiaries = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
      return sendError(
        res,
        400,
        "ID Booking không hợp lệ."
      );
    }

    const booking = await getOwnedBoarding(
      bookingId,
      req.user._id
    );

    if (!booking) {
      return sendError(
        res,
        404,
        "Không tìm thấy đơn lưu trú hoặc bạn không có quyền truy cập."
      );
    }

    const diaries = await PetDiary.find({
      bookingId: booking._id,
    })
      .populate("createdBy", "fullName name")
      .sort({
        activityTime: -1,
        createdAt: -1,
        _id: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy nhật ký chăm sóc thành công.",
      data: {
        bookingId: booking._id,
        diaries,
      },
    });
  } catch (error) {
    console.error("getBoardingDiaries:", error);

    return sendError(
      res,
      500,
      "Có lỗi xảy ra khi tải nhật ký chăm sóc."
    );
  }
};

// ==========================================
// POST /:bookingId/diaries
// THÊM NHẬT KÝ CHĂM SÓC
// ==========================================

const createBoardingDiary = async (req, res) => {
  try {
    const validationError = validateDiary(req.body);
    if (validationError) return sendError(res, 400, validationError);
    const { bookingId } = req.params;

    const {
      activityType,
      description,
      activityTime,
      images = [],
    } = req.body || {};

    // 1. Kiểm tra Booking ID
    if (!isValidId(bookingId)) {
      return sendError(
        res,
        400,
        "ID Booking không hợp lệ."
      );
    }

    // 2. Kiểm tra loại hoạt động
    if (
      typeof activityType !== "string" ||
      !ACTIVITY_TYPES.includes(activityType)
    ) {
      return sendError(
        res,
        400,
        "Loại hoạt động không hợp lệ."
      );
    }

    // 3. Kiểm tra mô tả
    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return sendError(
        res,
        400,
        "Vui lòng nhập nội dung nhật ký."
      );
    }

    if (description.trim().length > 3000) {
      return sendError(
        res,
        400,
        "Nội dung nhật ký tối đa 3000 ký tự."
      );
    }

    // 4. Kiểm tra thời gian
    if (
      typeof activityTime !== "string" ||
      !activityTime.trim()
    ) {
      return sendError(
        res,
        400,
        "Vui lòng cung cấp thời gian hoạt động."
      );
    }

    const parsedTime = new Date(activityTime);

    if (Number.isNaN(parsedTime.getTime())) {
      return sendError(
        res,
        400,
        "Thời gian hoạt động không hợp lệ."
      );
    }

    if (parsedTime.getTime() > Date.now()) {
      return sendError(
        res,
        400,
        "Thời gian hoạt động không được ở tương lai."
      );
    }

    // 5. Kiểm tra ảnh (URL ảnh đã upload)
    if (
      !Array.isArray(images) ||
      images.length > 5 ||
      !images.every(
        (image) =>
          typeof image === "string" &&
          image.length <= 2048 &&
          /^https?:\/\/\S+$/i.test(image)
      )
    ) {
      return sendError(
        res,
        400,
        "Danh sách ảnh phải là tối đa 5 URL HTTP/HTTPS hợp lệ."
      );
    }

    // 6. Kiểm tra quyền
    const booking = await getOwnedBoarding(
      bookingId,
      req.user._id
    );

    if (!booking) {
      return sendError(
        res,
        404,
        "Không tìm thấy đơn lưu trú hoặc bạn không có quyền truy cập."
      );
    }

    // 7. Chỉ thêm nhật ký khi đang lưu trú
    if (booking.status !== "IN_PROGRESS") {
      return sendError(
        res,
        409,
        "Chỉ có thể thêm nhật ký khi thú cưng đang lưu trú."
      );
    }

    // 8. Kiểm tra thời gian Check-in thực tế
    const actualCheckInAt =
      booking.boardingDetails?.actualCheckInAt;

    if (
      actualCheckInAt &&
      parsedTime.getTime() <
        new Date(actualCheckInAt).getTime()
    ) {
      return sendError(
        res,
        400,
        "Thời gian nhật ký không được trước thời điểm Check-in thực tế."
      );
    }

    // 9. Tạo nhật ký với model sẵn có
    const diary = await PetDiary.create({
      bookingId: booking._id,
      petId: booking.petId,
      createdBy: req.user._id,
      activityType,
      description: description.trim(),
      images,
      activityTime: parsedTime,
    });

    await diary.populate(
      "createdBy",
      "fullName name"
    );

    return res.status(201).json({
      success: true,
      message: "Thêm nhật ký chăm sóc thành công.",
      data: {
        diary,
      },
    });
  } catch (error) {
    console.error("createBoardingDiary:", error);

    return sendError(
      res,
      500,
      "Có lỗi xảy ra khi tạo nhật ký chăm sóc."
    );
  }
};

function validateDiary(body) {
  if (!body || Array.isArray(body) || Object.keys(body).some((key) =>
    !["activityType", "description", "activityTime", "images"].includes(key))) {
    return "Dữ liệu nhật ký không hợp lệ.";
  }
  if (!ACTIVITY_TYPES.includes(body.activityType)) return "Loại hoạt động không hợp lệ.";
  if (typeof body.description !== "string" || !body.description.trim() || body.description.trim().length > 3000) {
    return "Nội dung nhật ký phải từ 1 đến 3000 ký tự.";
  }
  if (typeof body.activityTime !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(body.activityTime) ||
    Number.isNaN(Date.parse(body.activityTime)) || Date.parse(body.activityTime) > Date.now()) {
    return "Thời gian hoạt động phải hợp lệ và không ở tương lai.";
  }
  const dateKey = body.activityTime.slice(0, 10);
  if (new Date(`${dateKey}T00:00:00Z`).toISOString().slice(0, 10) !== dateKey) return "Ngày hoạt động không hợp lệ.";
  const images = body.images ?? [];
  if (!Array.isArray(images) || images.length > 5 || !images.every((url) =>
    typeof url === "string" && url.length <= 2048 && /^https?:\/\/\S+$/i.test(url))) {
    return "Danh sách ảnh phải là tối đa 5 URL HTTP/HTTPS hợp lệ.";
  }
  return "";
}

const updateBoardingDiary = async (req, res) => {
  try {
    const { bookingId, diaryId } = req.params;
    if (!isValidId(bookingId) || !isValidId(diaryId)) return sendError(res, 400, "ID nhật ký không hợp lệ.");
    const validationError = validateDiary(req.body);
    if (validationError) return sendError(res, 400, validationError);
    const booking = await getOwnedBoarding(bookingId, req.user._id);
    if (!booking) return sendError(res, 404, "Không tìm thấy đơn lưu trú thuộc doanh nghiệp của bạn.");
    if (booking.status !== "IN_PROGRESS") return sendError(res, 409, "Chỉ có thể chỉnh sửa nhật ký khi thú cưng đang lưu trú.");
    const activityTime = new Date(req.body.activityTime);
    if (booking.boardingDetails?.actualCheckInAt && activityTime < new Date(booking.boardingDetails.actualCheckInAt)) {
      return sendError(res, 400, "Thời gian nhật ký không được trước thời điểm Check-in thực tế.");
    }
    const diary = await PetDiary.findOneAndUpdate(
      { _id: diaryId, bookingId: booking._id },
      { $set: { activityType: req.body.activityType, description: req.body.description.trim(), activityTime, images: req.body.images ?? [] } },
      { new: true, runValidators: true },
    ).populate("createdBy", "fullName name");
    if (!diary) return sendError(res, 404, "Không tìm thấy nhật ký trong đơn lưu trú này.");
    return res.json({ success: true, message: "Cập nhật nhật ký thành công.", data: { diary } });
  } catch (error) {
    console.error("updateBoardingDiary:", error);
    return sendError(res, 500, "Không thể cập nhật nhật ký chăm sóc.");
  }
};

// One row per stay, with the latest activity matching the selected filters.
const getPetDiaries = async (req, res) => {
  try {
    const { search = "", branchId = "", activityType = "", date = "", page = "1", limit = "5" } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    if (typeof search !== "string" || search.length > 100 ||
      (branchId && !isValidId(branchId)) || (activityType && !ACTIVITY_TYPES.includes(activityType)) ||
      (date && (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) ||
      !Number.isSafeInteger(pageNumber) || pageNumber < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100 ||
      !Number.isSafeInteger((pageNumber - 1) * pageSize)) {
      return sendError(res, 400, "Bộ lọc nhật ký không hợp lệ.");
    }
    const businesses = await Business.find({ ownerId: req.user._id }).select("_id").lean();
    const branches = await Branch.find({ businessId: { $in: businesses.map((item) => item._id) } }).select("_id name").lean();
    if (branchId && !branches.some((branch) => String(branch._id) === branchId)) {
      return sendError(res, 404, "Không tìm thấy chi nhánh thuộc doanh nghiệp của bạn.");
    }
    const services = await BranchService.find({ branchId: { $in: branches.filter((branch) => !branchId || String(branch._id) === branchId).map((branch) => branch._id) } }).select("_id").lean();
    const filter = { bookingType: "BOARDING", status: { $in: ["IN_PROGRESS", "COMPLETED"] }, branchServiceId: { $in: services.map((item) => item._id) } };
    if (search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const [pets, customers] = await Promise.all([
        Pet.find({ $or: [{ name: regex }, { breed: regex }] }).select("_id").lean(),
        User.find({ $or: [{ fullName: regex }, { phone: regex }] }).select("_id").lean(),
      ]);
      filter.$or = [{ bookingCode: regex }, { petId: { $in: pets.map((pet) => pet._id) } },
        { customerId: { $in: customers.map((customer) => customer._id) } }, { "boardingDetails.roomName": regex }, { "boardingDetails.room": regex }];
    }
    const diaryFilter = {};
    if (activityType) diaryFilter.activityType = activityType;
    if (date) {
      const start = new Date(`${date}T00:00:00+07:00`);
      diaryFilter.activityTime = { $gte: start, $lt: new Date(start.getTime() + 86400000) };
    }
    if (date || activityType) {
      const ownedBookings = await Booking.find(filter).select("_id").lean();
      filter._id = { $in: await PetDiary.distinct("bookingId", { ...diaryFilter, bookingId: { $in: ownedBookings.map((booking) => booking._id) } }) };
    }
    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter).sort({ updatedAt: -1, _id: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize)
        .populate("petId", "name species breed gender dateOfBirth weight avatar careNotes feedingNotes")
        .populate("customerId", "fullName phone")
        .populate({ path: "branchServiceId", select: "branchId", populate: { path: "branchId", select: "name" } }).lean(),
    ]);
    const diaries = await PetDiary.find({ ...diaryFilter, bookingId: { $in: bookings.map((booking) => booking._id) } })
      .sort({ activityTime: -1, createdAt: -1, _id: -1 }).lean();
    const latest = new Map();
    for (const diary of diaries) if (!latest.has(String(diary.bookingId))) latest.set(String(diary.bookingId), diary);
    return res.json({ success: true, data: { bookings: bookings.map((booking) => ({ ...booking, latestDiary: latest.get(String(booking._id)) || null })), branches,
      pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } } });
  } catch (error) {
    console.error("getPetDiaries:", error);
    return sendError(res, 500, "Không thể tải danh sách nhật ký thú cưng.");
  }
};

module.exports = {
  getBoardingDiaries,
  createBoardingDiary,
  updateBoardingDiary,
  getPetDiaries,
};
