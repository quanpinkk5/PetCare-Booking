const express = require("express");
const router = express.Router();
const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");
const bookingController = require("../../controllers/customer/bookingController");
const { getDiary } = require("../../controllers/customer/petDiaryController");

router.get('/bookings/:id/diary', authenticate, authorize('CUSTOMER'), getDiary);

router.post(
  "/bookings",
  authenticate,
  authorize("CUSTOMER"),
  bookingController.createBooking,
);
router.get(
  "/bookings",
  authenticate,
  authorize("CUSTOMER"),
  bookingController.getAllBookings,
);
router.get(
  "/bookings/:id",
  authenticate,
  authorize("CUSTOMER"),
  bookingController.getBookingById,
);
// Khách hàng hủy lịch đặt
router.patch(
  "/bookings/:id/cancel",
  authenticate,
  authorize("CUSTOMER"),
  bookingController.cancelBooking,
);
module.exports = router;
