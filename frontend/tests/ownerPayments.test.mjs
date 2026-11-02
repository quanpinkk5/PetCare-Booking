import test from 'node:test';
import assert from 'node:assert/strict';
import { mapOwnerPayment, matchesPaymentDates, summarizePayments } from '../src/features/businessOwner/services/paymentView.js';
import { authApi } from '../src/features/auth/services/authApi.js';
import { ownerPaymentApi } from '../src/features/businessOwner/services/paymentApi.js';

test('owner payments use authenticated endpoint and preserve cancellation and API errors', async (t) => {
  authApi.setAccessToken('owner-token');
  t.after(() => authApi.setAccessToken(null));
  const controller = new AbortController();
  let failed = false;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/businessOwner/payments');
    assert.equal(options.headers.Authorization, 'Bearer owner-token');
    assert.equal(options.signal, controller.signal);
    return failed ? Response.json({ message: 'Không có quyền truy cập' }, { status: 403 })
      : Response.json({ success: true, data: [], branches: [] });
  });
  assert.deepEqual((await ownerPaymentApi.list(controller.signal)).data, []);
  failed = true;
  await assert.rejects(ownerPaymentApi.list(controller.signal), /Không có quyền truy cập/);
});

test('owner payment maps actual booking, customer, branch and Vietnamese payment time', () => {
  const payment = mapOwnerPayment({
    _id: '1', paymentCode: 'PAY-1', amount: 250000, status: 'PAID', method: 'VNPAY',
    createdAt: '2026-11-01T12:00:00Z', paidAt: '2026-11-01T17:15:00Z',
    customerId: { fullName: 'Khách hàng', phone: '0901234567' },
    bookingId: { bookingCode: 'BK-real', totalPrice: 250000, branchServiceId: {
      branchId: { _id: 'branch-1', name: 'Chi nhánh 1' }, serviceId: { name: 'Spa', serviceType: 'APPOINTMENT' },
    } },
  });
  assert.equal(payment.bookingCode, 'BK-real');
  assert.equal(payment.branchId, 'branch-1');
  assert.equal(payment.customer, 'Khách hàng');
  assert.equal(payment.status, 'Đã thanh toán');
  assert.match(payment.date, /02\/11\/2026/);
  assert.equal(payment.timeline.length, 2);
  assert.equal(matchesPaymentDates(payment, '2026-11-02', '2026-11-02'), true);
  assert.equal(matchesPaymentDates(payment, '', '2026-11-01'), false);
});

test('missing references never produce fabricated bookings or settlement history', () => {
  const payment = mapOwnerPayment({ _id: 'missing', bookingId: null, customerId: null, amount: 500, status: 'PENDING' });
  assert.equal(payment.bookingCode, '—');
  assert.equal(payment.customer, '—');
  assert.equal(payment.timeline.length, 1);
  assert.equal(payment.received, '0 đ');
  assert.equal(matchesPaymentDates(payment, '2026-11-01', ''), false);
});

test('metrics exclude failed, expired and refunded amounts from collected revenue', () => {
  const statuses = ['PAID', 'PENDING', 'PROCESSING', 'REFUNDED', 'FAILED', 'EXPIRED'];
  const payments = statuses.map((status) => mapOwnerPayment({ status, amount: 100000 }));
  const metrics = summarizePayments(payments);
  assert.equal(metrics[0].value, '100.000 đ');
  assert.equal(metrics[1].value, '100.000 đ');
  assert.equal(metrics[2].value, '200.000 đ');
  assert.equal(metrics[3].value, '100.000 đ');
  assert.equal(summarizePayments([])[0].value, '0 đ');
});

test('refund history uses recorded payment and refund timestamps', () => {
  const payment = mapOwnerPayment({ status: 'REFUNDED', amount: 50,
    createdAt: '2026-10-30T00:00:00Z', paidAt: '2026-10-31T00:00:00Z', refundedAt: '2026-11-01T00:00:00Z' });
  assert.deepEqual(payment.timeline.map((event) => event.id), ['status', 'paid', 'created']);
  assert.equal(payment.received, '0 đ');
});
