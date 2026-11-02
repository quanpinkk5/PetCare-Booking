const mongoose = require("mongoose");
const Business = require("../../models/Business");
const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const { notifyMessage, notifyRead } = require("../../utils/messageEvents");

const ownerBusiness = (req) => Business.findOne({ ownerId: req.user._id || req.user.id }).select("_id ownerId").lean();
const ownedConversation = async (req, res) => {
  const id = req.params.conversationId || req.body?.conversationId;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Mã cuộc trò chuyện không hợp lệ" });
    return null;
  }
  const business = await ownerBusiness(req);
  const conversation = business && await Conversation.findOne({ _id: id, businessId: business._id }).lean();
  if (!conversation) {
    res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện của bạn" });
    return null;
  }
  return { business, conversation };
};

const getConversations = async (req, res, next) => {
  try {
    const business = await ownerBusiness(req);
    if (!business) return res.json({ success: true, data: [] });
    const conversations = await Conversation.find({ businessId: business._id })
      .populate("customerId", "fullName phone avatar")
      .populate({ path: "bookingId", select: "bookingCode bookingDate startTime checkInDate branchServiceId",
        populate: { path: "branchServiceId", select: "serviceId", populate: { path: "serviceId", select: "name" } } })
      .sort({ lastMessageAt: -1, createdAt: -1, _id: -1 }).lean();
    const counts = conversations.length ? await Message.aggregate([
      { $match: { conversationId: { $in: conversations.map((c) => c._id) },
        senderId: { $ne: new mongoose.Types.ObjectId(req.user._id || req.user.id) }, isRead: { $ne: true } } },
      { $group: { _id: "$conversationId", count: { $sum: 1 } } },
    ]) : [];
    const unread = new Map(counts.map((c) => [String(c._id), c.count]));
    return res.json({ success: true, data: conversations.map((c) => ({ ...c, unreadCount: unread.get(String(c._id)) || 0 })) });
  } catch (error) { next(error); }
};

const getMessages = async (req, res, next) => {
  try {
    const owned = await ownedConversation(req, res);
    if (!owned) return;
    const messages = await Message.find({ conversationId: owned.conversation._id })
      .populate("senderId", "fullName avatar").sort({ createdAt: 1, _id: 1 }).lean();
    return res.json({ success: true, data: messages });
  } catch (error) { next(error); }
};

const sendMessage = async (req, res, next) => {
  try {
    if (typeof req.body?.content !== "string" || !req.body.content.trim() || req.body.content.length > 10000) {
      return res.status(400).json({ success: false, message: "Nội dung tin nhắn phải có từ 1 đến 10.000 ký tự" });
    }
    const owned = await ownedConversation(req, res);
    if (!owned) return;
    const { business, conversation } = owned;
    const message = await Message.create({ conversationId: conversation._id, senderId: req.user._id || req.user.id,
      messageType: "TEXT", content: req.body.content.trim(), isRead: false, readAt: null });
    await Conversation.updateOne({ _id: conversation._id, businessId: business._id },
      { $set: { lastMessage: message.content, lastMessageAt: message.createdAt } });
    notifyMessage(req, conversation, business, message);
    return res.status(201).json({ success: true, data: { conversationId: conversation._id, message } });
  } catch (error) { next(error); }
};

const markRead = async (req, res, next) => {
  try {
    const owned = await ownedConversation(req, res);
    if (!owned) return;
    const readAt = new Date();
    const result = await Message.updateMany({ conversationId: owned.conversation._id,
      senderId: { $ne: req.user._id || req.user.id }, isRead: { $ne: true } }, { $set: { isRead: true, readAt } });
    if (result.modifiedCount) notifyRead(req, owned.conversation, readAt, result.modifiedCount);
    return res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (error) { next(error); }
};

const setImportant = async (req, res, next) => {
  try {
    if (typeof req.body?.important !== "boolean") return res.status(400).json({ success: false, message: "Trạng thái quan trọng không hợp lệ" });
    const owned = await ownedConversation(req, res);
    if (!owned) return;
    await Conversation.updateOne({ _id: owned.conversation._id, businessId: owned.business._id },
      { $set: { ownerImportant: req.body.important } });
    return res.json({ success: true, important: req.body.important });
  } catch (error) { next(error); }
};

module.exports = { getConversations, getMessages, sendMessage, markRead, setImportant };
