const mongoose = require("mongoose");

const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const Business = require("../../models/Business");

// ============================================
// KHÁCH HÀNG GỬI TIN NHẮN VĂN BẢN
// POST /api/customer/messages
// ============================================

const sendMessage = async (req, res, next) => {
  try {
    // Lấy ID khách hàng từ token
    const customerId = req.user._id || req.user.id;

    // Lấy dữ liệu gửi lên
    const { businessId, content } = req.body;

    // Kiểm tra ID cơ sở kinh doanh
    if (!mongoose.isValidObjectId(businessId)) {
      return res.status(400).json({
        success: false,
        message: "Mã cơ sở kinh doanh không hợp lệ",
      });
    }

    // Kiểm tra nội dung tin nhắn
    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nội dung tin nhắn không được để trống",
      });
    }

    // Kiểm tra cơ sở kinh doanh tồn tại
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cơ sở kinh doanh",
      });
    }

    // Chỉ cho phép nhắn tin với cơ sở đã được duyệt
    if (business.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Cơ sở kinh doanh hiện không thể nhận tin nhắn",
      });
    }

    // Tìm cuộc trò chuyện hiện có
    let conversation = await Conversation.findOne({
      customerId,
      businessId,
      bookingId: null,
    });

    // Nếu chưa có thì tạo cuộc trò chuyện mới
    if (!conversation) {
      conversation = await Conversation.create({
        customerId,
        businessId,
        lastMessage: "",
        lastMessageAt: null,
      });
    }

    // Lưu tin nhắn
    const message = await Message.create({
      conversationId: conversation._id,
      senderId: customerId,
      messageType: "TEXT",
      content: content.trim(),
      isRead: false,
      readAt: null,
    });

    // Cập nhật tin nhắn cuối cùng
    conversation.lastMessage = message.content;
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    return res.status(201).json({
      success: true,
      message: "Gửi tin nhắn thành công",
      data: {
        conversationId: conversation._id,
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyConversations = async (req, res, next) => {
  try {
    // Lấy ID khách hàng từ token
    const customerId = req.user._id || req.user.id;

    // Lấy các cuộc trò chuyện của khách hàng
    const conversations = await Conversation.find({
      customerId,
    })
      .populate("businessId", "name logo phone")
      .populate("bookingId", "bookingCode status bookingType")
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách cuộc trò chuyện thành công",
      total: conversations.length,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationMessages = async (req, res, next) => {
  try {
    // Lấy ID khách hàng từ token
    const customerId = req.user._id || req.user.id;

    // Lấy ID cuộc trò chuyện từ đường dẫn
    const { conversationId } = req.params;

    // Kiểm tra ID cuộc trò chuyện
    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Mã cuộc trò chuyện không hợp lệ",
      });
    }

    // Kiểm tra cuộc trò chuyện thuộc khách hàng
    const conversation = await Conversation.findOne({
      _id: conversationId,
      customerId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cuộc trò chuyện của bạn",
      });
    }

    // Lấy toàn bộ tin nhắn trong cuộc trò chuyện
    const messages = await Message.find({
      conversationId,
    })
      .populate("senderId", "fullName avatar")
      .sort({ createdAt: 1, _id: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lấy lịch sử tin nhắn thành công",
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const markMessagesAsRead = async (req, res, next) => {
  try {
    // Lấy ID khách hàng từ token
    const customerId = req.user._id || req.user.id;

    // Lấy ID cuộc trò chuyện
    const { conversationId } = req.params;

    // Kiểm tra ID cuộc trò chuyện
    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Mã cuộc trò chuyện không hợp lệ",
      });
    }

    // Kiểm tra cuộc trò chuyện thuộc khách hàng
    const conversation = await Conversation.findOne({
      _id: conversationId,
      customerId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cuộc trò chuyện của bạn",
      });
    }

    // Đánh dấu các tin nhắn nhận được là đã đọc
    const result = await Message.updateMany(
      {
        conversationId: conversation._id,
        senderId: { $ne: customerId },
        isRead: { $ne: true },
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Đánh dấu tin nhắn đã đọc thành công",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMyConversations,
    getConversationMessages,
    markMessagesAsRead,
};
