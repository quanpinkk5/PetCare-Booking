const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

const reviewController = require("../../controllers/customer/reviewController");
router.get('/reviews/pending-bookings', authenticate, authorize('CUSTOMER'), reviewController.getPendingReviews);
router.patch('/reviews/:id/helpful', authenticate, authorize('CUSTOMER'), reviewController.setHelpful);

// Khách hàng đánh giá dịch vụ
router.post(
  "/reviews",
  authenticate,
  authorize("CUSTOMER"),
  reviewController.createReview
);
// Update review
router.patch(
  "/reviews/:id",
  authenticate,
  authorize("CUSTOMER"),
  reviewController.updateReview
);
// Delete review
router.delete(
  "/reviews/:id",
  authenticate,
  authorize("CUSTOMER"),
  reviewController.deleteReview
);
// Get reviews by customer
router.get(
  "/reviews",
  authenticate,
  authorize("CUSTOMER"),
  reviewController.getMyReviews
);
module.exports = router;
