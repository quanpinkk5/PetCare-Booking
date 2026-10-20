require("dotenv").config();

const mongoose = require("mongoose");

const Booking = require("../src/models/Booking");
const Payment = require("../src/models/Payment");

// Đăng ký model phục vụ populate
require("../src/models/BranchService");
require("../src/models/Branch");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const TEST_BOOKING_PREFIX = "TESTBK-202610-";
const TEST_PAYMENT_PREFIX = "TESTPAY-202610-";

const PAYMENT_METHODS = ["MOMO", "VNPAY", "BANK_TRANSFER", "CASH"];

function getPaymentCode(bookingCode) {
  const suffix = bookingCode.slice(TEST_BOOKING_PREFIX.length);

  return `${TEST_PAYMENT_PREFIX}${suffix}`;
}

async function seedBookingPayments() {
  if (!MONGO_URI) {
    throw new Error("Không tìm thấy MONGO_URI hoặc MONGODB_URI trong .env.");
  }

  await mongoose.connect(MONGO_URI);

  console.log("Đã kết nối MongoDB.");

  // ========================================
  // 1. LẤY BOOKING MẪU
  // ========================================
  const bookings = await Booking.find({
    bookingCode: {
      $regex: "^TESTBK-202610-[0-9]{4}$",
    },
  })
    .populate({
      path: "branchServiceId",
      select: "_id branchId serviceId",
      populate: {
        path: "branchId",
        select: "_id businessId name",
      },
    })
    .sort({ bookingCode: 1 })
    .lean();

  if (bookings.length === 0) {
    throw new Error(
      "Không tìm thấy Booking mẫu. " + "Hãy chạy seedBookings.js trước.",
    );
  }

  console.log(`Tìm thấy ${bookings.length} Booking mẫu.`);

  // ========================================
  // 2. KIỂM TRA QUAN HỆ TRƯỚC KHI TẠO
  // ========================================
  for (const booking of bookings) {
    const branch = booking.branchServiceId?.branchId;

    if (!branch?.businessId) {
      throw new Error(
        `Booking ${booking.bookingCode} ` +
          "không có Business hợp lệ thông qua Branch.",
      );
    }

    if (!["PAID", "UNPAID"].includes(booking.paymentStatus)) {
      throw new Error(
        `Booking ${booking.bookingCode} ` +
          `có paymentStatus không hỗ trợ: ${booking.paymentStatus}`,
      );
    }

    if (booking.paymentStatus === "PAID" && booking.status === "CANCELLED") {
      throw new Error(
        `Booking ${booking.bookingCode} đã hủy ` +
          "nhưng có trạng thái PAID. " +
          "Cần kiểm tra nghiệp vụ trước khi seed Payment.",
      );
    }
  }

  // ========================================
  // 3. TẠO PAYMENT MẪU
  // ========================================
  let createdCount = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let skippedCount = 0;

  for (let index = 0; index < bookings.length; index++) {
    const booking = bookings[index];

    const paymentCode = getPaymentCode(booking.bookingCode);

    // Không tạo trùng khi chạy lại.
    // Kiểm tra cả paymentCode lẫn bookingId để
    // không thêm Payment mẫu vào Booking đã có giao dịch.
    const existingPayment = await Payment.findOne({
      $or: [{ paymentCode }, { bookingId: booking._id }],
    }).lean();

    if (existingPayment) {
      skippedCount++;

      console.log(`Bỏ qua ${booking.bookingCode}: ` + "đã có Payment.");

      continue;
    }

    const isPaid = booking.paymentStatus === "PAID";

    const method = PAYMENT_METHODS[index % PAYMENT_METHODS.length];

    const businessId = booking.branchServiceId.branchId.businessId;

    // Dùng mốc thời gian ngay sau khi
    // Booking được tạo làm thời gian seed.
    // Đây chỉ là thời gian giao dịch mẫu.
    const createdAt = new Date(
      new Date(booking.createdAt).getTime() + 5 * 60 * 1000,
    );

    // Payment PAID phải có paidAt.
    // Payment PENDING không có paidAt.
    const paidAt = isPaid
      ? new Date(createdAt.getTime() + 2 * 60 * 1000)
      : null;

    const transactionId = isPaid
      ? `TESTTXN-202610-${String(index + 1).padStart(4, "0")}`
      : "";

    await Payment.create({
      paymentCode,
      bookingId: booking._id,
      customerId: booking.customerId,
      businessId,

      amount: booking.totalPrice,
      currency: "VND",

      method,

      provider: method === "CASH" ? "CASH" : method,

      transactionId,

      status: isPaid ? "PAID" : "PENDING",
      paidAt,

      failedAt: null,
      failureReason: "",

      createdAt,
      updatedAt: paidAt || createdAt,
    });

    createdCount++;

    if (isPaid) {
      paidCount++;
    } else {
      pendingCount++;
    }

    console.log(
      `Đã tạo ${paymentCode} | ` +
        `${method} | ${isPaid ? "PAID" : "PENDING"} | ` +
        `${Number(booking.totalPrice).toLocaleString("vi-VN")}đ`,
    );
  }

  // ========================================
  // 4. KẾT QUẢ
  // ========================================
  console.log("\n===== KẾT QUẢ =====");

  console.log("Booking mẫu:", bookings.length);
  console.log("Payment mới:", createdCount);
  console.log("Payment PAID mới:", paidCount);
  console.log("Payment PENDING mới:", pendingCount);
  console.log("Bỏ qua đã tồn tại:", skippedCount);

  console.log("\nSeed Payment hoàn tất!");
}

seedBookingPayments()
  .catch((error) => {
    console.error("\nSeed Payment thất bại:", error.message);

    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
