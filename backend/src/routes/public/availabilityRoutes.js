const express = require("express");
const router = express.Router();

const {
  getAvailableSlots,
} = require("../../controllers/public/availabilityController");

router.get("/slots", getAvailableSlots);

module.exports = router;