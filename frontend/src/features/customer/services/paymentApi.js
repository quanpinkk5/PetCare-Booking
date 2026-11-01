import { apiRequest } from '../../auth/services/authApi.js';

export const paymentApi = {
  status: (bookingId, options = {}) => apiRequest(
    `/customer/payments/${encodeURIComponent(bookingId)}/status`, options,
  ),
};

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
