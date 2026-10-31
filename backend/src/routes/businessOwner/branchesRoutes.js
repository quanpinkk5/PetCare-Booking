const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const branchesController = require("../../controllers/businessOwner/branchesController");

router.get("/branches", authenticate, branchesController.getBranches);

// POST - Tạo chi nhánh
router.post("/branches", authenticate, branchesController.createBranch);

// PATCH - Cập nhật chi nhánh
router.patch("/branches/:id", authenticate, branchesController.updateBranch);

// GET - Xem chi tiết chi nhánh
router.get("/branches/:id", authenticate, branchesController.getBranchById);

module.exports = router;
