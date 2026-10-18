const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory" },
    name: String,
    description: String,
    serviceType: { type: String, enum: ["APPOINTMENT", "BOARDING"] },
    images: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  },
  { timestamps: true, collection: "services", versionKey: false },
);

module.exports = mongoose.model("Service", serviceSchema);
