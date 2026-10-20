const assert = require('node:assert/strict');
const { test } = require('node:test');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');
const Business = require('../src/models/Business');
const controller = require('../src/controllers/customer/messageController');
const registerConversationSocket = require('../src/sockets/conversationSocket');
const customerId = '507f1f77bcf86cd799439011';
const conversationId = '507f1f77bcf86cd799439012';
const businessId = '507f1f77bcf86cd799439013';
const call = async (handler, body = {}) => {
  let result;
  await handler({ user: { _id: customerId }, body }, {
    code: 200, status(code) { this.code = code; return this; },
    json(data) { result = { status: this.code, ...data }; },
  }, (error) => { throw error; });
  return result;
};

test('REST fallback sends to the selected booking conversation without creating another', async (t) => {
  const conversation = { _id: conversationId, businessId, bookingId: 'booking-id', save: async () => {} };
  t.mock.method(Conversation, 'findOne', async (filter) => {
    assert.deepEqual(filter, { _id: conversationId, customerId });
    return conversation;
  });
  t.mock.method(Business, 'findById', async (id) => { assert.equal(id, businessId); return { status: 'APPROVED' }; });
  t.mock.method(Message, 'create', async (message) => {
    assert.equal(message.conversationId, conversationId);
    assert.equal(message.senderId, customerId);
    assert.equal(message.content, 'Xin chào');
    return { ...message, createdAt: new Date() };
  });
  const create = t.mock.method(Conversation, 'create', async () => { throw new Error('Must reuse selected conversation'); });
  const response = await call(controller.sendMessage, { conversationId, content: ' Xin chào ' });
  assert.equal(response.status, 201);
  assert.equal(create.mock.callCount(), 0);
});

test('cannot send into a conversation owned by another customer', async (t) => {
  t.mock.method(Conversation, 'findOne', async (filter) => {
    assert.equal(filter.customerId, customerId); return null;
  });
  const write = t.mock.method(Message, 'create', async () => { throw new Error('Unauthorized write'); });
  assert.equal((await call(controller.sendMessage, { conversationId, content: 'Hello' })).status, 404);
  assert.equal(write.mock.callCount(), 0);
  assert.equal((await call(controller.sendMessage, { conversationId: 'invalid', content: 'Hello' })).status, 400);
});

test('conversation list counts only unread received messages in customer-owned conversations', async (t) => {
  t.mock.method(Conversation, 'find', (filter) => {
    assert.deepEqual(filter, { customerId });
    return { populate() { return this; }, sort() { return this; }, lean: async () => [{ _id: conversationId }, { _id: businessId }] };
  });
  t.mock.method(Message, 'aggregate', async (pipeline) => {
    const match = pipeline[0].$match;
    assert.equal(match.senderId.$ne.toString(), customerId);
    assert.deepEqual(match.conversationId.$in, [conversationId, businessId]);
    assert.deepEqual(match.isRead, { $ne: true });
    return [{ _id: conversationId, count: 2 }];
  });
  const response = await call(controller.getMyConversations);
  assert.deepEqual(response.data.map((item) => item.unreadCount), [2, 0]);
});

test('leaving a joined chat uses the requested room and succeeds', async () => {
  const handlers = {};
  let left;
  const socket = { user: { _id: customerId, role: 'CUSTOMER' }, rooms: new Set([`conversation:${conversationId}`]),
    on: (event, handler) => { handlers[event] = handler; }, leave: async (room) => { left = room; } };
  registerConversationSocket({}, socket);
  let response;
  await handlers['conversation:leave']({ conversationId }, (data) => { response = data; });
  assert.equal(response.success, true);
  assert.equal(left, `conversation:${conversationId}`);
});
