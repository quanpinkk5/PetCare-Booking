const express = require("express");
const authenticate = require("../../middlewares/authMiddleware");

const router = express.Router();

const {
  getBoardings,
  getBoardingById,
  checkInBoarding,
  checkOutBoarding,
} = require("../../controllers/businessOwner/boardingController");
const {
  getBoardingDiaries,
  createBoardingDiary,
  updateBoardingDiary,
} = require("../../controllers/businessOwner/petDiaryController");
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
// Danh sách đơn lưu trú
router.get("/", getBoardings);
// Danh sách nhật ký chăm sóc
router.get("/:bookingId/diaries", getBoardingDiaries);

// Tạo nhật ký chăm sóc
router.post("/:bookingId/diaries", createBoardingDiary);
router.patch("/:bookingId/diaries/:diaryId", updateBoardingDiary);


// Chi tiết đơn lưu trú
router.get("/:id", getBoardingById);

// Check-in thú cưng
router.patch("/:id/check-in", checkInBoarding);

// Check-out thú cưng
router.patch("/:id/check-out", checkOutBoarding);

module.exports = router;
