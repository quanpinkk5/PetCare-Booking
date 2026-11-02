const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../../controllers/businessOwner/schedulesController");

// Tất cả API đều yêu cầu đăng nhập
router.use(authenticate);

// Chỉ BUSINESS_OWNER được quản lý lịch
router.use((req, res, next) => {
  if (req.user?.role !== "BUSINESS_OWNER") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền quản lý lịch làm việc",
    });
  }

  next();
});

router.get("/", getSchedules);
router.post("/", createSchedule);
router.patch("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;
