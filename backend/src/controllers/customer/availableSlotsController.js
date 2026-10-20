const mongoose = require("mongoose");

const Business = require("../../models/Business");
const Branch = require("../../models/Branch");
const Service = require("../../models/Service");
const BranchService = require("../../models/BranchService");
const Schedule = require("../../models/Schedule");
const ScheduleException = require("../../models/ScheduleException");
const Booking = require("../../models/Booking");

// ==========================================
// CẤU HÌNH
// ==========================================

const TIME_ZONE = "Asia/Ho_Chi_Minh";

const DAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const BLOCKING_BOOKING_STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS"];

// ==========================================
// HELPER - Kiểm tra và chuyển đổi thời gian
// ==========================================

const timeToMinutes = (time) => {
  if (typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    `${String(hours).padStart(2, "0")}:` + `${String(mins).padStart(2, "0")}`
  );
};

const isValidRange = (start, end) => {
  return (
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    end <= 1440 &&
    start < end
  );
};

const isOverlapping = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const parseDate = (dateString) => {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return null;
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== dateString
  ) {
    return null;
  }

  return date;
};

const parseTimeRange = (item) => {
  const start = timeToMinutes(item?.startTime);
  const end = timeToMinutes(item?.endTime);

  if (!isValidRange(start, end)) {
    return null;
  }

  return { start, end };
};

// ==========================================
// HELPER - Thời gian hiện tại tại Việt Nam
// ==========================================

const getVietnamNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
};

// ==========================================
// HELPER - Đọc các khoảng thời gian
// ==========================================

const parseScheduleSlots = (slots) => {
  if (!Array.isArray(slots)) {
    return [];
  }

  return slots
    .map(parseTimeRange)
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);
};

// ==========================================
// HELPER - Kiểm tra capacity
// ==========================================

const hasValidCapacity = (value) => {
  return Number.isInteger(value) && value >= 0;
};

// Tính sức chứa hiệu lực của một slot.
//
// Quy tắc:
// - Mặc định: BranchService.capacity
// - CUSTOM_HOURS.capacity: giới hạn sức chứa
// - BLOCK_SLOT.capacity: giới hạn sức chứa
// - BLOCK_SLOT không có capacity: chặn hoàn toàn
// - Nhiều ngoại lệ: lấy mức nhỏ nhất
const calculateEffectiveCapacity = ({
  start,
  end,
  defaultCapacity,
  customHours,
  blockedSlots,
}) => {
  let effectiveCapacity = defaultCapacity;

  // CUSTOM_HOURS có thể giới hạn sức chứa
  for (const item of customHours) {
    if (
      isOverlapping(start, end, item.start, item.end) &&
      hasValidCapacity(item.capacity)
    ) {
      effectiveCapacity = Math.min(effectiveCapacity, item.capacity);
    }
  }

  // BLOCK_SLOT giới hạn hoặc chặn hoàn toàn
  for (const item of blockedSlots) {
    if (!isOverlapping(start, end, item.start, item.end)) {
      continue;
    }

    if (!hasValidCapacity(item.capacity)) {
      // Không khai báo capacity => chặn hoàn toàn
      return 0;
    }

    effectiveCapacity = Math.min(effectiveCapacity, item.capacity);
  }

  return effectiveCapacity;
};

// ==========================================
// GET - Khung giờ còn trống
// ==========================================

const getAvailableSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date: dateString } = req.query;

    // --------------------------------------
    // 1. Validate BranchService ID
    // --------------------------------------

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ tại chi nhánh không hợp lệ",
      });
    }

    // --------------------------------------
    // 2. Validate ngày
    // --------------------------------------

    const selectedDate = parseDate(dateString);

    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message: "Ngày phải có định dạng YYYY-MM-DD hợp lệ",
      });
    }

    const now = getVietnamNow();

    if (dateString < now.date) {
      return res.status(400).json({
        success: false,
        message: "Không thể xem lịch đặt cho ngày đã qua",
      });
    }

    // --------------------------------------
    // 3. Kiểm tra BranchService
    // --------------------------------------

    const branchService = await BranchService.findOne({
      _id: id,
      status: "ACTIVE",
    })
      .select("branchId serviceId durationMinutes capacity status")
      .lean();

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // --------------------------------------
    // 4. Kiểm tra Branch
    // --------------------------------------

    const branch = await Branch.findOne({
      _id: branchService.branchId,
      status: "ACTIVE",
    })
      .select("_id businessId")
      .lean();

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // --------------------------------------
    // 5. Kiểm tra Business
    // --------------------------------------

    const business = await Business.findOne({
      _id: branch.businessId,
      status: "APPROVED",
    })
      .select("_id")
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    // --------------------------------------
    // 6. Kiểm tra Service
    // --------------------------------------

    const service = await Service.findOne({
      _id: branchService.serviceId,
      businessId: business._id,
      status: "ACTIVE",
    })
      .select("_id serviceType")
      .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ tại chi nhánh",
      });
    }

    if (service.serviceType !== "APPOINTMENT") {
      return res.status(400).json({
        success: false,
        message: "API khung giờ chỉ áp dụng cho dịch vụ APPOINTMENT",
      });
    }

    // --------------------------------------
    // 7. Kiểm tra thời lượng và sức chứa
    // --------------------------------------

    const duration = branchService.durationMinutes;
    const defaultCapacity = branchService.capacity;

    if (
      !Number.isInteger(duration) ||
      duration <= 0 ||
      !Number.isInteger(defaultCapacity) ||
      defaultCapacity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ chưa được cấu hình thời lượng hoặc sức chứa hợp lệ",
      });
    }

    // --------------------------------------
    // 8. Xác định thứ trong tuần
    // --------------------------------------

    const dayOfWeek = DAY_NAMES[selectedDate.getUTCDay()];

    // Ngày tiếp theo theo quy ước date-only UTC
    const nextDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);

    // --------------------------------------
    // 9. Lấy Schedule, Exception và Booking
    // --------------------------------------

    const [schedule, exceptions, bookings] = await Promise.all([
      Schedule.findOne({
        branchServiceId: branchService._id,
        dayOfWeek,
        isActive: true,
      })
        .select("slots")
        .lean(),

      ScheduleException.find({
        branchServiceId: branchService._id,
        date: {
          $gte: selectedDate,
          $lt: nextDate,
        },
      })
        .select("type startTime endTime capacity")
        .lean(),

      Booking.find({
        branchServiceId: branchService._id,
        bookingType: "APPOINTMENT",
        bookingDate: {
          $gte: selectedDate,
          $lt: nextDate,
        },
        status: {
          $in: BLOCKING_BOOKING_STATUSES,
        },
      })
        .select("startTime endTime")
        .lean(),
    ]);

    // --------------------------------------
    // 10. Xử lý CLOSED
    // --------------------------------------

    const isClosed = exceptions.some((item) => item.type === "CLOSED");

    if (isClosed) {
      return res.status(200).json({
        success: true,
        message: "Ngày này dịch vụ không hoạt động",
        data: {
          branchServiceId: branchService._id,
          date: dateString,
          dayOfWeek,
          durationMinutes: duration,
          capacity: defaultCapacity,
          availableSlots: [],
        },
      });
    }

    // --------------------------------------
    // 11. Đọc CUSTOM_HOURS
    // --------------------------------------

    const customHours = exceptions
      .filter((item) => item.type === "CUSTOM_HOURS")
      .map((item) => {
        const range = parseTimeRange(item);

        if (!range) return null;

        return {
          ...range,
          capacity: item.capacity,
        };
      })
      .filter(Boolean);

    // --------------------------------------
    // 12. Xác định khoảng giờ làm việc
    // --------------------------------------

    let workingRanges;

    if (customHours.length > 0) {
      // CUSTOM_HOURS thay thế Schedule cố định
      workingRanges = customHours;
    } else {
      workingRanges = parseScheduleSlots(schedule?.slots);
    }

    // --------------------------------------
    // 13. Đọc BLOCK_SLOT
    // --------------------------------------

    const blockedSlots = exceptions
      .filter((item) => item.type === "BLOCK_SLOT")
      .map((item) => {
        const range = parseTimeRange(item);

        if (!range) return null;

        return {
          ...range,
          capacity: item.capacity,
        };
      })
      .filter(Boolean);

    // --------------------------------------
    // 14. Đọc các Booking đang chiếm chỗ
    // --------------------------------------

    const bookingRanges = bookings.map(parseTimeRange).filter(Boolean);

    // --------------------------------------
    // 15. Sinh các slot có thể đặt
    // --------------------------------------

    const availableSlots = [];

    for (const range of workingRanges) {
      for (
        let start = range.start;
        start + duration <= range.end;
        start += duration
      ) {
        const end = start + duration;

        // Không hiển thị giờ đã qua hôm nay
        if (dateString === now.date && start <= now.minutes) {
          continue;
        }

        // Tính capacity sau khi áp dụng ngoại lệ
        const effectiveCapacity = calculateEffectiveCapacity({
          start,
          end,
          defaultCapacity,
          customHours,
          blockedSlots,
        });

        // Capacity = 0 => không thể đặt
        if (effectiveCapacity <= 0) {
          continue;
        }

        // Đếm Booking giao với slot hiện tại
        const bookedCount = bookingRanges.filter((booking) =>
          isOverlapping(start, end, booking.start, booking.end),
        ).length;

        const remainingCapacity = effectiveCapacity - bookedCount;

        // Đã hết chỗ
        if (remainingCapacity <= 0) {
          continue;
        }

        availableSlots.push({
          startTime: minutesToTime(start),
          endTime: minutesToTime(end),
          capacity: effectiveCapacity,
          bookedCount,
          remainingCapacity,
        });
      }
    }

    // --------------------------------------
    // 16. Loại bỏ các slot trùng hoàn toàn
    // --------------------------------------

    const slotMap = new Map();

    for (const slot of availableSlots) {
      const key = `${slot.startTime}-${slot.endTime}`;

      const existing = slotMap.get(key);

      if (!existing) {
        slotMap.set(key, slot);
      } else {
        // Nếu trùng slot, giữ mức sức chứa thấp nhất
        slotMap.set(key, {
          ...slot,
          capacity: Math.min(existing.capacity, slot.capacity),
          remainingCapacity: Math.min(
            existing.remainingCapacity,
            slot.remainingCapacity,
          ),
        });
      }
    }

    const uniqueSlots = [...slotMap.values()].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    // --------------------------------------
    // 17. Trả kết quả
    // --------------------------------------

    return res.status(200).json({
      success: true,
      message: "Lấy khung giờ còn trống thành công",
      data: {
        branchServiceId: branchService._id,
        date: dateString,
        dayOfWeek,
        durationMinutes: duration,
        capacity: defaultCapacity,
        availableSlots: uniqueSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableSlots,
};
