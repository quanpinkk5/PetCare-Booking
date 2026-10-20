import { formatAddress } from './businessData.js';

const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f1f5f9'/%3E%3C/svg%3E";
const dateText = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString('vi-VN', { timeZone: 'UTC' }) : '';
const snapshot = (booking = {}, business = {}, branch = {}, service = {}) => ({
  bookingRecordId: booking._id, bookingId: booking.bookingCode || booking._id || 'Không còn lịch đặt',
  businessId: business._id, businessName: business.name || branch.name || 'Cơ sở không còn tồn tại',
  businessAddress: formatAddress(branch.address), businessAvatar: business.logo || placeholder,
  petName: booking.petId?.name || 'Thú cưng không còn tồn tại', petBreed: booking.petId?.breed || 'Chưa cập nhật giống',
  petGender: booking.petId?.gender === 'MALE' ? '♂' : booking.petId?.gender === 'FEMALE' ? '♀' : '',
  petImg: booking.petId?.avatar || placeholder, serviceName: service.name || 'Dịch vụ không còn tồn tại',
  serviceDesc: service.description || '', serviceDate: dateText(booking.bookingDate || booking.checkInDate),
  completedDate: dateText(booking.updatedAt),
  servicePrice: typeof booking.totalPrice === 'number' ? `${booking.totalPrice.toLocaleString('vi-VN')}đ` : 'Chưa có giá',
});

export const reviewData = (review) => ({
  ...snapshot(review.bookingId || {}, review.businessId || {}, review.branchId || {}, review.serviceId || {}),
  id: review._id, rating: review.rating, ratingLabel: review.rating === 5 ? 'Tuyệt vời' : review.rating === 4 ? 'Rất tốt' : review.rating === 3 ? 'Bình thường' : 'Chưa hài lòng',
  subRatings: review.subRatings, tags: review.tags || [], comment: review.comment || '', images: review.images || [],
  isAnonymous: review.isAnonymous || false, likesCount: review.likesCount || 0, isLiked: review.isLiked || false,
  createdAt: dateText(review.createdAt), updatedAt: review.updatedAt !== review.createdAt ? dateText(review.updatedAt) : null,
  businessReply: review.businessReply?.content ? { content: review.businessReply.content, repliedAt: dateText(review.businessReply.repliedAt), staffName: 'Cơ sở' } : null,
});
export const pendingReviewData = (booking) => {
  const offering = booking.branchServiceId || {};
  const branch = offering.branchId || {};
  return { id: booking._id, ...snapshot(booking, branch.businessId || {}, branch, offering.serviceId || {}) };
};
export const reviewPayload = (item, creating) => ({
  ...(creating ? { bookingId: item.bookingRecordId } : {}), rating: item.rating,
  comment: item.comment, images: item.images || [], subRatings: item.subRatings || {},
  tags: item.tags || [], isAnonymous: Boolean(item.isAnonymous),
});
