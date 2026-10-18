const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    title: String,
    message: String,
    // The complete reference types and model mapping are not specified.
    referenceType: String,
    referenceId: mongoose.Schema.Types.ObjectId,
    isRead: Boolean,
    readAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "notifications",
    versionKey: false,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);
