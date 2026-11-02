const ScheduleException = require("../../models/ScheduleException");
const Schedule = require("../../models/Schedule");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Business = require("../../models/Business");
const Booking = require("../../models/Booking");

const TYPES = ["CLOSED", "CUSTOM_HOURS", "BLOCK_SLOT"];
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const WEEK_DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const validId = (id) => typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

// ================================
// 1. XỬ LÝ NGÀY
// ================================

const parseDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
};

const dateKey = (value) => new Date(value).toISOString().slice(0, 10);

const getDayOfWeek = (dateString) =>
  WEEK_DAYS[parseDate(dateString).getUTCDay()];

// ScheduleException lưu ngày ở 00:00 UTC.
const getExceptionDateRange = (dateString) => {
  const start = parseDate(dateString);
  const end = new Date(start.getTime() + 86400000);

  return { $gte: start, $lt: end };
};

// Booking được tìm theo ngày Việt Nam.
const getBookingDateRange = (dateString) => {
  const start = new Date(`${dateString}T00:00:00.000+07:00`);

  const end = new Date(start.getTime() + 86400000);

  return { $gte: start, $lt: end };
};

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

// ================================
// 2. KIỂM TRA QUYỀN OWNER
// ================================

const getOwnedService = async (branchServiceId, ownerId) => {
  if (!validId(String(branchServiceId))) {
    return null;
  }

  const branchService = await BranchService.findById(branchServiceId);

  if (!branchService) return null;

  const branch = await Branch.findById(branchService.branchId);

  if (!branch) return null;

  const business = await Business.findOne({
    _id: branch.businessId,
    ownerId,
  });

  return business ? branchService : null;
};

// ================================
// 3. VALIDATION NGOẠI LỆ
// ================================

const validatePayload = (body) => {
  const { date, type, startTime, endTime, capacity } = body;

  if (!parseDate(date)) {
    return "Ngày ngoại lệ không hợp lệ (YYYY-MM-DD)";
  }

  if (!TYPES.includes(type)) {
    return "Loại ngoại lệ không hợp lệ";
  }

  if (type === "CLOSED") {
    return null;
  }

  if (!TIME_REGEX.test(startTime) || !TIME_REGEX.test(endTime)) {
    return "Giờ phải có định dạng HH:mm";
  }

  if (startTime >= endTime) {
    return "Giờ kết thúc phải sau giờ bắt đầu";
  }

  if (
    type === "CUSTOM_HOURS" &&
    (!Number.isInteger(capacity) || capacity < 1)
  ) {
    return "Sức chứa phải là số nguyên lớn hơn 0";
  }

  return null;
};

const normalizePayload = (body) => ({
  date: body.date,
  type: body.type,
  startTime: body.type === "CLOSED" ? "" : body.startTime,
  endTime: body.type === "CLOSED" ? "" : body.endTime,
  capacity: body.type === "CUSTOM_HOURS" ? body.capacity : null,
  reason: body.reason,
});

// ================================
// 4. KIỂM TRA NGOẠI LỆ TRÙNG NHAU
// ================================

// Kiểm tra toàn bộ danh sách ngoại lệ của một ngày.
const validateExceptionSet = (exceptions) => {
  const closed = exceptions.filter((item) => item.type === "CLOSED");

  if (closed.length > 0 && exceptions.length > 1) {
    return "Ngày này đã có ngoại lệ khác";
  }

  const hasCustomHours = exceptions.some(
    (item) => item.type === "CUSTOM_HOURS",
  );

  const hasBlockedSlots = exceptions.some((item) => item.type === "BLOCK_SLOT");

  if (hasCustomHours && hasBlockedSlots) {
    return "Không thể kết hợp hai loại ngoại lệ trong cùng ngày";
  }

  const timed = exceptions
    .filter((item) => item.type !== "CLOSED")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  for (let i = 1; i < timed.length; i++) {
    if (timed[i].startTime < timed[i - 1].endTime) {
      return "Khung giờ ngoại lệ bị chồng nhau";
    }
  }

  return null;
};

