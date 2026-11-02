const notifyMessage = (req, conversation, business, message) => {
  const io = req.app?.get("io");
  if (!io) return;
  io.to(`conversation:${conversation._id}`).emit("message:new", message);
  const update = { _id: conversation._id, lastMessage: message.content, lastMessageAt: message.createdAt };
  io.to(`user:${conversation.customerId}`).emit("conversation:updated", update);
  if (business.ownerId) io.to(`user:${business.ownerId}`).emit("conversation:updated", update);
};
const notifyRead = (req, conversation, readAt, updatedCount) => {
  const io = req.app?.get("io");
  if (!io) return;
  io.to(`conversation:${conversation._id}`).emit("message:read:update", {
    conversationId: String(conversation._id), readBy: String(req.user._id || req.user.id), readAt, updatedCount,
  });
};
module.exports = { notifyMessage, notifyRead };
