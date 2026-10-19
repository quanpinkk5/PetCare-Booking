const express = require("express");
const router = express.Router();

const reviewController = require("../../controllers/public/reviewController");

// Lấy tất cả đánh giá công khai
// Không cần xác thực người dùng
router.get("/reviews", reviewController.getAllReviews);

module.exports = router;