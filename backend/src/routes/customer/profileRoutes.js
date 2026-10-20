const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

const profileController = require("../../controllers/customer/profileController");

// Chỉ người đăng nhập mới được gọi
router.patch("/profile", authenticate, authorize("CUSTOMER"), profileController.updateProfile);

module.exports = router;
