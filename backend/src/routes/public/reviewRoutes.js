const express = require("express");
const router = express.Router();

const reviewController = require("../../controllers/public/reviewController");

// Lấy tất cả đánh giá công khai
// Không cần xác thực người dùng
router.get("/reviews", reviewController.getAllReviews);
router.get('/reviews/featured', reviewController.getFeaturedReviews);
router.get('/businesses/:id/reviews', reviewController.getBusinessReviews);

module.exports = router;
