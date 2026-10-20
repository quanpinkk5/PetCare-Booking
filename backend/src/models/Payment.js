
const mongoose = require("mongoose");

const PAYMENT_METHODS = [
  "CASH",
  "VNPAY",
  "MOMO",
  "BANK_TRANSFER",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

const paymentSchema = new mongoose.Schema(
  {
    paymentCode: {
      type: String,
      required: [true, "Mã thanh toán không được để trống"],
      unique: true,
      trim: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking không được để trống"],
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Khách hàng không được để trống"],
      index: true,
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Cơ sở kinh doanh không được để trống"],
    },

    amount: {
      type: Number,
      required: [true, "Số tiền thanh toán không được để trống"],
      min: [0, "Số tiền không được âm"],
    },

    currency: {
      type: String,
      enum: ["VND"],
      default: "VND",
    },

    method: {
      type: String,
      enum: PAYMENT_METHODS,
      required: [true, "Phương thức thanh toán không được để trống"],
    },

    provider: {
      type: String,
      default: "",
      trim: true,
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "PENDING",
      index: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: "",
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      select: false,
    },
  },
  {
    timestamps: true,
    collection: "payments",
  },
);

// Truy vấn thanh toán theo Customer
paymentSchema.index({
  customerId: 1,
  createdAt: -1,
});

// Hỗ trợ thống kê thanh toán thành công
paymentSchema.index({
  customerId: 1,
  status: 1,
});

// Truy vấn thanh toán theo cơ sở kinh doanh
paymentSchema.index({
  businessId: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Payment", paymentSchema);
