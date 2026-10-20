const express = require("express");
const router = express.Router();

const businessesController = require("../../controllers/customer/businessesController");

// GET - Danh sách doanh nghiệp
router.get("/businesses", businessesController.getAllBusinesses);

// GET - Chi tiết doanh nghiệp
router.get("/businesses/:id", businessesController.getBusinessById);

module.exports = router;
