const mongoose = require("mongoose");

const Schedule = require("../../models/Schedule");
const BranchService = require("../../models/BranchService");
const Branch = require("../../models/Branch");
const Business = require("../../models/Business");
const Booking = require("../../models/Booking");
const { normalizeScheduleSlot } = require("../../utils/scheduleSlots");

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const WEEK_DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const isValidId = (id) =>
  typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

// ========================================
// 1. KIỂM TRA QUYỀN BUSINESS OWNER
// ========================================
const getOwnedBranchService = async (branchServiceId, ownerId) => {
  if (!isValidId(String(branchServiceId))) {
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

// ========================================
// 2. KIỂM TRA DỮ LIỆU SLOT
// ========================================
const validateSlots = (slots) => {
  if (!Array.isArray(slots)) {
    return "Danh sách khung giờ phải là một mảng";
  }

  for (const slot of slots) {
    if (
      !slot ||
      !TIME_REGEX.test(slot.startTime) ||
      !TIME_REGEX.test(slot.endTime)
    ) {
      return "Giờ bắt đầu hoặc kết thúc không hợp lệ";
    }

    if (slot.startTime >= slot.endTime) {
      return "Giờ kết thúc phải sau giờ bắt đầu";
    }

    if (!Number.isInteger(slot.capacity) || slot.capacity < 1) {
      return "Sức chứa phải là số nguyên lớn hơn 0";
    }

    if (
      slot.status !== undefined &&
      !["AVAILABLE", "MAINTENANCE", "OFF"].includes(slot.status)
    ) {
      return "Trạng thái khung giờ không hợp lệ";
    }
  }

  const sorted = [...slots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].startTime < sorted[i - 1].endTime) {
      return "Các khung giờ không được chồng nhau";
    }
  }

  return null;
};

// ========================================
// 3. HÀM XỬ LÝ NGÀY THEO GIỜ VIỆT NAM
// ========================================

// Trả YYYY-MM-DD của một Date theo giờ Việt Nam
const getVietnamDate = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const getPart = (type) => parts.find((item) => item.type === type)?.value;

  return `${getPart("year")}-` + `${getPart("month")}-` + `${getPart("day")}`;
};

// Xác định thứ từ YYYY-MM-DD
const getDayOfWeek = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  return WEEK_DAYS[date.getUTCDay()];
};

// Hai khoảng giờ có giao nhau không?
const overlaps = (start1, end1, start2, end2) => start1 < end2 && end1 > start2;

// ========================================
// 4. KIỂM TRA BOOKING TRƯỚC KHI SỬA/XÓA
// ========================================
const checkScheduleBookings = async ({
  branchServiceId,
  dayOfWeek,
  newSlots,
  isActive = true,
}) => {
  const today = getVietnamDate(new Date());

  // Bắt đầu hôm nay theo giờ Việt Nam
  const fromDate = new Date(`${today}T00:00:00.000+07:00`);

  // Chỉ lấy Booking hôm nay và tương lai
  const bookings = await Booking.find({
    branchServiceId,
    bookingType: "APPOINTMENT",
    bookingDate: {
      $gte: fromDate,
    },
    status: {
      $ne: "CANCELLED",
    },
  })
    .select("bookingDate startTime endTime status")
    .lean();

  // Chỉ lấy Booking thuộc đúng thứ đang sửa
  const relevantBookings = bookings.filter((booking) => {
    if (
      !booking.bookingDate ||
      !TIME_REGEX.test(booking.startTime) ||
      !TIME_REGEX.test(booking.endTime)
    ) {
      return false;
    }

    const dateString = getVietnamDate(booking.bookingDate);

    return getDayOfWeek(dateString) === dayOfWeek;
  });

  if (relevantBookings.length === 0) {
    return {
      allowed: true,
    };
  }

  // Nếu tắt lịch hoặc xóa toàn bộ slot,
  // các Booking tương lai sẽ mất lịch phục vụ
  if (!isActive || !Array.isArray(newSlots) || newSlots.length === 0) {
    return {
      allowed: false,
      message:
        `Không thể xóa hoặc tắt lịch ${dayOfWeek} ` +
        "vì đã có Booking chưa hủy trong những ngày sắp tới.",
    };
  }

  // Gom các Booking theo từng ngày
  const bookingsByDate = new Map();

  for (const booking of relevantBookings) {
    const dateString = getVietnamDate(booking.bookingDate);

    if (!bookingsByDate.has(dateString)) {
      bookingsByDate.set(dateString, []);
    }

    bookingsByDate.get(dateString).push(booking);
  }

  // Kiểm tra lần lượt từng ngày có Booking
  for (const [dateString, dayBookings] of bookingsByDate) {
    // 4.1. Mỗi Booking phải còn được phục vụ
    // bởi một slot AVAILABLE chứa toàn bộ giờ đặt
    for (const booking of dayBookings) {
      const matchingSlot = newSlots.find((slot) => {
        const status = slot.status || "AVAILABLE";

        return (
          status === "AVAILABLE" &&
          slot.startTime <= booking.startTime &&
          slot.endTime >= booking.endTime
        );
      });

      if (!matchingSlot) {
        return {
          allowed: false,
          message:
            `Không thể thay đổi lịch ngày ${dateString}. ` +
            `Đã có Booking trong khung ` +
            `${booking.startTime}-${booking.endTime}. ` +
            "Vui lòng xử lý Booking trước khi sửa hoặc xóa.",
        };
      }
    }

    // 4.2. Số Booking không được vượt sức chứa mới
    for (const slot of newSlots) {
      const bookedCount = dayBookings.filter((booking) =>
        overlaps(
          slot.startTime,
          slot.endTime,
          booking.startTime,
          booking.endTime,
        ),
      ).length;

      if (bookedCount > Number(slot.capacity)) {
        return {
          allowed: false,
          message:
            `Ngày ${dateString}, khung ` +
            `${slot.startTime}-${slot.endTime} ` +
            `đã có ${bookedCount} Booking, ` +
            `không thể giảm sức chứa xuống ${slot.capacity}.`,
        };
      }
    }
  }

  return {
    allowed: true,
  };
};

