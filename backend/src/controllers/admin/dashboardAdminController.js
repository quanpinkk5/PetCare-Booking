const User = require("../../models/User");
const Business = require("../../models/Business");
const Booking = require("../../models/Booking");
const Payment = require("../../models/Payment");
const Review = require("../../models/Review");

// =======================================
// CẤU HÌNH THỜI GIAN
// =======================================
const TIMEZONE = "Asia/Ho_Chi_Minh";

// Lấy năm/tháng hiện tại theo giờ Việt Nam.
const getVietnamYearMonth = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((item) => item.type === "year").value);

  const month = Number(parts.find((item) => item.type === "month").value);

  return { year, month };
};

// Mốc đầu tháng Việt Nam đổi thành UTC để MongoDB lọc.
const getMonthStart = (year, month) => {
  const date = new Date(Date.UTC(year, month - 1, 1));

  const yearText = date.getUTCFullYear();
  const monthText = String(date.getUTCMonth() + 1).padStart(2, "0");

  return new Date(`${yearText}-${monthText}-01T00:00:00+07:00`);
};

const getPeriods = () => {
  const { year, month } = getVietnamYearMonth();

  return {
    currentStart: getMonthStart(year, month),
    nextStart: getMonthStart(year, month + 1),
    previousStart: getMonthStart(year, month - 1),
  };
};

const getGrowth = (current, previous) => {
  if (previous === 0) {
    // Không tạo tỷ lệ tăng trưởng vô hạn.
    return null;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const monthRange = (field, start, end) => ({
  [field]: {
    $gte: start,
    $lt: end,
  },
});

// =======================================
// GET /api/admin/dashboard/metrics
// 6 THẺ THỐNG KÊ
// =======================================

const getDashboardMetrics = async (req, res) => {
  try {
    const [
      totalUsers,
      activeBusinesses,
      pendingBusinesses,
      totalBookings,
      totalReviews,
      revenueResult,
    ] = await Promise.all([
      // Tổng người dùng
      User.countDocuments(),

      // Tổng cơ sở đã được duyệt
      Business.countDocuments({
        status: "APPROVED",
      }),

      // Tổng cơ sở đang chờ duyệt
      Business.countDocuments({
        status: "PENDING",
      }),

      // Tổng Booking
      Booking.countDocuments(),

      // Tổng đánh giá
      Review.countDocuments(),

      // Tổng doanh thu từ Payment đã thanh toán
      Payment.aggregate([
        {
          $match: {
            status: "PAID",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const totalPaidRevenue = revenueResult[0]?.totalAmount || 0;

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          activeBusinesses,
          pendingBusinesses,
          totalBookings,
          totalPaidRevenue,
          totalReviews,
        },
      },
    });
  } catch (error) {
    console.error("[Admin Dashboard] getDashboardMetrics:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê Dashboard.",
    });
  }
};

// =======================================
// GET /api/admin/dashboard/charts
// BIỂU ĐỒ BOOKING VÀ PAYMENT
// =======================================
const getDashboardCharts = async (req, res) => {
  try {
    const { year, month } = getVietnamYearMonth();

    const months = [];

    // 6 tháng gần nhất, bao gồm tháng hiện tại.
    for (let index = 5; index >= 0; index--) {
      const date = new Date(Date.UTC(year, month - 1 - index, 1));

      const targetYear = date.getUTCFullYear();
      const targetMonth = date.getUTCMonth() + 1;

      months.push({
        key: `${targetYear}-${String(targetMonth).padStart(2, "0")}`,
        label: `Tháng ${targetMonth}/${targetYear}`,
      });
    }

    const firstMonth = months[0].key;

    const startDate = new Date(`${firstMonth}-01T00:00:00+07:00`);

    const endDate = getMonthStart(year, month + 1);

    const [bookingGroups, paymentGroups] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              month: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$createdAt",
                  timezone: TIMEZONE,
                },
              },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
      ]),

      Payment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const bookingMonthly = months.map((item) => {
      const monthGroups = bookingGroups.filter(
        (group) => group._id.month === item.key,
      );

      return {
        month: item.key,
        label: item.label,

        total: monthGroups.reduce((sum, group) => sum + group.count, 0),

        completed: monthGroups
          .filter((group) => group._id.status === "COMPLETED")
          .reduce((sum, group) => sum + group.count, 0),
      };
    });

    const statusCounts = {
      PAID: 0,
      PROCESSING: 0,
      PENDING: 0,
      FAILED: 0,
    };

    for (const group of paymentGroups) {
      if (Object.prototype.hasOwnProperty.call(statusCounts, group._id)) {
        statusCounts[group._id] = group.count;
      }
    }

    const paymentTotal = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    const paymentDistribution = [
      {
        status: "PAID",
        label: "Đã thanh toán",
        count: statusCounts.PAID,
      },
      {
        status: "PROCESSING",
        label: "Đang xử lý",
        count: statusCounts.PROCESSING,
      },
      {
        status: "PENDING",
        label: "Chờ thanh toán",
        count: statusCounts.PENDING,
      },
      {
        status: "FAILED",
        label: "Thất bại",
        count: statusCounts.FAILED,
      },
    ].map((item) => ({
      ...item,
      percentage:
        paymentTotal > 0
          ? Number(((item.count / paymentTotal) * 100).toFixed(1))
          : 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        bookingChart: {
          months: bookingMonthly,
        },

        paymentChart: {
          total: paymentTotal,
          distribution: paymentDistribution,
        },
      },
    });
  } catch (error) {
    console.error("[Admin Dashboard] getDashboardCharts:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy dữ liệu biểu đồ.",
    });
  }
};

