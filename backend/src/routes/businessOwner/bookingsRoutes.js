const express = require("express");
const authenticate = require("../../middlewares/authMiddleware");
const {
  getBookings,
  getBookingById,
  updateBookingStatus,
  updateBookingProgress,
  getBookingFilterOptions
} = require("../../controllers/businessOwner/bookingController");
const router = express.Router();
// Tất cả API đều yêu cầu đăng nhập
router.use(authenticate);

// Chỉ BUSINESS_OWNER được quản lý lịch
router.use((req, res, next) => {
  if (req.user?.role !== "BUSINESS_OWNER") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền quản lý lịch làm việc",
    });
  }

  next();
});
// GET /api/business-owner/bookings
router.get("/", getBookings);
router.get("/filter-options", getBookingFilterOptions);
router.get("/:id", getBookingById);
// Duyệt / Từ chối Booking
router.patch("/:id/status", updateBookingStatus);
// Bắt đầu / Hoàn thành dịch vụ
router.patch("/:id/progress", updateBookingProgress);
module.exports = router;
