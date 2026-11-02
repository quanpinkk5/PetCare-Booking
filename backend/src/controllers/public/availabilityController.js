const mongoose = require("mongoose");

const Schedule = require("../../models/Schedule");
const ScheduleException = require("../../models/ScheduleException");
const BranchService = require("../../models/BranchService");
const Booking = require("../../models/Booking");

const DAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const isValidId = (value) =>
  typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

const parseDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return parsed;
};

const overlaps = (start1, end1, start2, end2) => start1 < end2 && end1 > start2;

const getAvailableSlots = async (req, res) => {
  try {
    const { branchServiceId, date } = req.query;

    if (!isValidId(branchServiceId)) {
      return res.status(400).json({
        success: false,
        message: "branchServiceId không hợp lệ",
      });
    }

    const requestedDate = parseDate(date);

    if (!requestedDate) {
      return res.status(400).json({
        success: false,
        message: "Ngày phải có định dạng YYYY-MM-DD và hợp lệ",
      });
    }

    const branchService = await BranchService.findById(branchServiceId).lean();

    if (!branchService) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ chi nhánh",
      });
    }

    if (branchService.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ hiện không hoạt động",
      });
    }

    // Ngày trong ScheduleException được chuẩn hóa về
    // 00:00 UTC theo controller ngoại lệ đã viết.
    const nextUtcDate = new Date(requestedDate.getTime() + 86400000);

    const dayOfWeek = DAY_NAMES[requestedDate.getUTCDay()];

    const [schedule, exceptions] = await Promise.all([
      Schedule.findOne({
        branchServiceId,
        dayOfWeek,
        isActive: true,
      }).lean(),

      ScheduleException.find({
        branchServiceId,
        date: {
          $gte: requestedDate,
          $lt: nextUtcDate,
        },
      }).lean(),
    ]);

    // Nghỉ cả ngày: không trả về khung giờ để đặt.
    const isClosed = exceptions.some(
      (exception) => exception.type === "CLOSED",
    );

    if (isClosed) {
      return res.status(200).json({
        success: true,
        data: {
          branchServiceId,
          date,
          dayOfWeek,
          isClosed: true,
          source: "CLOSED",
          slots: [],
        },
      });
    }

    const customHours = exceptions.filter(
      (exception) => exception.type === "CUSTOM_HOURS",
    );

    const blockedSlots = exceptions.filter(
      (exception) => exception.type === "BLOCK_SLOT",
    );

    // CUSTOM_HOURS thay thế hoàn toàn lịch hằng tuần.
    // Nếu không có, dùng Schedule mặc định.
    const baseSlots =
      customHours.length > 0
        ? customHours.map((item) => ({
            startTime: item.startTime,
            endTime: item.endTime,
            capacity: item.capacity,
            status: "AVAILABLE",
          }))
        : (schedule?.slots || []).map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            capacity: slot.capacity,
            status: slot.status,
          }));

    // bookingDate là Date lưu thời điểm thực.
    // Lấy ngày theo múi giờ Việt Nam (UTC+7).
    const bookingStart = new Date(`${date}T00:00:00.000+07:00`);

    const bookingEnd = new Date(bookingStart.getTime() + 86400000);

    const bookings = await Booking.find({
      branchServiceId,
      bookingType: "APPOINTMENT",
      bookingDate: {
        $gte: bookingStart,
        $lt: bookingEnd,
      },
      status: { $ne: "CANCELLED" },
    })
      .select("startTime endTime status")
      .lean();

    const slots = baseSlots
      .filter(
        (slot) =>
          slot.startTime && slot.endTime && slot.startTime < slot.endTime,
      )
      .map((slot) => {
        const isBlocked = blockedSlots.some((exception) =>
          overlaps(
            slot.startTime,
            slot.endTime,
            exception.startTime,
            exception.endTime,
          ),
        );

        // Mỗi Booking được tính là một suất.
        // Nếu Booking giao với slot thì tính vào số đã đặt.
        const bookedCount = bookings.filter((booking) => {
          if (!booking.startTime || !booking.endTime) {
            return false;
          }

          return overlaps(
            slot.startTime,
            slot.endTime,
            booking.startTime,
            booking.endTime,
          );
        }).length;

        const capacity = Number(slot.capacity) || 0;

        const availableCapacity = Math.max(0, capacity - bookedCount);

        const isAvailable =
          slot.status === "AVAILABLE" && !isBlocked && availableCapacity > 0;

        let displayStatus = "AVAILABLE";

        if (isBlocked) {
          displayStatus = "BLOCKED";
        } else if (slot.status === "MAINTENANCE") {
          displayStatus = "MAINTENANCE";
        } else if (slot.status === "OFF") {
          displayStatus = "OFF";
        } else if (availableCapacity === 0) {
          displayStatus = "FULL";
        }

        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity,
          bookedCount,
          availableCapacity,
          status: displayStatus,
          isAvailable,
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return res.status(200).json({
      success: true,
      data: {
        branchServiceId,
        date,
        dayOfWeek,
        isClosed: false,
        source: customHours.length > 0 ? "CUSTOM_HOURS" : "WEEKLY_SCHEDULE",
        slots,
      },
    });
  } catch (error) {
    console.error("Get available slots error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách khung giờ khả dụng",
    });
  }
};

module.exports = {
  getAvailableSlots,
};
