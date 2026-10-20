import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { messageApi } from '../src/features/customer/services/messageApi.js';
import { conversationData, conversationBookingData, messageData, mergeMessages } from '../src/features/customer/services/messageData.js';

test('customer messaging requests use authentication and preserve conversation identity', async (t) => {
  authApi.setAccessToken('customer-token');
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), ...options });
    assert.equal(options.headers.Authorization, 'Bearer customer-token');
    return Response.json({ success: true, data: [] });
  });
  await messageApi.conversations();
  await messageApi.history('chat/id');
  await messageApi.read('chat/id');
  await messageApi.send({ conversationId: 'chat-id', content: 'Xin chào' });
  assert.equal(calls[0].url.pathname, '/api/customer/conversations');
  assert.equal(calls[1].url.pathname, '/api/customer/conversations/chat%2Fid/messages');
  assert.equal(calls[2].method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[3].body), { conversationId: 'chat-id', content: 'Xin chào' });
});

test('conversation adapter preserves Mongo IDs, unread counts and booking association', () => {
  const chat = conversationData({ _id: 'chat-id', businessId: { _id: 'business-id', name: 'Pet Spa', phone: '0901' },
    bookingId: { _id: 'booking-id' }, unreadCount: 3, lastMessage: 'Chào bạn' });
  assert.equal(chat.id, 'chat-id');
  assert.equal(chat.businessId, 'business-id');
  assert.equal(chat.bookingId, 'booking-id');
  assert.equal(chat.unread, 3);
  assert.equal(chat.avatarText, 'PS');
  assert.equal(conversationData({ _id: 'deleted', businessId: null }).bookingId, '');
});

test('socket acknowledgments and history merge without duplicates or regressing read receipts', () => {
  const raw = { _id: 'message-1', senderId: { _id: 'customer-id' }, content: 'Xin chào', createdAt: '2026-10-20T03:00:00Z', isRead: true };
  const message = messageData(raw, 'customer-id', 'PS');
  assert.equal(message.sender, 'user');
  assert.equal(messageData({ ...raw, senderId: 'owner-id' }, 'customer-id').sender, 'business');
  const merged = mergeMessages([message], [messageData({ ...raw, isRead: false, senderId: 'customer-id' }, 'customer-id'),
    messageData({ ...raw, _id: 'message-2', createdAt: '2026-10-20T03:01:00Z' }, 'customer-id')]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].isRead, true);
  assert.equal(merged[1].id, 'message-2');
});

test('related booking uses its database ID for navigation and actual pet data', () => {
  const data = conversationBookingData({ _id: 'booking-id', bookingCode: 'BK001', status: 'CONFIRMED',
    petId: { name: 'Milo', weight: 4, avatar: '/milo.jpg' },
    branchServiceId: { serviceId: { name: 'Tắm' }, branchId: { name: 'Quận 1' } } });
  assert.equal(data.bookingInfo.id, 'BK001');
  assert.equal(data.bookingInfo.recordId, 'booking-id');
  assert.equal(data.petInfo.name, 'Milo');
  assert.equal(data.petInfo.image, '/milo.jpg');
});
