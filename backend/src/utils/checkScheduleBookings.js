
const Booking = require("../models/Booking");

const WEEK_DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

// Lấy YYYY-MM-DD theo giờ Việt Nam
const getVietnamDate = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type) =>
    parts.find((item) => item.type === type)?.value;

  return `${part("year")}-${part("month")}-${part("day")}`;
};

const getDayOfWeek = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  return WEEK_DAYS[date.getUTCDay()];
};

// Hai khoảng giờ có giao nhau hay không
const overlaps = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && aEnd > bStart;

const checkScheduleBookings = async ({
  branchServiceId,
  dayOfWeek,
  newSlots,
}) => {
  const today = getVietnamDate(new Date());

  // Bắt đầu ngày hôm nay theo giờ Việt Nam
  const fromDate = new Date(
    `${today}T00:00:00.000+07:00`
  );

  const bookings = await Booking.find({
    branchServiceId,
    bookingType: "APPOINTMENT",
    bookingDate: { $gte: fromDate },
    status: { $ne: "CANCELLED" },
  })
    .select(
      "bookingCode bookingDate startTime endTime status"
    )
    .lean();

  const relevantBookings = bookings.filter((booking) => {
    if (!booking.startTime || !booking.endTime) {
      return false;
    }

    const dateString = getVietnamDate(booking.bookingDate);

    return getDayOfWeek(dateString) === dayOfWeek;
  });

  // Không có Booking của thứ đang sửa
  if (relevantBookings.length === 0) {
    return {
      allowed: true,
      affectedBookings: [],
    };
  }

  // newSlots = [] nghĩa là muốn xóa toàn bộ lịch
  if (!newSlots || newSlots.length === 0) {
    return {
      allowed: false,
      affectedBookings: relevantBookings,
      message:
        "Không thể xóa lịch vì đã có Booking trong những ngày sắp tới.",
    };
  }

  // Gom Booking theo ngày để kiểm tra sức chứa riêng từng ngày
  const bookingsByDate = new Map();

  for (const booking of relevantBookings) {
    const dateString = getVietnamDate(booking.bookingDate);

    if (!bookingsByDate.has(dateString)) {
      bookingsByDate.set(dateString, []);
    }

    bookingsByDate.get(dateString).push(booking);
  }

  for (const [dateString, dayBookings] of bookingsByDate) {
    for (const booking of dayBookings) {
      // Booking phải còn nằm trọn trong một slot có thể nhận khách.
      const matchingSlot = newSlots.find(
        (slot) =>
          slot.status === "AVAILABLE" &&
          slot.startTime <= booking.startTime &&
          slot.endTime >= booking.endTime
      );

      if (!matchingSlot) {
        return {
          allowed: false,
          affectedBookings: [booking],
          message:
            `Không thể thay đổi lịch ngày ${dateString}. ` +
            `Booking ${booking.bookingCode || ""} ` +
            "không còn khung giờ phục vụ hợp lệ.",
        };
      }
    }

    // Kiểm tra sức chứa với những Booking giao thời gian
    for (const slot of newSlots) {
      const bookedCount = dayBookings.filter((booking) =>
        overlaps(
          slot.startTime,
          slot.endTime,
          booking.startTime,
          booking.endTime
        )
      ).length;

      if (bookedCount > Number(slot.capacity)) {
        return {
          allowed: false,
          affectedBookings: dayBookings,
          message:
            `Ngày ${dateString} có ${bookedCount} Booking ` +
            `trong khung ${slot.startTime}-${slot.endTime}, ` +
            `vượt sức chứa mới là ${slot.capacity}.`,
        };
      }
    }
  }

  return {
    allowed: true,
    affectedBookings: [],
  };
};

module.exports = { checkScheduleBookings };
