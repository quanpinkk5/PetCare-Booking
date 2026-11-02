import test from 'node:test';
import assert from 'node:assert/strict';
import { authApi } from '../src/features/auth/services/authApi.js';
import { ownerNotificationApi, loadOwnerNotifications } from '../src/features/businessOwner/services/notificationApi.js';
import { ownerNotificationData, filterOwnerNotifications } from '../src/features/businessOwner/services/notificationView.js';

test('owner notifications use authenticated APIs, exact mutation payloads, encoded IDs and request cancellation', async (t) => {
  authApi.setAccessToken('owner'); t.after(() => authApi.setAccessToken(null));
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer owner');
    calls.push({ url: new URL(url), ...options });
    return Response.json({ success: true, data: [] });
  });
  const signal = new AbortController().signal;
  await ownerNotificationApi.list(2, { signal });
  await ownerNotificationApi.setRead('notice/id', false);
  await ownerNotificationApi.markMultipleRead(['a', 'b']);
  await ownerNotificationApi.removeMultiple(['a']);
  await ownerNotificationApi.saveSettings({ soundEnabled: false });
  assert.equal(calls[0].signal, signal);
  assert.equal(calls[0].url.searchParams.get('page'), '2');
  assert.equal(calls[1].url.pathname, '/api/businessOwner/notifications/notice%2Fid/read');
  assert.deepEqual(JSON.parse(calls[1].body), { isRead: false });
  assert.deepEqual(JSON.parse(calls[2].body), { ids: ['a', 'b'] });
  assert.equal(calls[3].method, 'POST');
  assert.deepEqual(JSON.parse(calls[4].body), { soundEnabled: false });
});

test('inbox loads every server page and deduplicates records for global unread counts', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => Response.json({
    data: new URL(url).searchParams.get('page') === '1' ? [{ _id: 'a' }, { _id: 'b' }] : [{ _id: 'b' }, { _id: 'c' }], pagination: { totalPages: 2 },
  }));
  assert.deepEqual((await loadOwnerNotifications()).map((n) => n._id), ['a', 'b', 'c']);
});

test('write failures propagate without false success', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không có quyền' }, { status: 403 }));
  await assert.rejects(ownerNotificationApi.remove('other'), /Không có quyền/);
  await assert.rejects(ownerNotificationApi.markMultipleRead(['other']), /Không có quyền/);
  await assert.rejects(ownerNotificationApi.saveSettings({ soundEnabled: true }), /Không có quyền/);
});

test('real admin business notifications link to owner profile without fabricated customer, branch or priority', () => {
  const notification = ownerNotificationData({ _id: 'n', type: 'BUSINESS_INFO_REQUEST', referenceType: 'BUSINESS', referenceId: 'business', title: 'Bổ sung hồ sơ', message: 'Nội dung thật' });
  assert.equal(notification.actionUrl, '/business/profile');
  assert.equal(notification.type, 'system');
  assert.equal(notification.branch, '');
  assert.equal(notification.customer, undefined);
  assert.equal(notification.priority, 'normal');
  assert.equal(notification.message, 'Nội dung thật');
});

test('all owner reference actions use existing routes and unknown references have no invented action', () => {
  for (const [referenceType, route] of [['BOOKING', '/business/bookings'], ['PAYMENT', '/business/payments'], ['REVIEW', '/business/reviews'], ['CONVERSATION', '/business/messages']]) {
    assert.equal(ownerNotificationData({ _id: 'n', referenceType, referenceId: 'real' }).actionUrl, route);
  }
  assert.equal(ownerNotificationData({ _id: 'n', referenceType: 'UNKNOWN', referenceId: 'real' }).actionUrl, '');
  assert.equal(ownerNotificationData({ _id: 'n', referenceType: 'BOOKING' }).actionUrl, '');
});

test('category, read, priority, branch and keyword filters combine without including unrelated branches', () => {
  const record = ownerNotificationData({ _id: 'n', type: 'PAYMENT_PAID', isRead: false, priority: 'high', branch: 'Branch A', metadata: { bookingId: 'BK1', amount: 0 } });
  assert.equal(filterOwnerNotifications([record], { category: 'payment', read: 'unread', priority: 'high', branch: 'Branch A', search: 'BK1' }).length, 1);
  assert.equal(filterOwnerNotifications([record], { branch: 'Branch B' }).length, 0);
  assert.equal(filterOwnerNotifications([record], { read: 'read' }).length, 0);
  assert.equal(record.metadata.amount, 0);
});
