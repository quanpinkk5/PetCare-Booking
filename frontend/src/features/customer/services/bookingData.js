import { formatAddress } from './businessData.js';

const statuses = {
  PENDING: ['pending', 'Chờ xác nhận', 'amber', 2],
  CONFIRMED: ['confirmed', 'Đã xác nhận', 'emerald', 3],
  IN_PROGRESS: ['in-progress', 'Đang thực hiện', 'blue', 4],
  COMPLETED: ['completed', 'Hoàn thành', 'teal', 5],
  CANCELLED: ['cancelled', 'Đã hủy', 'slate', 1],
};
const badges = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200', emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200', teal: 'bg-teal-50 text-teal-700 border-teal-200', slate: 'bg-slate-100 text-slate-600 border-slate-200',
};
const dateLabel = (value) => {
  if (!value) return 'Chưa có ngày';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Chưa có ngày' : date.toLocaleDateString('vi-VN', { timeZone: 'UTC' });
};
const money = (value) => typeof value === 'number' && Number.isFinite(value) ? `${value.toLocaleString('vi-VN')}đ` : 'Chưa có giá';

export const apiBookingStatus = (value) => value === 'all' ? undefined : value.toUpperCase().replaceAll('-', '_');

export const bookingCardData = (booking) => {
  const pet = booking.petId || {};
  const offering = booking.branchServiceId || {};
  const service = offering.serviceId || {};
  const branch = offering.branchId || {};
  const [statusType, status, color, statusStep] = statuses[booking.status] || ['other', 'Chưa xác định', 'slate', 1];
  return {
    recordId: booking._id, id: booking.bookingCode || booking._id,
    petName: pet.name || 'Thú cưng không còn tồn tại', breed: pet.breed || 'Chưa cập nhật giống',
    gender: pet.gender === 'MALE' ? '♂' : pet.gender === 'FEMALE' ? '♀' : '',
    genderColor: pet.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500',
    img: pet.avatar || '', service: service.name || 'Dịch vụ không còn tồn tại', serviceDesc: service.description || '',
    location: branch.name || 'Chi nhánh không còn tồn tại',
    date: booking.bookingType === 'BOARDING' ? `${dateLabel(booking.checkInDate)} – ${dateLabel(booking.checkOutDate)}` : dateLabel(booking.bookingDate),
    time: booking.bookingType === 'BOARDING' ? `${booking.numberOfDays || 0} ngày lưu trú` : `${booking.startTime || '—'} - ${booking.endTime || '—'}`,
    price: money(booking.totalPrice), statusType, status, statusStep, statusBadge: badges[color],
    borderColor: 'hover:border-teal-300', paymentStatus: booking.paymentStatus,
    bookingType: booking.bookingType, petId: pet._id, branchServiceId: offering._id,
  };
};

export const bookingDetailData = (booking) => {
  const card = bookingCardData(booking);
  const pet = booking.petId || {};
  const offering = booking.branchServiceId || {};
  const branch = offering.branchId || {};
  return {
    ...card, totalPrice: card.price,
    pet: { name: card.petName, gender: card.gender, breed: card.breed, img: card.img,
      weight: pet.weight != null ? `${pet.weight}kg` : 'Chưa cập nhật', personality: pet.personality || 'Chưa cập nhật' },
    service: { name: card.service, desc: card.serviceDesc, duration: offering.durationMinutes > 0 ? `${offering.durationMinutes} phút` : 'Theo ngày' },
    facility: { name: card.location, address: formatAddress(branch.address) || 'Chưa cập nhật', phone: branch.phone || 'Chưa cập nhật' },
    note: booking.customerNote || 'Không có ghi chú.', hasCareJournal: false,
  };
};