// ================================
// 5. LẤY BOOKING CỦA MỘT NGÀY
// ================================

const getBookingsOnDate = async (branchServiceId, dateString) => {
  return Booking.find({
    branchServiceId,
    bookingType: "APPOINTMENT",
    bookingDate: getBookingDateRange(dateString),
    status: { $ne: "CANCELLED" },
  })
    .select("startTime endTime bookingDate status")
    .lean();
};

// ================================
// 6. LẤY NGOẠI LỆ CỦA MỘT NGÀY
// ================================

const getExceptionsOnDate = async (branchServiceId, dateString) => {
  return ScheduleException.find({
    branchServiceId,
    date: getExceptionDateRange(dateString),
  }).lean();
};

// ================================
// 7. KIỂM TRA BOOKING SAU KHI
//    ÁP DỤNG NGOẠI LỆ
// ================================

// Hàm này nhận danh sách ngoại lệ cuối cùng
// của một ngày SAU thao tác thêm/sửa/xóa.
const checkBookingsWithExceptions = async ({
  branchServiceId,
  date,
  exceptions,
}) => {
  const bookings = await getBookingsOnDate(branchServiceId, date);

  // Không có Booking -> không phát sinh xung đột.
  if (bookings.length === 0) {
    return { allowed: true };
  }

  // CLOSED: nghỉ cả ngày, không được có Booking.
  if (exceptions.some((item) => item.type === "CLOSED")) {
    return {
      allowed: false,
      message:
        `Ngày ${date} đã có ${bookings.length} Booking ` +
        "chưa hủy, không thể nghỉ cả ngày.",
    };
  }

  const customHours = exceptions.filter((item) => item.type === "CUSTOM_HOURS");

  const blockedSlots = exceptions.filter((item) => item.type === "BLOCK_SLOT");

  // BLOCK_SLOT: chỉ chặn Booking bị giao thời gian.
  for (const block of blockedSlots) {
    const affected = bookings.find((booking) => {
      // Nếu dữ liệu Booking thiếu giờ,
      // không thể chứng minh thao tác an toàn.
      if (
        !TIME_REGEX.test(booking.startTime) ||
        !TIME_REGEX.test(booking.endTime)
      ) {
        return true;
      }

      return overlaps(
        block.startTime,
        block.endTime,
        booking.startTime,
        booking.endTime,
      );
    });

    if (affected) {
      return {
        allowed: false,
        message:
          `Không thể khóa ${block.startTime}-${block.endTime} ` +
          `ngày ${date} vì đã có Booking ` +
          "trùng thời gian.",
      };
    }
  }

  // Nếu có CUSTOM_HOURS thì lấy toàn bộ giờ đặc biệt.
  // Nếu không có, quay về lịch tuần mặc định.
  let effectiveSlots = [];

  if (customHours.length > 0) {
    effectiveSlots = customHours.map((item) => ({
      startTime: item.startTime,
      endTime: item.endTime,
      capacity: Number(item.capacity),
      status: "AVAILABLE",
    }));
  } else {
    const schedule = await Schedule.findOne({
      branchServiceId,
      dayOfWeek: getDayOfWeek(date),
      isActive: true,
    }).lean();

    effectiveSlots = (schedule?.slots || []).map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: Number(slot.capacity),
      status: slot.status || "AVAILABLE",
    }));
  }

  // Kiểm tra từng Booking còn khung phục vụ không.
  for (const booking of bookings) {
    if (
      !TIME_REGEX.test(booking.startTime) ||
      !TIME_REGEX.test(booking.endTime)
    ) {
      return {
        allowed: false,
        message:
          `Ngày ${date} có Booking thiếu giờ hợp lệ. ` +
          "Vui lòng kiểm tra dữ liệu Booking.",
      };
    }

    const matchingSlot = effectiveSlots.find(
      (slot) =>
        slot.status === "AVAILABLE" &&
        slot.startTime <= booking.startTime &&
        slot.endTime >= booking.endTime,
    );

    if (!matchingSlot) {
      return {
        allowed: false,
        message:
          `Ngày ${date} đã có Booking ` +
          `${booking.startTime}-${booking.endTime}. ` +
          "Lịch sau thay đổi không còn khung giờ " +
          "phục vụ Booking này.",
      };
    }
  }

  // Kiểm tra số Booking giao từng slot.
  for (const slot of effectiveSlots) {
    const bookedCount = bookings.filter((booking) =>
      overlaps(
        slot.startTime,
        slot.endTime,
        booking.startTime,
        booking.endTime,
      ),
    ).length;

    if (bookedCount > slot.capacity) {
      return {
        allowed: false,
        message:
          `Ngày ${date}, khung ` +
          `${slot.startTime}-${slot.endTime} ` +
          `đã có ${bookedCount} Booking, ` +
          `vượt sức chứa ${slot.capacity}.`,
      };
    }
  }

  return { allowed: true };
};

