const Notification = require('../models/Notification');
const Settings = require('../models/BusinessNotificationSettings');

const publish = (io, notification) => {
  if (io && notification) io.to(`user:${notification.userId}`).emit('notification:new', notification);
};

// Pass the booking transaction through both reads and writes. Socket delivery
// must happen only after that transaction has committed.
const create = async ({ ownerId, preference, session, ...data }) => {
  if (!ownerId) return null;
  let query = Settings.findOne({ userId: ownerId }).select(preference);
  if (session) query = query.session(session);
  const settings = await query.lean();
  if (settings?.[preference] === false) return null;
  const [notification] = await Notification.create([{ ...data, userId: ownerId, isRead: false, readAt: null }], session ? { session } : {});
  return notification;
};

const customerMessage = async ({ io, business, conversation, message, senderId }) => {
  if (!business?.ownerId || String(senderId) !== String(conversation.customerId)) return;
  try {
    const notification = await create({ ownerId: business.ownerId, preference: 'notifyCustomerMessage',
      type: 'MESSAGE_RECEIVED', title: 'Bạn có tin nhắn mới từ khách hàng',
      message: String(message.content || '').slice(0, 300),
      referenceType: 'CONVERSATION', referenceId: conversation._id,
      metadata: { messageId: String(message._id) },
    });
    publish(io, notification);
  } catch (error) {
    // A notification failure must not report the already-saved message as
    // failed, otherwise the sender may resend it and create duplicates.
    console.error('Không thể tạo thông báo tin nhắn cho BusinessOwner:', error);
  }
};

module.exports = { create, publish, customerMessage };
