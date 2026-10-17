const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetType: { type: String, enum: ["USER", "BUSINESS", "REVIEW"] },
    // These stored targetType values are not Mongoose model names.
    targetId: mongoose.Schema.Types.ObjectId,
    reason: String,
    description: String,
    status: { type: String, enum: ["OPEN", "REVIEWING", "RESOLVED", "REJECTED"] },
    adminNote: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: Date,
  },
  { timestamps: true, collection: "reports", versionKey: false },
);

module.exports = mongoose.model("Report", reportSchema);
