import test from 'node:test';
import assert from 'node:assert/strict';
import { mapPaymentTransaction, matchesPaymentTimeRange } from '../src/features/customer/services/paymentHistory.js';
import { paymentApi } from '../src/features/customer/services/paymentApi.js';
import { authApi } from '../src/features/auth/services/authApi.js';

test('history uses the authenticated customer endpoint and supports aborting requests', async (t) => {
  authApi.setAccessToken('customer-history');
  t.after(() => authApi.setAccessToken(null));
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/customer/payments');
    assert.equal(options.headers.Authorization, 'Bearer customer-history');
    assert.equal(options.signal, controller.signal);
    return Response.json({ success: true, data: [] });
  });
  assert.deepEqual((await paymentApi.history({ signal: controller.signal })).data, []);
});

test('history preserves payment attempts and uses booking IDs for navigation', () => {
  const payment = {
    _id: 'payment-id', paymentCode: 'PAY-123', method: 'VNPAY', status: 'PROCESSING',
    amount: 250000, createdAt: '2026-10-31T18:15:00Z',
    bookingId: { _id: 'booking-id', bookingCode: 'BK-123', status: 'CONFIRMED', paymentStatus: 'UNPAID' },
  };
  const tx = mapPaymentTransaction(payment);
  assert.equal(tx.bookingObjectId, 'booking-id');
  assert.equal(tx.bookingId, 'BK-123');
  assert.equal(tx.statusLabel, 'Đang xử lý');
  assert.equal(tx.totalAmount, 250000);
  assert.equal(tx.platformFee, 0);
  assert.equal(tx.createdAt, '01/11/2026 01:15');
  assert.equal(tx.canPay, true);
  assert.equal(mapPaymentTransaction({ ...payment, status: 'EXPIRED' }).status, 'failed');
  assert.equal(mapPaymentTransaction({ ...payment, status: 'REFUNDED' }).refundedAmount, 250000);
  assert.equal(mapPaymentTransaction({ ...payment, bookingId: { ...payment.bookingId, paymentStatus: 'PAID' } }).canPay, false);
  assert.equal(mapPaymentTransaction({ ...payment, bookingId: null, customerId: null }).canPay, false);
});

test('time filters follow Vietnam month boundaries and year rollover', () => {
  const now = new Date('2026-12-31T18:00:00Z'); // January in Vietnam
  assert.equal(matchesPaymentTimeRange('2026-12-31T17:00:00Z', 'this_month', now), true);
  assert.equal(matchesPaymentTimeRange('2026-12-31T16:59:59Z', 'this_month', now), false);
  assert.equal(matchesPaymentTimeRange('2026-12-31T16:59:59Z', 'last_month', now), true);
  assert.equal(matchesPaymentTimeRange('2026-11-01T00:00:00Z', 'older', now), true);
  assert.equal(matchesPaymentTimeRange(null, 'this_month', now), false);
});

test('invoices require a settled booking and a successful payment attempt', () => {
  for (const paymentStatus of ['UNPAID', 'PAID', 'REFUNDED', undefined]) {
    for (const status of ['PENDING', 'PROCESSING', 'FAILED', 'EXPIRED', 'PAID', 'REFUNDED']) {
      const tx = mapPaymentTransaction({ status, bookingId: { status: 'COMPLETED', paymentStatus } });
      assert.equal(tx.canViewInvoice, paymentStatus === 'PAID' && status === 'PAID');
    }
  }
});
