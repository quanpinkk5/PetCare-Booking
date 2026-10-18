const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    businessReply: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ["VISIBLE", "HIDDEN"] },
  },
  { timestamps: true, collection: "reviews", versionKey: false },
);

module.exports = mongoose.model("Review", reviewSchema);
