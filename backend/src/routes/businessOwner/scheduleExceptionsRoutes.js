
const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const {
  getExceptions,
  createException,
  updateException,
  deleteException,
} = require("../../controllers/businessOwner/scheduleExceptionsController");

router.use(authenticate);

// Chỉ Business Owner được quản lý ngoại lệ lịch
router.use((req, res, next) => {
  if (req.user?.role !== "BUSINESS_OWNER") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền quản lý ngoại lệ lịch",
    });
  }

  next();
});

router.get("/", getExceptions);
router.post("/", createException);
router.patch("/:id", updateException);
router.delete("/:id", deleteException);

module.exports = router;