// ================================
// 8. KIỂM TRA LỊCH SAU THAY ĐỔI
// ================================

// changes: Map<dateString, exceptions[]>
// Mỗi danh sách là trạng thái dự kiến sau thao tác.
const validateChanges = async (branchServiceId, changes) => {
  for (const [date, exceptions] of changes) {
    const conflict = validateExceptionSet(exceptions);

    if (conflict) {
      return {
        allowed: false,
        message: conflict,
      };
    }

    const bookingCheck = await checkBookingsWithExceptions({
      branchServiceId,
      date,
      exceptions,
    });

    if (!bookingCheck.allowed) {
      return bookingCheck;
    }
  }

  return { allowed: true };
};

// ================================
// 9. LỖI CHUNG
// ================================

const formatError = (res, error, action) => {
  console.error(`${action} exception error:`, error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: `Không thể ${action} ngoại lệ lịch`,
  });
};

const badRequest = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

const conflictResponse = (res, message) =>
  res.status(409).json({
    success: false,
    message,
  });

// ================================
// 10. GET DANH SÁCH NGOẠI LỆ
// ================================

const getExceptions = async (req, res) => {
  try {
    const { branchServiceId } = req.query;

    if (!validId(branchServiceId)) {
      return badRequest(res, "branchServiceId không hợp lệ");
    }

    const owned = await getOwnedService(branchServiceId, req.user._id);

    if (!owned) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc cơ sở của bạn",
      });
    }

    const exceptions = await ScheduleException.find({
      branchServiceId,
    })
      .sort({ date: 1, startTime: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: { exceptions },
    });
  } catch (error) {
    return formatError(res, error, "lấy danh sách");
  }
};

// ================================
// 11. POST - THÊM NGOẠI LỆ
// ================================

const createException = async (req, res) => {
  try {
    const { branchServiceId, date, type, reason } = req.body || {};

    if (!validId(branchServiceId)) {
      return badRequest(res, "branchServiceId không hợp lệ");
    }

    const validationError = validatePayload(req.body || {});

    if (validationError) {
      return badRequest(res, validationError);
    }

    if (reason !== undefined && typeof reason !== "string") {
      return badRequest(res, "Lý do phải là chuỗi");
    }

    const owned = await getOwnedService(branchServiceId, req.user._id);

    if (!owned) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc cơ sở của bạn",
      });
    }

    const existing = await getExceptionsOnDate(branchServiceId, date);

    const candidate = normalizePayload(req.body);

    const nextExceptions = [...existing, candidate];

    const check = await validateChanges(
      branchServiceId,
      new Map([[date, nextExceptions]]),
    );

    if (!check.allowed) {
      return conflictResponse(res, check.message);
    }

    const exception = await ScheduleException.create({
      branchServiceId,
      date: parseDate(date),
      type,
      startTime: candidate.startTime,
      endTime: candidate.endTime,
      capacity: candidate.capacity,
      reason: reason || "",
    });

    return res.status(201).json({
      success: true,
      message: "Thêm ngoại lệ lịch thành công",
      data: { exception },
    });
  } catch (error) {
    return formatError(res, error, "tạo");
  }
};

// ================================
// 12. PATCH - SỬA NGOẠI LỆ
// ================================

