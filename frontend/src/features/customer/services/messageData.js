import { bookingDetailData } from './bookingData.js';

export const recordId = (value) => String(value?._id || value || '');
const timeLabel = (value) => {
  const date = new Date(value);
  return !value || Number.isNaN(date.getTime()) ? '' : date.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
};

export const conversationData = (conversation) => {
  const business = conversation.businessId || {};
  const name = business.name || 'Cơ sở không còn tồn tại';
  return {
    id: recordId(conversation), businessId: recordId(business),
    bookingId: recordId(conversation.bookingId), name, phone: business.phone || '',
    avatarText: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    colorClasses: 'border-emerald-300 bg-emerald-100 text-[#009879]',
    lastMessage: conversation.lastMessage || '', time: timeLabel(conversation.lastMessageAt),
    unread: conversation.unreadCount || 0, updatedAt: conversation.lastMessageAt || conversation.createdAt,
  };
};

export const messageData = (message, customerId, avatar) => ({
  id: recordId(message), sender: recordId(message.senderId) === recordId(customerId) ? 'user' : 'business',
  text: message.content || '', time: timeLabel(message.createdAt),
  createdAt: message.createdAt, isRead: Boolean(message.isRead), avatar,
});

export const mergeMessages = (current, incoming) => {
  const messages = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) {
    const existing = messages.get(message.id);
    messages.set(message.id, { ...existing, ...message, isRead: Boolean(existing?.isRead || message.isRead) });
  }
  return [...messages.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt) || a.id.localeCompare(b.id));
};

export const conversationBookingData = (booking) => {
  const detail = bookingDetailData(booking);
  return {
    bookingInfo: { id: detail.id, recordId: detail.recordId, service: detail.service.name,
      branch: detail.location, dateTime: `${detail.date} • ${detail.time}`, status: detail.status },
    petInfo: { ...detail.pet, image: detail.pet.img, note: detail.pet.personality },
  };
};
