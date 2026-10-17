const express = require("express");

const authenticate = require("../middlewares/authMiddleware");
const  authorize  = require("../middlewares/roleMiddleware");

const adminController = require("../controllers/admin/adminController");

const router = express.Router();

// Tất cả API Admin đều phải đăng nhập và có quyền ADMIN
router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/dashboard", adminController.getDashboard);

module.exports = router;