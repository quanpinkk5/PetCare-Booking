import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { paymentApi, paymentResultState } from '../src/features/customer/services/paymentApi.js';

test('payment status uses authenticated API and passes cancellation signal', async (t) => {
  authApi.setAccessToken('payment-customer');
  t.after(() => authApi.setAccessToken(null));
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/customer/payments/booking%2Fid/status');
    assert.equal(options.headers.Authorization, 'Bearer payment-customer');
    assert.equal(options.signal, controller.signal);
    return Response.json({ data: { paymentStatus: 'PAID' } });
  });
  assert.equal((await paymentApi.status('booking/id', { signal: controller.signal })).data.paymentStatus, 'PAID');
});

test('status errors are surfaced instead of being presented as successful payment', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không tìm thấy Booking' }, { status: 404 }));
  await assert.rejects(paymentApi.status('id'), /Không tìm thấy Booking/);
});

test('booking confirmation takes priority over payment attempts', () => {
  assert.equal(paymentResultState({ paymentStatus: 'PAID', payments: [{ status: 'FAILED' }] }), 'paid');
  assert.equal(paymentResultState({ paymentStatus: 'REFUNDED', payments: [{ status: 'PAID' }] }), 'refunded');
  assert.equal(paymentResultState({ paymentStatus: 'UNPAID', bookingStatus: 'CANCELLED' }), 'cancelled');
});

test('latest attempt is used even if an older attempt failed', () => {
  const payments = [
    { status: 'FAILED', createdAt: '2026-11-01T00:00:00Z' },
    { status: 'PROCESSING', createdAt: '2026-11-02T00:00:00Z' },
  ];
  assert.equal(paymentResultState({ paymentStatus: 'UNPAID', payments }), 'pending');
  assert.equal(payments[0].status, 'FAILED', 'classification must not mutate API data');
  assert.equal(paymentResultState({ paymentStatus: 'UNPAID', payments: [{ status: 'FAILED' }] }), 'failed');
  assert.equal(paymentResultState({ paymentStatus: 'UNPAID', payments: [{ status: 'EXPIRED' }] }), 'expired');
});

test('unconfirmed, missing and overdue attempts remain pending', () => {
  for (const payments of [[], [{ status: 'PAID' }], [{ status: 'PROCESSING', expiresAt: '2000-01-01' }]]) {
    assert.equal(paymentResultState({ paymentStatus: 'UNPAID', payments }), 'pending');
  }
});
