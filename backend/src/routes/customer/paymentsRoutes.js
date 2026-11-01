const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");

const {
  createVnpayPayment,
  vnpayIpn,
  vnpayReturn,
  getPaymentStatus,
  retryVnpayPayment,
} = require("../../controllers/customer/paymentsController");

router.post("/payments/vnpay/create", authenticate, createVnpayPayment);

router.get("/payments/vnpay/ipn", vnpayIpn);

router.get("/payments/vnpay/return", vnpayReturn);

router.get("/payments/:bookingId/status", authenticate, getPaymentStatus);
// Thanh toán lại khi giao dịch cũ quá hạn
router.post("/payments/vnpay/retry", authenticate, retryVnpayPayment);
module.exports = router;
