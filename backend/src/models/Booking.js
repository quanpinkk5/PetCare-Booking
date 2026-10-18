const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: String,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    branchServiceId: { type: mongoose.Schema.Types.ObjectId, ref: "BranchService" },
    bookingType: { type: String, enum: ["APPOINTMENT", "BOARDING"] },
    bookingDate: Date,
    startTime: String,
    endTime: String,
    checkInDate: Date,
    checkOutDate: Date,
    numberOfDays: Number,
    boardingDetails: mongoose.Schema.Types.Mixed,
    unitPrice: Number,
    totalPrice: Number,
    paymentStatus: { type: String, enum: ["UNPAID", "PAID", "REFUNDED"] },
    customerNote: String,
    // Booking states and nested history fields are not defined in the design.
    status: String,
    statusHistory: { type: [mongoose.Schema.Types.Mixed], default: undefined },
  },
  { timestamps: true, collection: "bookings", versionKey: false },
);

module.exports = mongoose.model("Booking", bookingSchema);
