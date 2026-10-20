
require("dotenv").config();

const mongoose = require("mongoose");

const Booking = require("../src/models/Booking");
const Review = require("../src/models/Review");
const BranchService = require("../src/models/BranchService");
const Branch = require("../src/models/Branch");
const Service = require("../src/models/Service");
const User = require("../src/models/User");
const Pet = require("../src/models/Pet");

const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI;

const REVIEW_SAMPLES = [
  {
    rating: 5,
    comment:
      "Dịch vụ rất tốt, nhân viên chăm sóc bé rất chu đáo. Mình rất hài lòng!",
  },
  {
    rating: 4,
    comment:
      "Cơ sở sạch sẽ, nhân viên nhiệt tình. Bé được chăm sóc tốt.",
  },
  {
    rating: 3,
    comment:
      "Chất lượng dịch vụ ổn nhưng thời gian chờ hơi lâu. Mong cơ sở cải thiện.",
  },
  {
    rating: 5,
    comment:
      "Trải nghiệm rất tốt, bé nhà mình được chăm sóc cẩn thận. Sẽ quay lại!",
  },
  {
    rating: 2,
    comment:
      "Dịch vụ chưa được như mong đợi, cần cải thiện cách phục vụ.",
  },
];

const seedReviews = async () => {
  if (!MONGO_URI) {
    throw new Error(
      "Không tìm thấy MONGO_URI hoặc MONGODB_URI trong .env."
    );
  }

  await mongoose.connect(MONGO_URI);

  console.log("Đã kết nối MongoDB.");

  // ========================================
  // 1. LẤY CÁC BOOKING TEST ĐÃ HOÀN THÀNH
  // ========================================
  const bookings = await Booking.find({
    bookingCode: /^TESTBK-202610-/,
    status: "COMPLETED",
  })
    .populate({
      path: "branchServiceId",
      select: "branchId serviceId",
      populate: [
        {
          path: "branchId",
          select: "businessId name",
        },
        {
          path: "serviceId",
          select: "name",
        },
      ],
    })
    .sort({ bookingCode: 1 })
    .lean();

  console.log(
    `Tìm thấy ${bookings.length} Booking COMPLETED mẫu.`
  );

  if (!bookings.length) {
    console.log(
      "Không có Booking COMPLETED để tạo Review."
    );
    return;
  }

  // ========================================
  // 2. KIỂM TRA QUAN HỆ DỮ LIỆU
  // ========================================
  for (const booking of bookings) {
    const branchService = booking.branchServiceId;
    const branch = branchService?.branchId;
    const service = branchService?.serviceId;

    if (
      !booking.customerId ||
      !branch?._id ||
      !branch.businessId ||
      !service?._id
    ) {
      throw new Error(
        `Booking ${booking.bookingCode} thiếu ` +
          "Customer, Branch, Business hoặc Service."
      );
    }
  }

  // ========================================
  // 3. TẠO REVIEW MẪU
  // ========================================
  let created = 0;
  let skipped = 0;

  for (let index = 0; index < bookings.length; index++) {
    const booking = bookings[index];

    // Một Booking chỉ có tối đa một Review
    const existingReview = await Review.findOne({
      bookingId: booking._id,
    });

    if (existingReview) {
      skipped++;

      console.log(
        `Bỏ qua ${booking.bookingCode}: đã có Review.`
      );

      continue;
    }

    const branchService = booking.branchServiceId;
    const branch = branchService.branchId;
    const service = branchService.serviceId;

    const sample =
      REVIEW_SAMPLES[index % REVIEW_SAMPLES.length];

    const status =
      index % 4 === 2 ? "HIDDEN" : "VISIBLE";

    // Review được tạo sau khi Booking hoàn thành.
    // Đây là dữ liệu thời gian giả lập.
    const createdAt = new Date(
      new Date(booking.updatedAt).getTime() +
        (index + 1) * 60 * 60 * 1000
    );

    await Review.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      businessId: branch.businessId,
      branchId: branch._id,
      serviceId: service._id,

      rating: sample.rating,
      comment: sample.comment,
      images: [],

      businessReply: {
        content: "",
        repliedAt: null,
        repliedBy: null,
      },

      status,
      createdAt,
      updatedAt: createdAt,
    });

    created++;

    console.log(
      `Đã tạo Review cho ${booking.bookingCode} | ` +
        `${sample.rating} sao | ${status}`
    );
  }

  // ========================================
  // 4. KẾT QUẢ
  // ========================================
  console.log("\n===== KẾT QUẢ =====");
  console.log("Booking COMPLETED:", bookings.length);
  console.log("Review mới:", created);
  console.log("Review đã tồn tại:", skipped);

  console.log("\nSeed Review hoàn tất!");
};

seedReviews()
  .catch((error) => {
    console.error(
      "Seed Review thất bại:",
      error
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
