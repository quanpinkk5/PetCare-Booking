const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const petController = require("../../controllers/customer/petController");

// POST /api/customer/pets
router.post("/pets", authenticate, petController.createPet);
// Lấy danh sách thú cưng
router.get("/pets", authenticate, petController.getPets);
// Cập nhật thông tin thú cưng
router.patch("/pets/:id", authenticate, petController.updatePet);
// Xóa mềm thú cưng
router.delete(
  "/pets/:id",
  authenticate,
  petController.deletePet
);
module.exports = router;
