const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const servicesController = require("../../controllers/businessOwner/servicesController");

// POST - Tạo dịch vụ
router.post("/services", authenticate, servicesController.createService);

// GET - Danh sách dịch vụ theo Business
router.get("/services", authenticate, servicesController.getAllServices);

// PATCH - Cập nhật dịch vụ
router.patch("/services/:id", authenticate, servicesController.updateService);

module.exports = router;
