const mongoose = require("mongoose");

const Conversation = require("../models/Conversation");
const Business = require("../models/Business");

const registerConversationSocket = (io, socket) => {
  // Lấy thông tin người dùng đã xác thực
  const user = socket.user;

  // Kiểm tra quyền truy cập cuộc trò chuyện
  const canAccessConversation = async (conversation) => {
    // Customer chỉ được truy cập cuộc trò chuyện của mình
    if (user.role === "CUSTOMER") {
      return conversation.customerId?.toString() === user._id.toString();
    }

    // Chủ cơ sở chỉ được truy cập cuộc trò chuyện
    // thuộc cơ sở kinh doanh do mình sở hữu
    if (user.role === "BUSINESS_OWNER") {
      const business = await Business.findOne({
        _id: conversation.businessId,
        ownerId: user._id,
      }).select("_id");

      return Boolean(business);
    }

    return false;
  };

  // Tham gia phòng chat
  socket.on("conversation:join", async (data, callback) => {
    try {
      const conversationId = data?.conversationId;

      if (!mongoose.isValidObjectId(conversationId)) {
        return callback?.({
          success: false,
          message: "Mã cuộc trò chuyện không hợp lệ",
        });
      }

      // Tìm cuộc trò chuyện
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return callback?.({
          success: false,
          message: "Không tìm thấy cuộc trò chuyện",
        });
      }

      // Kiểm tra người dùng có quyền tham gia không
      const hasPermission = await canAccessConversation(conversation);

      if (!hasPermission) {
        return callback?.({
          success: false,
          message: "Bạn không có quyền truy cập cuộc trò chuyện này",
        });
      }

      // Cho phép tham gia phòng chat
      const roomName = `conversation:${conversation._id.toString()}`;

      await socket.join(roomName);

      return callback?.({
        success: true,
        message: "Tham gia cuộc trò chuyện thành công",
        conversationId,
      });
    } catch (error) {
      console.error("Lỗi tham gia cuộc trò chuyện:", error);

      return callback?.({
        success: false,
        message: "Không thể tham gia cuộc trò chuyện",
      });
    }
  });

  // Rời phòng chat
  socket.on("conversation:leave", async (data, callback) => {
    try {
      const conversationId = data?.conversationId;

      if (!mongoose.isValidObjectId(conversationId)) {
        return callback?.({
          success: false,
          message: "Mã cuộc trò chuyện không hợp lệ",
        });
      }

      const roomName = `conversation:${conversation._id.toString()}`;

      // Chỉ xử lý phòng mà Socket đang tham gia
      if (!socket.rooms.has(roomName)) {
        return callback?.({
          success: false,
          message: "Bạn chưa tham gia cuộc trò chuyện này",
        });
      }

      await socket.leave(roomName);

      return callback?.({
        success: true,
        message: "Rời cuộc trò chuyện thành công",
        conversationId,
      });
    } catch (error) {
      console.error("Lỗi rời cuộc trò chuyện:", error);

      return callback?.({
        success: false,
        message: "Không thể rời cuộc trò chuyện",
      });
    }
  });
};

module.exports = registerConversationSocket;
