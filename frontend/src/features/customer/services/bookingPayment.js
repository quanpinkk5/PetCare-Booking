export const canPayBooking = (status, paymentStatus) =>
  ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(status) && paymentStatus === 'UNPAID';

export const canUseCompletedBookingActions = (status, paymentStatus) =>
  status === 'COMPLETED' && paymentStatus === 'PAID';
