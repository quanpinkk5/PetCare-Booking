import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { paymentApi, paymentResultState, startVnpayPayment } from '../src/features/customer/services/paymentApi.js';

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

test('new VNPay attempt posts only the booking ID using customer authentication', async (t) => {
  authApi.setAccessToken('customer');
  t.after(() => authApi.setAccessToken(null));
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push(new URL(url).pathname);
    assert.equal(options.headers.Authorization, 'Bearer customer');
    if (options.method === 'POST') {
      assert.deepEqual(JSON.parse(options.body), { bookingId: 'booking-id' });
      return Response.json({ data: { paymentUrl: 'https://sandbox.vnpayment.vn/pay' } });
    }
    return Response.json({ data: { bookingStatus: 'CONFIRMED', paymentStatus: 'UNPAID', payments: [] } });
  });
  assert.equal((await startVnpayPayment('booking-id')).paymentUrl, 'https://sandbox.vnpayment.vn/pay');
  assert.deepEqual(calls, ['/api/customer/payments/booking-id/status', '/api/customer/payments/vnpay/create']);
});

test('paid and in-progress bookings do not create duplicate VNPay attempts', async (t) => {
  let status = { bookingStatus: 'CONFIRMED', paymentStatus: 'PAID' };
  t.mock.method(paymentApi, 'status', async () => ({ data: status }));
  const create = t.mock.method(paymentApi, 'create', async () => { throw new Error('unexpected create'); });
  const retry = t.mock.method(paymentApi, 'retry', async () => { throw new Error('unexpected retry'); });
  assert.equal((await startVnpayPayment('id')).paymentStatus, 'PAID');
  for (const expiresAt of [undefined, new Date(Date.now() + 60000).toISOString()]) {
    status = { bookingStatus: 'CONFIRMED', paymentStatus: 'UNPAID', payments: [{ status: 'PROCESSING', expiresAt }] };
    assert.equal((await startVnpayPayment('id')).paymentStatus, 'PROCESSING');
  }
  assert.equal(create.mock.callCount(), 0);
  assert.equal(retry.mock.callCount(), 0);
});

test('expired active attempt uses backend reconciliation and accepts already-paid response', async (t) => {
  t.mock.method(paymentApi, 'status', async () => ({ data: {
    bookingStatus: 'CONFIRMED', paymentStatus: 'UNPAID',
    payments: [{ status: 'PROCESSING', expiresAt: '2000-01-01' }],
  } }));
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/customer/payments/vnpay/retry');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), { bookingId: 'id' });
    return Response.json({ data: { bookingId: 'id', paymentStatus: 'PAID' } });
  });
  assert.equal((await startVnpayPayment('id')).paymentStatus, 'PAID');
});

test('cancelled and refunded bookings cannot start a payment', async (t) => {
  const status = t.mock.method(paymentApi, 'status');
  for (const data of [
    { bookingStatus: 'CANCELLED', paymentStatus: 'UNPAID' },
    { bookingStatus: 'CONFIRMED', paymentStatus: 'REFUNDED' },
  ]) {
    status.mock.mockImplementation(async () => ({ data }));
    await assert.rejects(startVnpayPayment('id'), /không còn ở trạng thái/);
  }
});

test('unconfirmed bookings cannot start or retry payment even with an existing attempt', async (t) => {
  const status = t.mock.method(paymentApi, 'status');
  const create = t.mock.method(paymentApi, 'create', () => { throw new Error('unexpected create'); });
  const retry = t.mock.method(paymentApi, 'retry', () => { throw new Error('unexpected retry'); });
  for (const payments of [[], [{ status: 'PROCESSING', expiresAt: '2000-01-01' }]]) {
    status.mock.mockImplementation(async () => ({ data: { bookingStatus: 'PENDING', paymentStatus: 'UNPAID', payments } }));
    await assert.rejects(startVnpayPayment('id'), /chờ cơ sở xác nhận/);
  }
  assert.equal(create.mock.callCount(), 0);
  assert.equal(retry.mock.callCount(), 0);
});

test('gateway errors and missing payment URL never become payment success', async (t) => {
  t.mock.method(paymentApi, 'status', async () => ({ data: { bookingStatus: 'CONFIRMED', paymentStatus: 'UNPAID', payments: [] } }));
  const create = t.mock.method(paymentApi, 'create', async () => { throw new Error('Mất kết nối'); });
  await assert.rejects(startVnpayPayment('id'), /Mất kết nối/);
  create.mock.mockImplementation(async () => ({ data: {} }));
  await assert.rejects(startVnpayPayment('id'), /Không nhận được liên kết/);
});

for (const bookingStatus of ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']) {
  test(`unpaid ${bookingStatus} bookings can pay, while settled bookings cannot pay again`, async (t) => {
    let paymentStatus = 'UNPAID';
    t.mock.method(paymentApi, 'status', async () => ({ data: { bookingStatus, paymentStatus, payments: [] } }));
    const create = t.mock.method(paymentApi, 'create', async () => ({ data: { paymentUrl: 'https://example.com/pay' } }));
    assert.equal((await startVnpayPayment('id')).paymentUrl, 'https://example.com/pay');
    paymentStatus = 'PAID';
    assert.equal((await startVnpayPayment('id')).paymentStatus, 'PAID');
    paymentStatus = 'REFUNDED';
    await assert.rejects(startVnpayPayment('id'), /không còn ở trạng thái/);
    assert.equal(create.mock.callCount(), 1);
  });
}
