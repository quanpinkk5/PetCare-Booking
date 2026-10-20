require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../src/models/User");
const Pet = require("../src/models/Pet");
const Booking = require("../src/models/Booking");
const BranchService = require("../src/models/BranchService");
// Đăng ký model để Mongoose populate được
require("../src/models/Service");
require("../src/models/Branch");
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const TOTAL_BOOKINGS = 25;
const TEST_PREFIX = "TESTBK-202610-";

const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const APPOINTMENT_TIMES = [
  ["08:00", "09:00"],
  ["09:30", "10:30"],
  ["13:00", "14:00"],
  ["14:30", "15:30"],
  ["16:00", "17:00"],
];

const makeDate = (dayOffset) => {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date;
};

async function seedBookings() {
  if (!MONGO_URI) {
    throw new Error("Không tìm thấy MONGO_URI hoặc MONGODB_URI trong .env.");
  }

  await mongoose.connect(MONGO_URI);
  console.log("Đã kết nối MongoDB.");

  // =====================================
  // 1. LẤY CUSTOMER VÀ PET MẪU
  // =====================================
  const pets = await Pet.find({
    name: /^\[TEST\]/,
    status: "ACTIVE",
  })
    .populate({
      path: "ownerId",
      select: "_id fullName email role",
    })
    .sort({ createdAt: 1 })
    .lean();

  const validPets = pets.filter((pet) => pet.ownerId?.role === "CUSTOMER");

  if (validPets.length === 0) {
    throw new Error(
      "Không tìm thấy Pet [TEST] thuộc Customer hợp lệ. " +
        "Hãy chạy seedBookingPets.js trước.",
    );
  }

  console.log(`Tìm thấy ${validPets.length} Pet hợp lệ.`);

  // =====================================
  // 2. LẤY CÁC BRANCH SERVICE MẪU
  // =====================================
  const branchServices = await BranchService.find({
    status: "ACTIVE",
  })
    .populate({
      path: "serviceId",
      select: "_id name businessId serviceType status",
    })
    .populate({
      path: "branchId",
      select: "_id name businessId status",
    })
    .sort({ createdAt: 1 })
    .lean();

  const validBranchServices = branchServices.filter((item) => {
    const service = item.serviceId;
    const branch = item.branchId;

    if (!service || !branch) return false;

    const isTestService = service.name?.startsWith("[TEST]");

    const sameBusiness =
      String(service.businessId) === String(branch.businessId);

    const correctPricingUnit =
      (service.serviceType === "APPOINTMENT" &&
        item.pricingUnit === "PER_SERVICE") ||
      (service.serviceType === "BOARDING" && item.pricingUnit === "PER_DAY");

    return (
      isTestService &&
      sameBusiness &&
      correctPricingUnit &&
      service.status === "ACTIVE" &&
      branch.status === "ACTIVE"
    );
  });

  const appointmentServices = validBranchServices.filter(
    (item) => item.serviceId.serviceType === "APPOINTMENT",
  );

  const boardingServices = validBranchServices.filter(
    (item) => item.serviceId.serviceType === "BOARDING",
  );

  if (appointmentServices.length === 0 || boardingServices.length === 0) {
    throw new Error(
      "Cần ít nhất một BranchService APPOINTMENT " +
        "và một BranchService BOARDING hợp lệ.",
    );
  }

  console.log(`BranchService APPOINTMENT: ${appointmentServices.length}`);
  console.log(`BranchService BOARDING: ${boardingServices.length}`);

  // =====================================
  // 3. KIỂM TRA MÃ BOOKING MẪU
  // =====================================
  const bookingCodes = Array.from(
    { length: TOTAL_BOOKINGS },
    (_, index) => `${TEST_PREFIX}${String(index + 1).padStart(4, "0")}`,
  );

  const existingBookings = await Booking.find({
    bookingCode: { $in: bookingCodes },
  })
    .select("bookingCode")
    .lean();

  const existingCodes = new Set(
    existingBookings.map((item) => item.bookingCode),
  );

  let createdCount = 0;
  let skippedCount = 0;

  // =====================================
  // 4. TẠO 25 BOOKING
  // =====================================
  for (let index = 0; index < TOTAL_BOOKINGS; index++) {
    const bookingCode = bookingCodes[index];

    // Chạy lại không tạo trùng bookingCode
    if (existingCodes.has(bookingCode)) {
      skippedCount++;
      console.log(`Đã tồn tại: ${bookingCode}`);
      continue;
    }

    const pet = validPets[index % validPets.length];

    const customerId = pet.ownerId._id;

    // Chia đều 5 trạng thái:
    // PENDING, CONFIRMED, IN_PROGRESS,
    // COMPLETED, CANCELLED
    const status = BOOKING_STATUSES[index % BOOKING_STATUSES.length];

    // Xen kẽ Booking đặt lịch và lưu trú
    const bookingType = index % 2 === 0 ? "APPOINTMENT" : "BOARDING";

    const servicePool =
      bookingType === "APPOINTMENT" ? appointmentServices : boardingServices;

    const branchService =
      servicePool[Math.floor(index / 2) % servicePool.length];

    const unitPrice = branchService.price;

    // Ngày tạo mẫu trải đều trong 25 ngày gần đây.
    const createdAt = makeDate(-(TOTAL_BOOKINGS - index));

    const changedBy = customerId;

    // Lịch sử trạng thái phải tương ứng
    // với trạng thái hiện tại.
    const statusHistory = [
      {
        status: "PENDING",
        changedAt: createdAt,
        changedBy,
        note: "Khách hàng tạo booking mẫu.",
      },
    ];

    const addHistory = (newStatus, hoursLater, note) => {
      statusHistory.push({
        status: newStatus,
        changedAt: new Date(createdAt.getTime() + hoursLater * 60 * 60 * 1000),
        changedBy: null,
        note,
      });
    };

    if (["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      addHistory("CONFIRMED", 2, "Chi nhánh xác nhận booking mẫu.");
    }

    if (["IN_PROGRESS", "COMPLETED"].includes(status)) {
      addHistory("IN_PROGRESS", 4, "Bắt đầu thực hiện dịch vụ mẫu.");
    }

    if (status === "COMPLETED") {
      addHistory("COMPLETED", 6, "Hoàn thành dịch vụ mẫu.");
    }

    if (status === "CANCELLED") {
      addHistory("CANCELLED", 2, "Booking mẫu đã được hủy.");
    }

    // Không sử dụng REFUNDED.
    // Booking hủy mẫu để UNPAID.
    const paymentStatus =
      status === "COMPLETED" || status === "IN_PROGRESS" ? "PAID" : "UNPAID";

    const bookingData = {
      bookingCode,
      customerId,
      petId: pet._id,
      branchServiceId: branchService._id,
      bookingType,
      unitPrice,
      paymentStatus,
      customerNote: "Dữ liệu Booking phục vụ kiểm thử Admin.",
      status,
      statusHistory,
      createdAt,
      updatedAt: statusHistory[statusHistory.length - 1].changedAt,
    };

    if (bookingType === "APPOINTMENT") {
      const time = APPOINTMENT_TIMES[index % APPOINTMENT_TIMES.length];

      bookingData.bookingDate = makeDate(
        status === "PENDING" || status === "CONFIRMED"
          ? 3 + index
          : -(index + 1),
      );

      bookingData.startTime = time[0];
      bookingData.endTime = time[1];

      bookingData.totalPrice = unitPrice;
    } else {
      const numberOfDays = 1 + (index % 4);

      const checkInDate = makeDate(
        status === "PENDING" || status === "CONFIRMED"
          ? 3 + index
          : -(index + numberOfDays + 1),
      );

      const checkOutDate = new Date(checkInDate);

      checkOutDate.setUTCDate(checkOutDate.getUTCDate() + numberOfDays);

      bookingData.checkInDate = checkInDate;

      bookingData.checkOutDate = checkOutDate;

      bookingData.numberOfDays = numberOfDays;

      bookingData.boardingDetails = {
        feedingSchedule: "2 lần/ngày",
        specialCare: "Dữ liệu kiểm thử.",
      };

      bookingData.totalPrice = unitPrice * numberOfDays;
    }

    await Booking.create(bookingData);

    createdCount++;

    console.log(
      `Đã tạo ${bookingCode} | ` +
        `${bookingType} | ${status} | ` +
        `${pet.name}`,
    );
  }

  console.log("\n===== KẾT QUẢ =====");
  console.log("Booking mới:", createdCount);
  console.log("Booking đã tồn tại:", skippedCount);
  console.log("Tổng Booking mẫu dự kiến:", TOTAL_BOOKINGS);

  console.log("\nSeed Booking hoàn tất!");
}

seedBookings()
  .catch((error) => {
    console.error("\nSeed Booking thất bại:", error.message);

    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
