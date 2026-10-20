const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const scheduleExceptionsController = require("../../controllers/businessOwner/scheduleExceptionsController");

// POST - Tạo lịch ngoại lệ
router.post(
  "/scheduleExceptions",
  authenticate,
  scheduleExceptionsController.createScheduleException,
);

// PATCH - Cập nhật lịch ngoại lệ
router.patch(
  "/scheduleExceptions/:id",
  authenticate,
  scheduleExceptionsController.updateScheduleException,
);
// GET - Lấy tất cả lịch ngoại lệ
router.get(
  "/scheduleExceptions",
  authenticate,
  scheduleExceptionsController.getAllScheduleExceptions
);
// GET - Lấy chi tiết lịch ngoại lệ
router.get(
  "/scheduleExceptions/:id",
  authenticate,
  scheduleExceptionsController.getScheduleExceptionById
);
// DELETE - Xóa lịch ngoại lệ
router.delete(
  "/scheduleExceptions/:id",
  authenticate,
  scheduleExceptionsController.deleteScheduleException
);
module.exports = router;