// =======================================
// GET /api/admin/dashboard/pending-businesses
// CƠ SỞ CHỜ DUYỆT
// =======================================
const getPendingBusinesses = async (req, res) => {
  try {
    const [total, businesses] = await Promise.all([
      Business.countDocuments({
        status: "PENDING",
      }),

      Business.find({
        status: "PENDING",
      })
        .select("_id ownerId name logo description status createdAt")
        .populate({
          path: "ownerId",
          select: "fullName email",
        })
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,

        businesses: businesses.map((business) => ({
          _id: business._id,
          name: business.name,
          logo: business.logo || "",
          status: business.status,
          createdAt: business.createdAt,

          owner: business.ownerId
            ? {
                _id: business.ownerId._id,
                fullName: business.ownerId.fullName || "",
                email: business.ownerId.email || "",
              }
            : null,

          // Business không có trường
          // dịch vụ chính nên chưa suy diễn.
          mainServices: [],
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Dashboard] getPendingBusinesses:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách cơ sở chờ duyệt.",
    });
  }
};

// =======================================
// GET /api/admin/dashboard/activities
// HOẠT ĐỘNG GẦN ĐÂY
// =======================================
const getRecentActivities = async (req, res) => {
  try {
    const [businesses, bookings, users, payments, reviews] = await Promise.all([
      Business.find()
        .select("_id name createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Booking.find()
        .select("_id bookingCode createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      User.find()
        .select("_id fullName email createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Payment.find({
        status: "PAID",
        paidAt: { $ne: null },
      })
        .select("_id paymentCode amount paidAt")
        .sort({ paidAt: -1 })
        .limit(5)
        .lean(),

      Review.find()
        .select("_id rating createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const activities = [
      ...businesses.map((item) => ({
        id: `business-${item._id}`,
        type: "BUSINESS_CREATED",
        text: `Cơ sở "${item.name}" đã đăng ký mới`,
        createdAt: item.createdAt,
        referenceId: item._id,
        referenceType: "BUSINESS",
      })),

      ...bookings.map((item) => ({
        id: `booking-${item._id}`,
        type: "BOOKING_CREATED",
        text: `Booking #${item.bookingCode} đã được tạo`,
        createdAt: item.createdAt,
        referenceId: item._id,
        referenceType: "BOOKING",
      })),

      ...users.map((item) => ({
        id: `user-${item._id}`,
        type: "USER_CREATED",
        text: `Người dùng "${item.fullName || item.email}" đã đăng ký`,
        createdAt: item.createdAt,
        referenceId: item._id,
        referenceType: "USER",
      })),

      ...payments.map((item) => ({
        id: `payment-${item._id}`,
        type: "PAYMENT_PAID",
        text: `Thanh toán #${item.paymentCode} ` + "đã thành công",
        createdAt: item.paidAt,
        referenceId: item._id,
        referenceType: "PAYMENT",
      })),

      ...reviews.map((item) => ({
        id: `review-${item._id}`,
        type: "REVIEW_CREATED",
        text: `Có đánh giá mới ${item.rating} sao`,
        createdAt: item.createdAt,
        referenceId: item._id,
        referenceType: "REVIEW",
      })),
    ]
      .filter(
        (item) =>
          item.createdAt && !Number.isNaN(new Date(item.createdAt).getTime()),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        activities,
      },
    });
  } catch (error) {
    console.error("[Admin Dashboard] getRecentActivities:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy hoạt động gần đây.",
    });
  }
};

module.exports = {
  getDashboardMetrics,
  getDashboardCharts,
  getPendingBusinesses,
  getRecentActivities,
};
