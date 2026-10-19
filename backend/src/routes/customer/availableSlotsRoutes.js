const express = require("express");
const router = express.Router();

const availableSlotsController = require("../../controllers/customer/availableSlotsController");

// GET - Khung giờ còn trống
router.get(
  "/branchServices/:id/availableSlots",
  availableSlotsController.getAvailableSlots,
);

module.exports = router;
