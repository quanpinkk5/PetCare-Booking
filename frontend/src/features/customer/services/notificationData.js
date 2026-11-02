const categories = ['booking', 'payment', 'pet_care', 'promotion', 'review', 'system'];

export function notificationTimeAgo(value, now = Date.now()) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '—';
  const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));
  if (seconds < 60) return 'Vừa xong';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
  return date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

export function notificationData(item) {
  const referenceType = String(item.referenceType || '').toUpperCase();
  const referenceId = String(item.referenceId?._id || item.referenceId || '');
  const rawType = String(item.type || '').toLowerCase();
  const type = categories.find((category) => rawType === category || rawType.startsWith(`${category}_`))
    || ({ BOOKING: 'booking', PAYMENT: 'payment', PET: 'pet_care', REVIEW: 'review' }[referenceType]) || 'system';
  const actions = {
    BOOKING: [`/my-bookings/${encodeURIComponent(referenceId)}`, 'Xem lịch đặt'],
    PAYMENT: [`/billing?txn=${encodeURIComponent(referenceId)}`, 'Xem giao dịch'],
    CONVERSATION: [`/messages/${encodeURIComponent(referenceId)}`, 'Xem tin nhắn'],
    PET: ['/my-pets', 'Xem thú cưng'],
    REVIEW: ['/reviews', 'Xem đánh giá'],
  };
  const action = referenceId ? actions[referenceType] : null;
  return {
    id: String(item._id), type, title: item.title || 'Thông báo', message: item.message || '',
    createdAt: item.createdAt, timeAgo: notificationTimeAgo(item.createdAt),
    isRead: item.isRead === true, priority: 'normal',
    actionUrl: action?.[0] || '', actionLabel: action?.[1] || '',
    metadata: referenceId && referenceType === 'BOOKING' ? { bookingId: referenceId }
      : referenceId && referenceType === 'PAYMENT' ? { transactionId: referenceId } : undefined,
  };
}
