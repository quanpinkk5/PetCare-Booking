const router = require("express").Router();
const authenticate = require("../../middlewares/authMiddleware");
const { getPayments } = require("../../controllers/businessOwner/paymentsController");

router.get("/payments", authenticate, getPayments);

module.exports = router;
