const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    lastMessage: String,
    lastMessageAt: Date,
  },
  { timestamps: true, collection: "conversations", versionKey: false },
);

module.exports = mongoose.model("Conversation", conversationSchema);
