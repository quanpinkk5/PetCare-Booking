import { notificationTimeAgo } from '../../customer/services/notificationData.js';
const categories = ['booking', 'boarding', 'payment', 'review', 'message', 'system'];
const routes = {
  BOOKING: ['/business/bookings', 'Xem lịch hẹn'], PAYMENT: ['/business/payments', 'Xem thanh toán'],
  REVIEW: ['/business/reviews', 'Xem đánh giá'], CONVERSATION: ['/business/messages', 'Xem tin nhắn'],
  MESSAGE: ['/business/messages', 'Xem tin nhắn'], BUSINESS: ['/business/profile', 'Xem hồ sơ cơ sở'],
};
export function ownerNotificationData(item) {
  const referenceType = String(item.referenceType || '').toUpperCase();
  const referenceId = String(item.referenceId?._id || item.referenceId || '');
  const rawType = String(item.type || '').toLowerCase();
  const type = categories.find((category) => rawType === category || rawType.startsWith(`${category}_`))
    || ({ BOOKING: 'booking', PAYMENT: 'payment', REVIEW: 'review', CONVERSATION: 'message', MESSAGE: 'message' }[referenceType]) || 'system';
  const action = referenceId ? routes[referenceType] : null;
  const metadata = Object.fromEntries(Object.entries(item.metadata || {}).filter(([, value]) => typeof value === 'string' || typeof value === 'number'));
  if (referenceId) metadata.referenceId = referenceId;
  return { id: String(item._id), type, title: item.title || 'Thông báo', message: item.message || '',
    detail: item.detail || '', branch: item.branch || '', createdAt: item.createdAt, timeAgo: notificationTimeAgo(item.createdAt),
    isRead: item.isRead === true, priority: ['low', 'normal', 'high'].includes(item.priority) ? item.priority : 'normal',
    actionUrl: action?.[0] || '', actionLabel: action?.[1] || '', metadata: Object.keys(metadata).length ? metadata : undefined };
}
export function filterOwnerNotifications(notifications, { category = 'all', read = 'all', priority = 'all', branch = 'Tất cả chi nhánh', search = '' } = {}) {
  const keyword = search.trim().toLowerCase();
  return notifications.filter((n) => (category === 'all' || n.type === category)
    && (read === 'all' || (read === 'read' ? n.isRead : !n.isRead))
    && (priority === 'all' || n.priority === priority)
    && (branch === 'Tất cả chi nhánh' || n.branch === branch)
    && [n.title, n.message, n.detail, n.branch, ...Object.values(n.metadata || {})].some((value) => String(value).toLowerCase().includes(keyword)));
}
