import { canPayBooking } from './bookingPayment.js';
const STATUS = {
  PAID: ['completed', 'Thành công'],
  PENDING: ['pending', 'Chờ thanh toán'],
  PROCESSING: ['pending', 'Đang xử lý'],
  FAILED: ['failed', 'Thất bại'],
  EXPIRED: ['failed', 'Hết hạn'],
  REFUNDED: ['refunded', 'Đã hoàn tiền'],
};
const METHODS = {
  VNPAY: 'VNPAY', MOMO: 'Ví MoMo', CASH: 'Tiền mặt tại cơ sở',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
};

function addressText(address) {
  if (typeof address === 'string') return address || '—';
  if (!address) return '—';
  return address.fullAddress || address.formattedAddress ||
    [address.detail || address.street, address.ward, address.district, address.city || address.province].filter(Boolean).join(', ') || '—';
}

function dateText(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return '—';
  const parts = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(value));
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('day')}/${part('month')}/${part('year')} ${part('hour')}:${part('minute')}`;
}

export function mapPaymentTransaction(payment) {
  const booking = payment.bookingId && typeof payment.bookingId === 'object' ? payment.bookingId : {};
  const offering = booking.branchServiceId || {};
  const service = offering.serviceId || {};
  const branch = offering.branchId || {};
  const pet = booking.petId || {};
  const customer = payment.customerId || {};
  const [status, statusLabel] = STATUS[payment.status] || ['pending', 'Chờ xác minh'];
  return {
    id: payment.paymentCode || payment._id,
    paymentId: payment._id,
    invoiceNo: payment.paymentCode || payment._id,
    bookingId: booking.bookingCode || booking._id || '',
    bookingObjectId: booking._id || (typeof payment.bookingId === 'string' ? payment.bookingId : ''),
    bookingStatus: booking.status,
    paymentStatus: booking.paymentStatus,
    rawDate: payment.createdAt,
    createdAt: dateText(payment.createdAt),
    paidAt: payment.paidAt ? dateText(payment.paidAt) : null,
    serviceName: service.name || 'Dịch vụ không còn khả dụng',
    serviceDesc: service.description || '',
    facilityName: branch.name || '—', facilityAddress: addressText(branch.address), facilityPhone: branch.phone || '—',
    petName: pet.name || '—', petBreed: pet.breed || '—', petGender: { MALE: 'Đực', FEMALE: 'Cái' }[pet.gender] || '',
    customerName: customer.fullName || '—', customerPhone: customer.phone || '—',
    customerEmail: customer.email || '—', customerAddress: addressText(customer.address),
    method: (payment.method || '').toLowerCase(), methodLabel: METHODS[payment.method] || payment.method || '—',
    gatewayRef: payment.transactionId || '', status, statusLabel,
    basePrice: payment.amount, totalAmount: payment.amount,
    platformFee: 0, discount: 0, discountCode: '',
    refundedAmount: payment.status === 'REFUNDED' ? payment.amount : 0,
    canViewInvoice: booking.paymentStatus === 'PAID' && payment.status === 'PAID',
    canPay: canPayBooking(booking.status, booking.paymentStatus),
  };
}

export function matchesPaymentTimeRange(value, range, now = new Date()) {
  if (range === 'all') return true;
  if (!value || Number.isNaN(new Date(value).getTime())) return false;
  const monthKey = (date) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric',
    }).formatToParts(date);
    return Number(parts.find((p) => p.type === 'year').value) * 12 + Number(parts.find((p) => p.type === 'month').value);
  };
  const current = monthKey(now);
  const month = monthKey(new Date(value));
  if (range === 'this_month') return month === current;
  if (range === 'last_month') return month === current - 1;
  return month < current - 1;
}
