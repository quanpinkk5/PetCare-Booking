const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    name: String,
    phone: String,
    email: String,
    // Nested fields are not specified in the design.
    address: mongoose.Schema.Types.Mixed,
    openingHours: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    images: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  },
  { timestamps: true, collection: "branches", versionKey: false },
);

module.exports = mongoose.model("Branch", branchSchema);