// ========================================
// 5. GET DANH SÁCH LỊCH
// GET /api/business-owner/schedules
// ========================================
const getSchedules = async (req, res) => {
  try {
    const { branchServiceId } = req.query;

    if (!isValidId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    const branchService = await getOwnedBranchService(
      branchServiceId,
      req.user._id,
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc cơ sở của bạn",
      });
    }

    const schedules = await Schedule.find({
      branchServiceId,
    }).lean();

    schedules.sort(
      (a, b) => DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek),
    );

    return res.status(200).json({
      success: true,
      data: {
        schedules: schedules.map((schedule) => ({
          ...schedule,
          slots: (schedule.slots || []).map((slot) =>
            normalizeScheduleSlot(slot, branchService.capacity)),
        })),
      },
    });
  } catch (error) {
    console.error("Get schedules error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách lịch",
    });
  }
};

// ========================================
// 6. TẠO LỊCH LẶP HẰNG TUẦN
// POST /api/business-owner/schedules
// ========================================
const createSchedule = async (req, res) => {
  try {
    const {
      branchServiceId,
      dayOfWeek,
      slots,
      isActive = true,
    } = req.body || {};

    if (!isValidId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    if (!DAYS.includes(dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: "Thứ trong tuần không hợp lệ",
      });
    }

    const slotError = validateSlots(slots);

    if (slotError) {
      return res.status(400).json({
        success: false,
        message: slotError,
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive phải là boolean",
      });
    }

    const branchService = await getOwnedBranchService(
      branchServiceId,
      req.user._id,
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuộc cơ sở của bạn",
      });
    }

    const existing = await Schedule.findOne({
      branchServiceId,
      dayOfWeek,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Dịch vụ đã có lịch cho thứ này",
      });
    }

    // Nếu trước đó đã có Booking của ngày tương ứng
    // (ví dụ dữ liệu test), lịch mới cũng không được
    // làm các Booking đó mất khung giờ phục vụ.
    const bookingCheck = await checkScheduleBookings({
      branchServiceId,
      dayOfWeek,
      newSlots: slots,
      isActive,
    });

    if (!bookingCheck.allowed) {
      return res.status(409).json({
        success: false,
        message: bookingCheck.message,
      });
    }

    const schedule = await Schedule.create({
      branchServiceId,
      dayOfWeek,
      slots,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo lịch làm việc thành công",
      data: {
        schedule,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Lịch làm việc đã tồn tại",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create schedule error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể tạo lịch làm việc",
    });
  }
};

// ========================================
// 7. CẬP NHẬT LỊCH
// PATCH /api/business-owner/schedules/:id
// ========================================
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch không hợp lệ",
      });
    }

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch làm việc",
      });
    }

    const branchService = await getOwnedBranchService(
      schedule.branchServiceId,
      req.user._id,
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa lịch này",
      });
    }

    const { slots, isActive } = req.body || {};

    if (slots === undefined && isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu cần cập nhật",
      });
    }

    // Kiểm tra slot trước khi cập nhật
    if (slots !== undefined) {
      const slotError = validateSlots(slots);

      if (slotError) {
        return res.status(400).json({
          success: false,
          message: slotError,
        });
      }
    }

    // Kiểm tra isActive
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive phải là boolean",
      });
    }

    // Danh sách slot sau khi cập nhật
    const nextSlots = slots !== undefined ? slots : schedule.slots;

    // Trạng thái lịch sau khi cập nhật
    const nextIsActive = isActive !== undefined ? isActive : schedule.isActive;

    // ========================================
    // KIỂM TRA BOOKING TRƯỚC KHI LƯU
    // ========================================
    const bookingCheck = await checkScheduleBookings({
      branchServiceId: schedule.branchServiceId,
      dayOfWeek: schedule.dayOfWeek,
      newSlots: nextSlots,
      isActive: nextIsActive,
    });

    if (!bookingCheck.allowed) {
      return res.status(409).json({
        success: false,
        message: bookingCheck.message,
      });
    }

    // Chỉ cập nhật sau khi kiểm tra thành công
    if (slots !== undefined) {
      schedule.slots = slots;
    }

    if (isActive !== undefined) {
      schedule.isActive = isActive;
    }

    await schedule.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật lịch làm việc thành công",
      data: {
        schedule,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update schedule error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật lịch làm việc",
    });
  }
};

// ========================================
// 8. XÓA TOÀN BỘ LỊCH CỦA MỘT THỨ
// DELETE /api/business-owner/schedules/:id
// ========================================
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID lịch không hợp lệ",
      });
    }

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch làm việc",
      });
    }

    const branchService = await getOwnedBranchService(
      schedule.branchServiceId,
      req.user._id,
    );

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Bạn không có quyền xóa lịch này",
      });
    }

    // Xóa Schedule đồng nghĩa xóa toàn bộ
    // khung giờ của thứ đó trong lịch chung.
    const bookingCheck = await checkScheduleBookings({
      branchServiceId: schedule.branchServiceId,
      dayOfWeek: schedule.dayOfWeek,
      newSlots: [],
      isActive: false,
    });

    if (!bookingCheck.allowed) {
      return res.status(409).json({
        success: false,
        message: bookingCheck.message,
      });
    }

    await schedule.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Xóa lịch làm việc thành công",
    });
  } catch (error) {
    console.error("Delete schedule error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể xóa lịch làm việc",
    });
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
