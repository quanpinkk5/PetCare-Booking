
require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../src/models/User");
const Notification = require("../src/models/Notification");

const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI;

// ============================================
// DỮ LIỆU THÔNG BÁO DEMO
// ============================================
// Đây chỉ là thông báo mẫu, không phát sinh
// yêu cầu duyệt, giao dịch hoặc báo cáo thật.

const DEMO_NOTIFICATIONS = [
  {
    type: "BUSINESS_REGISTRATION",
    title: "Yêu cầu phê duyệt cơ sở mới",
    message:
      "[DEMO] Có yêu cầu đăng ký cơ sở kinh doanh mới đang chờ Admin xem xét.",
  },
  {
    type: "BUSINESS_REGISTRATION",
    title: "Yêu cầu đăng ký cơ sở cần xử lý",
    message:
      "[DEMO] Một cơ sở kinh doanh đã gửi hồ sơ đăng ký và đang chờ phê duyệt.",
  },
  {
    type: "PAYMENT_FAILED",
    title: "Giao dịch thanh toán thất bại",
    message:
      "[DEMO] Hệ thống ghi nhận một giao dịch thanh toán thất bại.",
  },
  {
    type: "PAYMENT_SUCCESS",
    title: "Giao dịch thanh toán thành công",
    message:
      "[DEMO] Một khách hàng đã hoàn tất thanh toán cho Booking.",
  },
  {
    type: "BOOKING_CREATED",
    title: "Booking mới được tạo",
    message:
      "[DEMO] Hệ thống vừa ghi nhận một Booking mới.",
  },
  {
    type: "BOOKING_COMPLETED",
    title: "Booking đã hoàn thành",
    message:
      "[DEMO] Một Booking đã được hoàn thành thành công.",
  },
  {
    type: "REVIEW_CREATED",
    title: "Có đánh giá dịch vụ mới",
    message:
      "[DEMO] Khách hàng vừa gửi đánh giá sau khi sử dụng dịch vụ.",
  },
  {
    type: "SYSTEM",
    title: "Thông báo từ hệ thống",
    message:
      "[DEMO] Chào mừng Admin đến với hệ thống quản trị PetCare Booking.",
  },
  {
    type: "SYSTEM",
    title: "Kiểm tra hoạt động hệ thống",
    message:
      "[DEMO] Các chức năng quản lý cơ bản đang sẵn sàng để kiểm thử.",
  },
  {
    type: "SYSTEM",
    title: "Thông báo bảo trì thử nghiệm",
    message:
      "[DEMO] Đây là thông báo giả lập phục vụ kiểm thử giao diện Admin.",
  },
  {
    type: "REPORT",
    title: "Báo cáo hoạt động hệ thống",
    message:
      "[DEMO] Báo cáo tổng hợp hoạt động đã sẵn sàng để xem xét.",
  },
  {
    type: "SYSTEM",
    title: "Cập nhật dữ liệu thử nghiệm",
    message:
      "[DEMO] Hệ thống vừa cập nhật dữ liệu phục vụ kiểm thử.",
  },
  {
    type: "PAYMENT_FAILED",
    title: "Cảnh báo thanh toán",
    message:
      "[DEMO] Có một giao dịch cần được kiểm tra trạng thái thanh toán.",
  },
  {
    type: "BOOKING_CREATED",
    title: "Có lịch đặt dịch vụ mới",
    message:
      "[DEMO] Một lịch đặt dịch vụ thú cưng mới vừa được tạo.",
  },
  {
    type: "REVIEW_CREATED",
    title: "Đánh giá mới cần theo dõi",
    message:
      "[DEMO] Hệ thống vừa nhận được phản hồi mới từ khách hàng.",
  },
  {
    type: "SYSTEM",
    title: "Thông báo kiểm thử cuối",
    message:
      "[DEMO] Thông báo dùng để kiểm tra phân trang và xóa hàng loạt.",
  },
];

// ============================================
// SEED
// ============================================

async function seedAdminNotifications() {
  if (!MONGO_URI) {
    throw new Error(
      "Không tìm thấy MONGO_URI hoặc MONGODB_URI trong .env"
    );
  }

  await mongoose.connect(MONGO_URI);

  console.log("Đã kết nối MongoDB.");

  // Lấy tất cả tài khoản Admin đang tồn tại.
  const admins = await User.find({
    role: "ADMIN",
  })
    .select("_id fullName email")
    .lean();

  if (admins.length === 0) {
    console.log(
      "Không tìm thấy tài khoản ADMIN. Không tạo dữ liệu."
    );
    return;
  }

  console.log(
    `Tìm thấy ${admins.length} tài khoản ADMIN.`
  );

  let created = 0;
  let skipped = 0;

  // Mỗi Admin có 16 thông báo riêng.
  for (const admin of admins) {
    console.log(
      `\nĐang tạo thông báo cho: ${
        admin.fullName || admin.email || admin._id
      }`
    );

    for (
      let index = 0;
      index < DEMO_NOTIFICATIONS.length;
      index++
    ) {
      const sample = DEMO_NOTIFICATIONS[index];

      // Dùng dấu [DEMO] để nhận biết dữ liệu seed.
      // Kiểm tra trùng để chạy lại không tạo
      // thêm thông báo giống nhau.
      const existing = await Notification.findOne({
        userId: admin._id,
        type: sample.type,
        title: sample.title,
        message: sample.message,
      });

      if (existing) {
        skipped++;
        continue;
      }

      const createdAt = new Date(
        Date.now() - (index + 1) * 35 * 60 * 1000
      );

      const isRead = index % 4 === 0;

      await Notification.create({
        userId: admin._id,

        type: sample.type,
        title: sample.title,
        message: sample.message,

        referenceType: null,
        referenceId: null,

        isRead,
        readAt: isRead ? createdAt : null,

        createdAt,
      });

      created++;

      console.log(
        `  + ${sample.title} | ${
          isRead ? "Đã đọc" : "Chưa đọc"
        }`
      );
    }
  }

  console.log("\n===== KẾT QUẢ =====");
  console.log("Số Admin:", admins.length);
  console.log("Thông báo mẫu / Admin:", DEMO_NOTIFICATIONS.length);
  console.log("Thông báo mới:", created);
  console.log("Thông báo đã tồn tại:", skipped);
  console.log("\nSeed Admin Notifications hoàn tất!");
}

seedAdminNotifications()
  .catch((error) => {
    console.error(
      "Seed Admin Notifications thất bại:",
      error
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
