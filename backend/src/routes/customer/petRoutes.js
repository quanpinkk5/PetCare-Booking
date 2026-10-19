const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

const petController = require("../../controllers/customer/petController");

// POST - Tạo thú cưng
router.post(
  "/pets",
  authenticate,
  authorize("CUSTOMER"),
  petController.createPet
);

// GET - Danh sách thú cưng
router.get(
  "/pets",
  authenticate,
  authorize("CUSTOMER"),
  petController.getPets
);

// PATCH - Cập nhật thú cưng
router.patch(
  "/pets/:id",
  authenticate,
  authorize("CUSTOMER"),
  petController.updatePet
);

// DELETE - Xóa mềm thú cưng
router.delete(
  "/pets/:id",
  authenticate,
  authorize("CUSTOMER"),
  petController.deletePet
);

module.exports = router;