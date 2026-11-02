import { apiRequest } from '../../auth/services/authApi.js';

export const paymentApi = {
  history: (options = {}) => apiRequest('/customer/payments', options),
  create: (bookingId) => apiRequest('/customer/payments/vnpay/create', {
    method: 'POST', body: JSON.stringify({ bookingId }),
  }),
  retry: (bookingId) => apiRequest('/customer/payments/vnpay/retry', {
    method: 'POST', body: JSON.stringify({ bookingId }),
  }),
  status: (bookingId, options = {}) => apiRequest(
    `/customer/payments/${encodeURIComponent(bookingId)}/status`, options,
  ),
};

// Recheck the server before starting another attempt, including after a lost response.
export async function startVnpayPayment(bookingId) {
  const { data } = await paymentApi.status(bookingId);
  if (data.paymentStatus === 'PAID') return { bookingId, paymentStatus: 'PAID' };
  if (data.bookingStatus !== 'CONFIRMED' || data.paymentStatus !== 'UNPAID') {
    throw new Error(data.bookingStatus === 'PENDING' ? 'Vui lòng chờ cơ sở xác nhận lịch đặt trước khi thanh toán.' : 'Lịch đặt không còn ở trạng thái có thể thanh toán.');
  }
  const active = data.payments?.find((payment) => ['PENDING', 'PROCESSING'].includes(payment.status));
  if (active && (!active.expiresAt || new Date(active.expiresAt).getTime() > Date.now())) {
    return { bookingId, paymentStatus: 'PROCESSING' };
  }
  const response = await (active ? paymentApi.retry(bookingId) : paymentApi.create(bookingId));
  if (response.data?.paymentStatus === 'PAID') return response.data;
  if (!response.data?.paymentUrl) throw new Error('Không nhận được liên kết thanh toán VNPay. Vui lòng kiểm tra trạng thái trước khi thử lại.');
  return response.data;
}

// Booking status is authoritative; an older paid/failed attempt must not
// override a newer attempt while the IPN confirmation is still pending.
export function paymentResultState(data) {
  if (data.paymentStatus === 'PAID') return 'paid';
  if (data.paymentStatus === 'REFUNDED') return 'refunded';
  if (data.bookingStatus === 'CANCELLED') return 'cancelled';
  const latest = [...(data.payments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )[0];
  if (latest?.status === 'FAILED') return 'failed';
  if (latest?.status === 'EXPIRED') return 'expired';
  return 'pending';
}
