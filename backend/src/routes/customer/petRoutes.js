const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

const petController = require("../../controllers/customer/petController");

router.use(authenticate, authorize("CUSTOMER"));

// POST /api/customer/pets
router.post("/pets", petController.createPet);
// Lấy danh sách thú cưng
router.get("/pets", petController.getPets);
// Cập nhật thông tin thú cưng
router.patch("/pets/:id", petController.updatePet);
// Xóa mềm thú cưng
router.delete("/pets/:id", petController.deletePet);
module.exports = router;
