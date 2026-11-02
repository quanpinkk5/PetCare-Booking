import test from 'node:test';
import assert from 'node:assert/strict';
import { authApi } from '../src/features/auth/services/authApi.js';
import { notificationApi, loadCustomerNotifications } from '../src/features/customer/services/notificationApi.js';
import { notificationData, notificationTimeAgo } from '../src/features/customer/services/notificationData.js';

test('notification requests use customer authentication and persist all supported mutations', async (t) => {
  authApi.setAccessToken('notification-customer');
  t.after(() => authApi.setAccessToken(null));
  const calls = [];
  const signal = new AbortController().signal;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer notification-customer');
    calls.push({ url: new URL(url), ...options });
    return Response.json({ success: true, data: [] });
  });
  await notificationApi.list(2, { signal });
  await notificationApi.setRead('notice/id', false);
  await notificationApi.markAllRead();
  await notificationApi.remove('notice/id');
  await notificationApi.clearRead();
  assert.equal(calls[0].signal, signal);
  assert.equal(calls[0].url.searchParams.get('page'), '2');
  assert.equal(calls[1].url.pathname, '/api/customer/notifications/notice%2Fid/read');
  assert.deepEqual(JSON.parse(calls[1].body), { isRead: false });
  assert.equal(calls[2].method, 'PATCH');
  assert.equal(calls[3].method, 'DELETE');
  assert.equal(calls[4].url.pathname, '/api/customer/notifications/read');
});

test('loading follows server pagination and deduplicates records for global unread counts', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    const page = new URL(url).searchParams.get('page');
    return Response.json({ data: page === '1' ? [{ _id: 'one' }, { _id: 'two' }] : [{ _id: 'two' }, { _id: 'three' }], pagination: { totalPages: 2 } });
  });
  assert.deepEqual((await loadCustomerNotifications()).map((item) => item._id), ['one', 'two', 'three']);
});

test('backend failures propagate instead of reporting a successful read or deletion', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không tìm thấy thông báo' }, { status: 404 }));
  await assert.rejects(notificationApi.remove('other-customer'), /Không tìm thấy/);
  await assert.rejects(notificationApi.setRead('other-customer', true), /Không tìm thấy/);
});

test('notification adapter maps real references to current customer routes without demo data', () => {
  const item = { _id: 'notice-id', type: 'BOOKING_CONFIRMED', title: 'Đã xác nhận', referenceType: 'BOOKING', referenceId: 'booking-id', createdAt: '2026-11-01T00:00:00Z' };
  const booking = notificationData(item);
  assert.equal(booking.type, 'booking');
  assert.equal(booking.actionUrl, '/my-bookings/booking-id');
  assert.equal(booking.isRead, false);
  assert.equal(booking.petName, undefined);
  assert.equal(notificationData({ ...item, referenceType: 'PAYMENT', type: 'PAYMENT_PAID', referenceId: 'payment-id' }).actionUrl, '/billing?txn=payment-id');
  assert.equal(notificationData({ _id: 'unknown', type: 'UNKNOWN', referenceType: 'UNKNOWN', referenceId: 'id' }).type, 'system');
  assert.equal(notificationData({ _id: 'unknown', referenceType: 'BOOKING' }).actionUrl, '');
  assert.equal(notificationTimeAgo('2026-11-01T00:00:00Z', new Date('2026-11-01T00:05:00Z').getTime()), '5 phút trước');
});
