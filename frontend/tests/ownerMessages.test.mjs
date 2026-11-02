import test from 'node:test';
import assert from 'node:assert/strict';
import { authApi } from '../src/features/auth/services/authApi.js';
import { ownerMessageApi } from '../src/features/businessOwner/services/messageApi.js';
import { ownerConversationData, ownerMessageData, mergeOwnerMessages, filterOwnerChats } from '../src/features/businessOwner/services/messageView.js';

test('owner message APIs use authenticated routes, encoded IDs, cancellation and exact mutation payloads', async (t) => {
  authApi.setAccessToken('owner-token');
  t.after(() => authApi.setAccessToken(null));
  const calls = [];
  const signal = new AbortController().signal;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer owner-token');
    calls.push({ path: new URL(url).pathname, ...options });
    return Response.json({ success: true, data: [] });
  });
  await ownerMessageApi.conversations(signal);
  await ownerMessageApi.history('chat/id', signal);
  await ownerMessageApi.send('chat/id', 'Nội dung');
  await ownerMessageApi.read('chat/id');
  await ownerMessageApi.important('chat/id', true);
  assert.equal(calls[0].path, '/api/businessOwner/conversations');
  assert.equal(calls[1].path, '/api/businessOwner/conversations/chat%2Fid/messages');
  assert.equal(calls[1].signal, signal);
  assert.deepEqual(JSON.parse(calls[2].body), { conversationId: 'chat/id', content: 'Nội dung' });
  assert.equal(calls[3].method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[4].body), { important: true });
});

test('API errors propagate without fabricated sends', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không có quyền' }, { status: 403 }));
  await assert.rejects(ownerMessageApi.send('other', 'hello'), /Không có quyền/);
});

test('conversation adapter uses actual customer, unread count, booking and persisted importance', () => {
  const chat = ownerConversationData({ _id: 'chat', customerId: { _id: 'customer', fullName: 'An', phone: '0901234567' },
    ownerImportant: true, unreadCount: 3, lastMessage: 'hello', bookingId: { bookingCode: 'BK-real', branchServiceId: { serviceId: { name: 'Spa' } } } });
  assert.equal(chat.name, 'An');
  assert.equal(chat.unread, 3);
  assert.equal(chat.customer.booking.id, 'BK-real');
  assert.equal(chat.customer.booking.service, 'Spa');
  assert.equal(filterOwnerChats([chat], '090123', 'important').length, 1);
  assert.equal(filterOwnerChats([chat], 'missing', 'unread').length, 0);
  assert.equal(filterOwnerChats([{ ...chat, important: false }], '', 'important').length, 0);
});

test('missing customer and booking never inherit sample conversations or online status', () => {
  const chat = ownerConversationData({ _id: 'chat', customerId: null, bookingId: null });
  assert.equal(chat.customer.booking, null);
  assert.equal(chat.unread, 0);
  assert.deepEqual(chat.tags, []);
  assert.equal(chat.lastMsg, '');
  assert.equal(chat.important, false);
});

test('REST and socket echoes merge by database ID without losing read status', () => {
  const own = ownerMessageData({ _id: 'm1', senderId: { _id: 'owner' }, content: 'Hi', createdAt: '2026-11-01T17:10:00Z', isRead: true }, 'owner');
  assert.equal(own.sender, 'shop');
  assert.match(own.time, /02\/11\/2026/);
  const received = ownerMessageData({ _id: 'm2', senderId: 'customer', createdAt: '2026-11-02T00:00:00Z', messageType: 'IMAGE', imageUrl: 'https://example.com/photo.jpg' }, 'owner');
  const messages = mergeOwnerMessages([own], [received, { ...own, isRead: false }]);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].isRead, true);
  assert.equal(messages[1].sender, 'customer');
  assert.deepEqual(messages[1].images, ['https://example.com/photo.jpg']);
});
