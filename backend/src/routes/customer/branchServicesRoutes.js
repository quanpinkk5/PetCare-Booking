const express = require("express");
const router = express.Router();

const branchServicesController = require("../../controllers/customer/branchServicesController");

// GET - Danh sách dịch vụ tại chi nhánh
router.get(
  "/branches/:id/services",
  branchServicesController.getServicesByBranchId,
);
// GET - Chi tiết dịch vụ tại chi nhánh
router.get(
  "/branchServices/:id",
  branchServicesController.getBranchServiceById
);
module.exports = router;
