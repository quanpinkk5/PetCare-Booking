const mongoose = require("mongoose");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Business = require("../models/Business");

const registerMessageReadSocket = (io, socket) => {
  socket.on("message:read", async (data, callback) => {
    try {
      const user = socket.user;
      const conversationId = data?.conversationId;

      // Kiểm tra mã cuộc trò chuyện
      if (!mongoose.isValidObjectId(conversationId)) {
        return callback?.({
          success: false,
          message: "Mã cuộc trò chuyện không hợp lệ",
        });
      }

      // Kiểm tra cuộc trò chuyện có tồn tại
      const conversation = await Conversation.findById(conversationId).lean();

      if (!conversation) {
        return callback?.({
          success: false,
          message: "Không tìm thấy cuộc trò chuyện",
        });
      }

      // Kiểm tra quyền truy cập cuộc trò chuyện
      let hasPermission = false;

      if (user.role === "CUSTOMER") {
        hasPermission =
          conversation.customerId?.toString() === user._id.toString();
      }

      if (user.role === "BUSINESS_OWNER") {
        const business = await Business.findOne({
          _id: conversation.businessId,
          ownerId: user._id,
        }).select("_id");

        hasPermission = Boolean(business);
      }

      if (!hasPermission) {
        return callback?.({
          success: false,
          message: "Bạn không có quyền truy cập cuộc trò chuyện này",
        });
      }

      // Kiểm tra người dùng đã tham gia phòng chat
      const roomName = `conversation:${conversation._id.toString()}`;

      if (!socket.rooms.has(roomName)) {
        return callback?.({
          success: false,
          message: "Vui lòng tham gia cuộc trò chuyện trước",
        });
      }

      // Lấy thời điểm đánh dấu đã đọc
      const readAt = new Date();

      // Chỉ cập nhật tin nhắn do người khác gửi
      const result = await Message.updateMany(
        {
          conversationId: conversation._id,
          senderId: { $ne: user._id },
          isRead: { $ne: true },
        },
        {
          $set: {
            isRead: true,
            readAt,
          },
        },
      );

      // Thông báo realtime nếu có tin nhắn được cập nhật
      if (result.modifiedCount > 0) {
        io.to(roomName).emit("message:read:update", {
          conversationId: conversation._id.toString(),
          readBy: user._id.toString(),
          readAt,
          updatedCount: result.modifiedCount,
        });
      }

      return callback?.({
        success: true,
        message: "Đánh dấu tin nhắn đã đọc thành công",
        updatedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc realtime:", error);

      return callback?.({
        success: false,
        message: "Không thể đánh dấu tin nhắn đã đọc",
      });
    }
  });
};

module.exports = registerMessageReadSocket;
