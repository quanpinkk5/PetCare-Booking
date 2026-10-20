const express = require("express");
const router = express.Router();

const branchesController = require("../../controllers/customer/branchesController");

// GET - Danh sách chi nhánh của doanh nghiệp
router.get(
  "/businesses/:id/branches",
  branchesController.getBranchesByBusinessId,
);
// GET - Chi tiết chi nhánh
router.get(
  "/branches/:id",
  branchesController.getBranchById,
);
module.exports = router;
