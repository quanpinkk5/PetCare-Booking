
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authController");
const authenticate = require("../middlewares/authMiddleware");
const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middlewares/authRateLimiter");
// const {
//   googleLogin,
// } = require("../controllers/auth/googleAuthController");

// Đăng ký tài khoản CUSTOMER
router.post("/register", authController.register);

// Đăng nhập cho cả 3 role
router.post("/login", loginLimiter, authController.login);

// Lấy thông tin người dùng đang đăng nhập
router.get("/me", authenticate, authController.getMe);

// Làm mới access token
router.post("/refresh", authController.refresh);

// Đăng xuất và thu hồi refresh token
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword
);
router.post("/reset-password", authController.resetPassword);
// router.post("/google", googleLogin);

module.exports = router;
