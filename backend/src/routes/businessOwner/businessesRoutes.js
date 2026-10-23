const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const businessesController = require(
  "../../controllers/businessOwner/businessesController"
);

// POST - Đăng ký Business
router.post(
  "/businesses",
  authenticate,
  businessesController.createBusiness
);

// GET - Lấy tất cả Businesses
router.get(
  "/businesses",
  authenticate,
  businessesController.getAllBusinesses
);

// Hồ sơ thương hiệu thuộc tài khoản đang đăng nhập.
router.get("/businesses/profile", authenticate, businessesController.getBusinessProfile);
router.patch("/businesses/:id", authenticate, businessesController.updateBusiness);
router.post("/businesses/:id/resubmit", authenticate, businessesController.resubmitBusiness);

// GET - Lấy Businesses theo ID
router.get(
  "/businesses/:id",
  authenticate,
  businessesController.getBusinessesById
);

module.exports = router;
