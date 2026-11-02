const test = require('node:test');
const assert = require('node:assert/strict');
const Business = require('../src/models/Business');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');
const controller = require('../src/controllers/businessOwner/messageController');
const { notifyMessage, notifyRead } = require('../src/utils/messageEvents');
const ownerId = '507f1f77bcf86cd799439011';
const conversationId = '507f1f77bcf86cd799439012';
const businessId = '507f1f77bcf86cd799439013';
const customerId = '507f1f77bcf86cd799439014';
const call = async (handler, overrides = {}) => {
  let response;
  await handler({ user: { _id: ownerId, role: 'BUSINESS_OWNER' }, params: { conversationId }, body: {}, ...overrides }, {
    code: 200, status(code) { this.code = code; return this; },
    json(body) { response = { code: this.code, ...body }; },
  }, (err) => { throw err; });
  return response;
};
const mockBusiness = (t, result = { _id: businessId, ownerId }) => t.mock.method(Business, 'findOne', (filter) => {
  assert.deepEqual(filter, { ownerId });
  return { select(fields) { assert.equal(fields, '_id ownerId'); return this; }, lean: async () => result };
});
const mockConversation = (t, result = { _id: conversationId, businessId, customerId }) => t.mock.method(Conversation, 'findOne', (filter) => {
  assert.deepEqual(filter, { _id: conversationId, businessId });
  return { lean: async () => result };
});

test('owner list is scoped to their business with received unread counts', async (t) => {
  mockBusiness(t);
  t.mock.method(Conversation, 'find', (filter) => {
    assert.deepEqual(filter, { businessId });
    return { populate() { return this; }, sort() { return this; }, lean: async () => [{ _id: conversationId }] };
  });
  t.mock.method(Message, 'aggregate', async (pipeline) => {
    assert.deepEqual(pipeline[0].$match.conversationId.$in, [conversationId]);
    assert.equal(String(pipeline[0].$match.senderId.$ne), ownerId);
    assert.deepEqual(pipeline[0].$match.isRead, { $ne: true });
    return [{ _id: conversationId, count: 3 }];
  });
  const result = await call(controller.getConversations, { query: { businessId: 'other' } });
  assert.equal(result.data[0].unreadCount, 3);
});

test('owner without a business has no conversations and cannot read one', async (t) => {
  mockBusiness(t, null);
  t.mock.method(Conversation, 'find', () => { throw new Error('must not query'); });
  assert.deepEqual((await call(controller.getConversations)).data, []);
  assert.equal((await call(controller.getMessages)).code, 404);
});

test('history, send, read and important reject conversations from another business', async (t) => {
  mockBusiness(t); mockConversation(t, null);
  for (const name of ['find', 'create', 'updateMany']) t.mock.method(Message, name, () => { throw new Error('unauthorized access'); });
  t.mock.method(Conversation, 'updateOne', () => { throw new Error('unauthorized write'); });
  assert.equal((await call(controller.getMessages)).code, 404);
  assert.equal((await call(controller.sendMessage, { body: { conversationId, content: 'Hello' } })).code, 404);
  assert.equal((await call(controller.markRead)).code, 404);
  assert.equal((await call(controller.setImportant, { body: { important: true } })).code, 404);
});

test('malformed IDs and content fail without accessing the database', async (t) => {
  t.mock.method(Business, 'findOne', () => { throw new Error('must not query'); });
  for (const handler of [controller.getMessages, controller.markRead]) {
    assert.equal((await call(handler, { params: { conversationId: 'invalid' } })).code, 400);
  }
  for (const content of ['', '   ', {}, 'x'.repeat(10001)]) {
    assert.equal((await call(controller.sendMessage, { body: { conversationId, content } })).code, 400);
  }
  assert.equal((await call(controller.setImportant, { body: { important: 'true' } })).code, 400);
});

test('history is chronologically sorted and scoped to a verified conversation', async (t) => {
  mockBusiness(t); mockConversation(t);
  t.mock.method(Message, 'find', (filter) => {
    assert.deepEqual(filter, { conversationId });
    return { populate(path, fields) { assert.equal(path, 'senderId'); assert.equal(fields, 'fullName avatar'); return this; },
      sort(order) { assert.deepEqual(order, { createdAt: 1, _id: 1 }); return this; }, lean: async () => [{ content: 'History' }] };
  });
  assert.equal((await call(controller.getMessages)).data[0].content, 'History');
});

test('REST send uses authenticated owner, selected conversation and saved timestamp', async (t) => {
  mockBusiness(t); mockConversation(t);
  const createdAt = new Date();
  t.mock.method(Message, 'create', async (data) => {
    assert.equal(data.senderId, ownerId);
    assert.equal(data.conversationId, conversationId);
    assert.equal(data.content, 'Xin chào');
    assert.equal(data.isRead, false);
    return { _id: 'message-id', ...data, createdAt };
  });
  t.mock.method(Conversation, 'updateOne', async (filter, update) => {
    assert.deepEqual(filter, { _id: conversationId, businessId });
    assert.deepEqual(update.$set, { lastMessage: 'Xin chào', lastMessageAt: createdAt });
  });
  const response = await call(controller.sendMessage, { body: { conversationId, content: ' Xin chào ', senderId: customerId } });
  assert.equal(response.code, 201);
  assert.equal(response.data.message._id, 'message-id');
});

test('read updates only incoming unread messages and important persists on the owned conversation', async (t) => {
  mockBusiness(t); mockConversation(t);
  t.mock.method(Message, 'updateMany', async (filter, update) => {
    assert.deepEqual(filter, { conversationId, senderId: { $ne: ownerId }, isRead: { $ne: true } });
    assert.equal(update.$set.isRead, true);
    assert.ok(update.$set.readAt instanceof Date);
    return { modifiedCount: 2 };
  });
  assert.equal((await call(controller.markRead)).updatedCount, 2);
  t.mock.method(Conversation, 'updateOne', async (filter, update) => {
    assert.deepEqual(filter, { _id: conversationId, businessId });
    assert.deepEqual(update, { $set: { ownerImportant: true } });
  });
  assert.equal((await call(controller.setImportant, { body: { important: true } })).important, true);
});

test('REST sends and read updates publish socket events to the right recipients', () => {
  const events = [];
  const req = { user: { _id: ownerId }, app: { get: () => ({ to: (room) => ({ emit: (event, data) => events.push({ room, event, data }) }) }) } };
  const conversation = { _id: conversationId, customerId };
  const message = { content: 'hello', createdAt: new Date() };
  notifyMessage(req, conversation, { ownerId }, message);
  assert.deepEqual(events.map((e) => [e.room, e.event]), [
    [`conversation:${conversationId}`, 'message:new'], [`user:${customerId}`, 'conversation:updated'], [`user:${ownerId}`, 'conversation:updated'],
  ]);
  notifyRead(req, conversation, new Date(), 2);
  assert.equal(events[3].data.readBy, ownerId);
  assert.equal(events[3].data.updatedCount, 2);
});

test('owner routes enforce authentication and role authorization', async () => {
  const router = require('../src/routes/businessOwner/messageRoutes');
  for (const layer of router.stack.filter((item) => item.route)) {
    const handlers = layer.route.stack;
    assert.equal(handlers.length, 3);
    let result;
    handlers[1].handle({ user: { role: 'CUSTOMER' } }, { status(code) { result = code; return this; }, json() {} }, () => { throw new Error('must reject'); });
    assert.equal(result, 403);
  }
});
