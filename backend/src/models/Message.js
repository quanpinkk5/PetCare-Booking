const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messageType: { type: String, enum: ["TEXT", "IMAGE"] },
    content: String,
    imageUrl: String,
    isRead: Boolean,
    readAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "messages",
    versionKey: false,
  },
);

module.exports = mongoose.model("Message", messageSchema);
