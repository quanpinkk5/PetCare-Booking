const router = require("express").Router();
const authenticate = require("../../middlewares/authMiddleware");
const { getPetDiaries } = require("../../controllers/businessOwner/petDiaryController");

router.use(authenticate);
router.use((req, res, next) => {
  if (req.user.role !== "BUSINESS_OWNER") {
    return res.status(403).json({ success: false, message: "Bạn không có quyền quản lý nhật ký thú cưng." });
  }
  next();
});
router.get("/", getPetDiaries);
module.exports = router;
