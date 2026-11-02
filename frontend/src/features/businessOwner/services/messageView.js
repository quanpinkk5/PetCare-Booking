export const recordId = (value) => String(value?._id || value || '');
const timeText = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleString('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
}) : '';
export const avatarFallback = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d1fae5"/><circle cx="40" cy="28" r="14" fill="#059669"/><path d="M12 80v-8a28 28 0 0156 0v8" fill="#059669"/></svg>')}`;
export function ownerConversationData(conversation) {
  const customer = conversation.customerId || {};
  const booking = typeof conversation.bookingId === 'object' ? conversation.bookingId : null;
  const name = customer.fullName || 'Khách hàng không còn khả dụng';
  const service = booking?.branchServiceId?.serviceId?.name || 'Dịch vụ không còn khả dụng';
  return {
    id: recordId(conversation), name, img: customer.avatar || avatarFallback, lastMsg: conversation.lastMessage || '',
    time: timeText(conversation.lastMessageAt), updatedAt: conversation.lastMessageAt || conversation.createdAt,
    unread: conversation.unreadCount || 0, important: Boolean(conversation.ownerImportant),
    tags: [booking?.bookingCode, conversation.ownerImportant ? 'Quan trọng' : ''].filter(Boolean),
    customer: { name, avatar: customer.avatar || avatarFallback, phone: customer.phone || '', type: customer.phone || 'Khách hàng',
      booking: booking ? { id: booking.bookingCode || '—', service,
        date: (booking.bookingDate || booking.checkInDate) ? new Date(booking.bookingDate || booking.checkInDate).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '',
        time: booking.startTime || '' } : null },
  };
}
export function ownerMessageData(message, ownerId) {
  return { id: recordId(message), sender: recordId(message.senderId) === recordId(ownerId) ? 'shop' : 'customer',
    text: message.content || '', images: message.messageType === 'IMAGE' && message.imageUrl ? [message.imageUrl] : undefined,
    time: timeText(message.createdAt), createdAt: message.createdAt, isRead: Boolean(message.isRead) };
}
export function mergeOwnerMessages(current, incoming) {
  const byId = new Map(current.map((m) => [m.id, m]));
  incoming.forEach((m) => byId.set(m.id, { ...m, isRead: Boolean(m.isRead || byId.get(m.id)?.isRead) }));
  return [...byId.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt) || a.id.localeCompare(b.id));
}
export function filterOwnerChats(chats, keyword, filter) {
  return chats.filter((chat) => `${chat.name} ${chat.customer.phone} ${chat.lastMsg} ${chat.tags.join(' ')}`.toLowerCase().includes(keyword.trim().toLowerCase())
    && (filter === 'all' || (filter === 'unread' && chat.unread > 0) || (filter === 'important' && chat.important)));
}
