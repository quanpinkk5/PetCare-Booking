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

// GET - Lấy Businesses theo ID
router.get(
  "/businesses/:id",
  authenticate,
  businessesController.getBusinessesById
);

module.exports = router;