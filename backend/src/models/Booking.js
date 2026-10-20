
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: [true, "Mã booking không được để trống"],
      unique: true,
      trim: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Khách hàng không được để trống"],
      index: true,
    },

    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: [true, "Thú cưng không được để trống"],
    },

    branchServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BranchService",
      required: [true, "Dịch vụ chi nhánh không được để trống"],
    },

    bookingType: {
      type: String,
      enum: ["APPOINTMENT", "BOARDING"],
      required: [true, "Loại booking không được để trống"],
    },

    // Dành cho dịch vụ đặt lịch theo giờ
    bookingDate: {
      type: Date,
      default: null,
    },

    startTime: {
      type: String,
      default: "",
      trim: true,
    },

    endTime: {
      type: String,
      default: "",
      trim: true,
    },

    // Dành cho dịch vụ lưu trú
    checkInDate: {
      type: Date,
      default: null,
    },

    checkOutDate: {
      type: Date,
      default: null,
    },

    numberOfDays: {
      type: Number,
      min: 1,
      default: null,
    },

    boardingDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Giá được lưu tại thời điểm đặt
    unitPrice: {
      type: Number,
      required: [true, "Đơn giá không được để trống"],
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: [true, "Tổng tiền không được để trống"],
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "UNPAID",
    },

    customerNote: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },

    // Lịch sử chuyển trạng thái booking
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "PENDING",
            "CONFIRMED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ],
          required: true,
        },

        changedAt: {
          type: Date,
          default: Date.now,
        },

        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        note: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "bookings",
  },
);

// Tối ưu truy vấn booking theo khách hàng
bookingSchema.index({
  customerId: 1,
  createdAt: -1,
});

// Tối ưu truy vấn booking theo dịch vụ và ngày đặt
bookingSchema.index({
  branchServiceId: 1,
  bookingDate: 1,
});

// Tối ưu truy vấn booking lưu trú
bookingSchema.index({
  branchServiceId: 1,
  checkInDate: 1,
  checkOutDate: 1,
});

module.exports = mongoose.model("Booking", bookingSchema);
