const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const branchServicesController = require(
  "../../controllers/businessOwner/branchServicesController"
);

// POST - Thêm dịch vụ vào chi nhánh
router.post(
  "/branchServices",
  authenticate,
  branchServicesController.createBranchService
);

// GET - Danh sách dịch vụ của chi nhánh
router.get(
  "/branchServices",
  authenticate,
  branchServicesController.getAllBranchServices
);

// GET - Chi tiết dịch vụ của chi nhánh
router.get(
  "/branchServices/:id",
  authenticate,
  branchServicesController.getBranchServiceById
);

// PATCH - Cập nhật dịch vụ của chi nhánh
router.patch(
  "/branchServices/:id",
  authenticate,
  branchServicesController.updateBranchService
);

module.exports = router;