const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentCode: { type: String, unique: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    amount: Number,
    currency: String,
    method: { type: String, enum: ["CASH", "VNPAY", "MOMO", "BANK_TRANSFER"] },
    provider: String,
    transactionId: String,
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PAID", "FAILED", "REFUNDED"],
    },
    paidAt: Date,
    failedAt: Date,
    refundedAt: Date,
    failureReason: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true, collection: "payments", versionKey: false },
);

module.exports = mongoose.model("Payment", paymentSchema);
