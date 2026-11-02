import test from 'node:test';
import assert from 'node:assert/strict';
import { canPayBooking, canUseCompletedBookingActions } from '../src/features/customer/services/bookingPayment.js';

for (const status of ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', undefined]) {
  test(`payment and completed actions follow settlement for ${status}`, () => {
    for (const paymentStatus of ['UNPAID', 'PAID', 'REFUNDED', undefined]) {
      assert.equal(canUseCompletedBookingActions(status, paymentStatus), status === 'COMPLETED' && paymentStatus === 'PAID');
      assert.equal(canPayBooking(status, paymentStatus), ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(status) && paymentStatus === 'UNPAID');
    }
  });
}
