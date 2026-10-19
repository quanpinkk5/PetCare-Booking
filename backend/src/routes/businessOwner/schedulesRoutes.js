const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const schedulesController = require("../../controllers/businessOwner/schedulesController");

// POST - Tạo lịch dịch vụ
router.post("/schedules", authenticate, schedulesController.createSchedule);

// PATCH - Cập nhật lịch dịch vụ
router.patch("/schedules/:id", authenticate, schedulesController.updateSchedule);

// GET - Lấy tất cả lịch dịch vụ
router.get("/schedules", authenticate, schedulesController.getAllSchedules);

// GET - Lấy chi tiết lịch dịch vụ
router.get("/schedules/:id", authenticate, schedulesController.getScheduleById);

module.exports = router;
