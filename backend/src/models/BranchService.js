const mongoose = require("mongoose");

const branchServiceSchema = new mongoose.Schema(
  {
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    price: Number,
    pricingUnit: { type: String, enum: ["PER_SERVICE", "PER_DAY"] },
    durationMinutes: Number,
    capacity: Number,
    petTypes: { type: [{ type: String, enum: ["DOG", "CAT"] }], default: undefined },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  },
  { timestamps: true, collection: "branchServices", versionKey: false },
);

module.exports = mongoose.model("BranchService", branchServiceSchema);
