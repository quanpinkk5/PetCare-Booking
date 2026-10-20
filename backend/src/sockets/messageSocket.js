const mongoose = require("mongoose");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Business = require("../models/Business");

const registerMessageSocket = (io, socket) => {
  socket.on("message:send", async (data, callback) => {
    try {
      const user = socket.user;
      const conversationId = data?.conversationId;
      const content = data?.content;

      // Kiểm tra ID cuộc trò chuyện
      if (!mongoose.isValidObjectId(conversationId)) {
        return callback?.({
          success: false,
          message: "Mã cuộc trò chuyện không hợp lệ",
        });
      }

      // Kiểm tra nội dung tin nhắn
      if (typeof content !== "string" || !content.trim()) {
        return callback?.({
          success: false,
          message: "Nội dung tin nhắn không được để trống",
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

      // Kiểm tra quyền gửi tin nhắn
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
          message: "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này",
        });
      }

      // Chỉ cho phép gửi khi đã tham gia phòng
      const roomName = `conversation:${conversation._id.toString()}`;

      if (!socket.rooms.has(roomName)) {
        return callback?.({
          success: false,
          message: "Vui lòng tham gia cuộc trò chuyện trước khi gửi tin nhắn",
        });
      }

      // Lưu tin nhắn vào MongoDB
      const message = await Message.create({
        conversationId: conversation._id,
        senderId: user._id,
        messageType: "TEXT",
        content: content.trim(),
        isRead: false,
        readAt: null,
      });

      // Cập nhật tin nhắn cuối cùng
      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $set: {
            lastMessage: message.content,
            lastMessageAt: message.createdAt,
          },
        },
      );

      // Lấy thông tin người gửi
      await message.populate("senderId", "fullName avatar role");

      const messageData = message.toObject();

      // Phát tin nhắn mới đến tất cả kết nối trong phòng
      io.to(roomName).emit("message:new", messageData);

      // Lấy thông tin cuộc trò chuyện mới nhất
      const updatedConversation = await Conversation.findById(conversation._id)
        .populate("businessId", "name logo phone")
        .populate("bookingId", "bookingCode status bookingType")
        .lean();

      // Tạo dữ liệu cập nhật danh sách cuộc trò chuyện
      const conversationData = {
        ...updatedConversation,
        lastMessage: message.content,
        lastMessageAt: message.createdAt,
      };

      // Thông báo đến Customer trên mọi thiết bị
      io.to(`user:${conversation.customerId.toString()}`).emit(
        "conversation:updated",
        conversationData,
      );

      // Tìm chủ sở hữu cơ sở kinh doanh
      const business = await Business.findById(conversation.businessId).select(
        "ownerId",
      );

      if (business?.ownerId) {
        // Thông báo đến chủ cơ sở trên mọi thiết bị
        io.to(`user:${business.ownerId.toString()}`).emit(
          "conversation:updated",
          conversationData,
        );
      }

      // Phản hồi cho người gửi
      return callback?.({
        success: true,
        message: "Gửi tin nhắn thành công",
        data: messageData,
      });
    } catch (error) {
      console.error("Lỗi gửi tin nhắn realtime:", error);

      return callback?.({
        success: false,
        message: "Không thể gửi tin nhắn",
      });
    }
  });
};

module.exports = registerMessageSocket;