const updateException = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return badRequest(res, "ID ngoại lệ không hợp lệ");
    }

    const exception = await ScheduleException.findById(id);

    if (!exception) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ngoại lệ",
      });
    }

    const owned = await getOwnedService(
      exception.branchServiceId,
      req.user._id,
    );

    if (!owned) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ngoại lệ của bạn",
      });
    }

    const body = req.body || {};

    if (body.branchServiceId !== undefined) {
      return badRequest(res, "Không được thay đổi dịch vụ của ngoại lệ");
    }

    if (body.reason !== undefined && typeof body.reason !== "string") {
      return badRequest(res, "Lý do phải là chuỗi");
    }

    const oldDate = dateKey(exception.date);

    // Gom trạng thái sau khi PATCH.
    const next = normalizePayload({
      date: body.date ?? oldDate,
      type: body.type ?? exception.type,
      startTime:
        body.startTime !== undefined ? body.startTime : exception.startTime,
      endTime: body.endTime !== undefined ? body.endTime : exception.endTime,
      capacity:
        body.capacity !== undefined ? body.capacity : exception.capacity,
      reason: body.reason !== undefined ? body.reason : exception.reason,
    });

    const validationError = validatePayload(next);

    if (validationError) {
      return badRequest(res, validationError);
    }

    const newDate = next.date;
    const branchServiceId = exception.branchServiceId;

    // Lấy trạng thái ngoại lệ hiện tại của ngày cũ.
    const oldDayExceptions = await getExceptionsOnDate(
      branchServiceId,
      oldDate,
    );

    // Bỏ bản ghi đang sửa khỏi ngày cũ.
    const withoutCurrent = oldDayExceptions.filter(
      (item) => String(item._id) !== String(exception._id),
    );

    const changes = new Map();

    if (oldDate === newDate) {
      // Sửa trong cùng ngày: thay bản ghi cũ bằng bản ghi mới.
      changes.set(oldDate, [...withoutCurrent, next]);
    } else {
      // Đổi ngày: kiểm tra cả ngày cũ sau khi bỏ
      // ngoại lệ và ngày mới sau khi thêm ngoại lệ.
      const newDayExceptions = await getExceptionsOnDate(
        branchServiceId,
        newDate,
      );

      changes.set(oldDate, withoutCurrent);
      changes.set(newDate, [...newDayExceptions, next]);
    }

    const check = await validateChanges(branchServiceId, changes);

    if (!check.allowed) {
      return conflictResponse(res, check.message);
    }

    // Chỉ lưu sau khi toàn bộ kiểm tra thành công.
    exception.date = parseDate(next.date);
    exception.type = next.type;
    exception.startTime = next.startTime;
    exception.endTime = next.endTime;
    exception.capacity = next.capacity;
    exception.reason = next.reason || "";

    await exception.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật ngoại lệ thành công",
      data: { exception },
    });
  } catch (error) {
    return formatError(res, error, "cập nhật");
  }
};

// ================================
// 13. DELETE - XÓA NGOẠI LỆ
// ================================

const deleteException = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return badRequest(res, "ID ngoại lệ không hợp lệ");
    }

    const exception = await ScheduleException.findById(id);

    if (!exception) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ngoại lệ",
      });
    }

    const owned = await getOwnedService(
      exception.branchServiceId,
      req.user._id,
    );

    if (!owned) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ngoại lệ của bạn",
      });
    }

    const date = dateKey(exception.date);

    // Trạng thái sau khi xóa ngoại lệ này.
    const existing = await getExceptionsOnDate(exception.branchServiceId, date);

    const remaining = existing.filter(
      (item) => String(item._id) !== String(exception._id),
    );

    const check = await validateChanges(
      exception.branchServiceId,
      new Map([[date, remaining]]),
    );

    if (!check.allowed) {
      return conflictResponse(res, check.message);
    }

    await exception.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Xóa ngoại lệ lịch thành công",
    });
  } catch (error) {
    return formatError(res, error, "xóa");
  }
};

module.exports = {
  getExceptions,
  createException,
  updateException,
  deleteException,
};
