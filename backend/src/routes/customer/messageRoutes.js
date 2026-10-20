const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

const messageController = require("../../controllers/customer/messageController");

// Khách hàng gửi tin nhắn
router.post(
  "/messages",
  authenticate,
  authorize("CUSTOMER"),
  messageController.sendMessage,
);
// Lấy tất cả cuộc trò chuyện của khách hàng
router.get(
  "/conversations",
  authenticate,
  authorize("CUSTOMER"),
  messageController.getMyConversations,
);
// Lấy tất cả tin nhắn trong cuộc trò chuyện
router.get(
  "/conversations/:conversationId/messages",
  authenticate,
  authorize("CUSTOMER"),
  messageController.getConversationMessages
);
// Khách hàng đánh dấu tin nhắn đã đọc
router.patch(
  "/conversations/:conversationId/read",
  authenticate,
  authorize("CUSTOMER"),
  messageController.markMessagesAsRead
);
module.exports = router;
