const express = require("express");

const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const adminController = require("../controllers/admin/adminController");
const userAdminController = require("../controllers/admin/userAdminController");
const router = express.Router();
const businessOwnerAdminController = require("../controllers/admin/businessOwnerAdminController");
const petAdminController = require("../controllers/admin/petAdminController");
const userKpiAdminController = require("../controllers/admin/userKpiAdminController");
const userBookingAdminController = require("../controllers/admin/userBookingAdminController");
const userPaymentAdminController = require("../controllers/admin/userPaymentAdminController");
const userStatisticsAdminController = require("../controllers/admin/userStatisticsAdminController");
const userExportAdminController = require("../controllers/admin/userExportAdminController");
const businessAdminController = require("../controllers/admin/businessAdminController");
const {
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  updateServiceCategoryStatus,
} = require("../controllers/admin/serviceCategoryAdminController");
const {
  getBookings,
  getBookingMetrics,
  getBookingDetail,
} = require("../controllers/admin/bookingAdminController");
const {
  getPayments,
  getPaymentMetrics,
  getPaymentDetail,
} = require("../controllers/admin/paymentAdminController");
const {
  getReviews,
  getReviewFacilities,
  getReviewDetail,
  updateReviewStatus,
} = require("../controllers/admin/reviewAdminController");
const {
  getNotifications,
  markNotificationAsRead,
  deleteSelectedNotifications,
   getUnreadNotificationCount,
} = require("../controllers/admin/notificationAdminController");
const {
  getDashboardMetrics,
  getDashboardCharts,
  getPendingBusinesses,
  getRecentActivities,
} = require("../controllers/admin/dashboardAdminController");
// Tất cả API Admin đều phải đăng nhập và có quyền ADMIN
router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/dashboard", adminController.getDashboard);
router.get("/users", userAdminController.getUsers);
router.get(
  "/users/statistics",
  userStatisticsAdminController.getUserStatistics,
);
router.get("/users/export", userExportAdminController.exportUsers);
router.get("/users/:id", userAdminController.getUserById);
router.patch("/users/:id/status", userAdminController.updateUserStatus);
router.post(
  "/business-owners",
  businessOwnerAdminController.createBusinessOwner,
);
router.get("/users/:id/pets", petAdminController.getUserPets);
router.get("/users/:id/kpis", userKpiAdminController.getUserKPIs);
router.get("/users/:id/bookings", userBookingAdminController.getUserBookings);
router.get("/users/:id/payments", userPaymentAdminController.getUserPayments);
// Danh sách khu vực
router.get(
  "/businesses/locations",
  businessAdminController.getBusinessLocations,
);
// Danh sách thương hiệu
router.get("/businesses", businessAdminController.getBusinesses);
// Chi tiết thương hiệu
router.get("/businesses/:id", businessAdminController.getBusinessById);
// Cập nhật trạng thái thương hiệu
router.patch(
  "/businesses/:id/status",
  businessAdminController.updateBusinessStatus,
);
router.get(
  "/businesses/:id/services",
  businessAdminController.getBusinessServices,
);
router.post(
  "/businesses/:id/request-info",
  businessAdminController.requestBusinessInfo,
);
router.get("/service-categories", getServiceCategories);
router.post("/service-categories", createServiceCategory);
router.patch("/service-categories/:id", updateServiceCategory);

router.patch("/service-categories/:id/status", updateServiceCategoryStatus);
// Thống kê Booking
router.get("/bookings/metrics", getBookingMetrics);
router.get("/bookings", getBookings);
// Chi tiết Booking
router.get("/bookings/:id", getBookingDetail);
// ======================================
// QUẢN LÝ THANH TOÁN - ADMIN
// ======================================

// Thống kê Payment
router.get("/payments/metrics", getPaymentMetrics);

// Danh sách Payment
router.get("/payments", getPayments);

// Chi tiết Payment
router.get("/payments/:id", getPaymentDetail);

// ======================================
// QUẢN LÝ ĐÁNH GIÁ - ADMIN
// ======================================

// Danh sách đánh giá
router.get("/reviews", getReviews);

// Danh sách cơ sở cho bộ lọc
router.get("/reviews/facilities", getReviewFacilities);

// Chi tiết đánh giá
router.get("/reviews/:id", getReviewDetail);

// Ẩn hoặc khôi phục đánh giá
router.patch("/reviews/:id/status", updateReviewStatus);

// ======================================
// QUẢN LÝ THÔNG BÁO - ADMIN
// ======================================

// Danh sách thông báo
router.get("/notifications", getNotifications);
router.get("/notifications/unread-count", getUnreadNotificationCount);

// Đánh dấu một thông báo đã đọc
router.patch("/notifications/:id/read", markNotificationAsRead);

// Xóa những thông báo được chọn
router.delete("/notifications", deleteSelectedNotifications);

// ========================================
// ADMIN DASHBOARD
// ========================================

// 6 thẻ thống kê
router.get("/dashboard/metrics", getDashboardMetrics);

// 2 biểu đồ
router.get("/dashboard/charts", getDashboardCharts);

// 5 cơ sở chờ duyệt mới nhất
router.get("/dashboard/pending-businesses", getPendingBusinesses);

// 5 hoạt động gần đây
router.get("/dashboard/activities", getRecentActivities);

module.exports = router;
