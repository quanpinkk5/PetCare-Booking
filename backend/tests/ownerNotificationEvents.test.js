const test = require('node:test');
const assert = require('node:assert/strict');
const Notification = require('../src/models/Notification');
const Settings = require('../src/models/BusinessNotificationSettings');
const Conversation = require('../src/models/Conversation');
const Business = require('../src/models/Business');
const Message = require('../src/models/Message');
const events = require('../src/utils/ownerNotificationEvents');
const messageController = require('../src/controllers/customer/messageController');
const registerMessageSocket = require('../src/sockets/messageSocket');
const customerId = '507f1f77bcf86cd799439011', ownerId = '507f1f77bcf86cd799439012';
const conversationId = '507f1f77bcf86cd799439013', businessId = '507f1f77bcf86cd799439014';
const conversation = { _id: conversationId, customerId, businessId, save: async () => {} };
const business = { ownerId, status: 'APPROVED' };
const savedMessage = { _id: '507f1f77bcf86cd799439015', conversationId, senderId: customerId, content: 'Xin chào', createdAt: new Date() };
const mockNotifications = (t, preference = true) => {
  const notifications = [];
  t.mock.method(Settings, 'findOne', (filter) => {
    assert.deepEqual(filter, { userId: ownerId });
    return { select(field) { assert.equal(field, 'notifyCustomerMessage'); return this; }, lean: async () => ({ notifyCustomerMessage: preference }) };
  });
  t.mock.method(Notification, 'create', async ([data]) => {
    assert.equal(data.userId, ownerId);
    assert.equal(data.referenceId, conversationId);
    assert.equal(data.referenceType, 'CONVERSATION');
    assert.equal(data.isRead, false);
    assert.equal(data.type, 'MESSAGE_RECEIVED');
    assert.equal(data.metadata.messageId, savedMessage._id);
    notifications.push(data);
    return [{ _id: 'notice', ...data }];
  });
  return notifications;
};
const fakeIo = () => {
  const emitted = [];
  return { emitted, to: (room) => ({ emit: (event, data) => emitted.push({ room, event, data }) }) };
};

test('REST customer send persists an owner notification and pushes it to the owner user room', async (t) => {
  const notifications = mockNotifications(t);
  const io = fakeIo();
  t.mock.method(Conversation, 'findOne', async () => conversation);
  t.mock.method(Business, 'findById', async () => business);
  t.mock.method(Message, 'create', async () => savedMessage);
  let code;
  await messageController.sendMessage({ user: { _id: customerId }, body: { conversationId, content: 'Xin chào' }, app: { get: () => io } }, {
    status(value) { code = value; return this; }, json() {},
  }, (error) => { throw error; });
  assert.equal(code, 201);
  assert.equal(notifications.length, 1);
  assert.equal(io.emitted.filter((event) => event.event === 'notification:new')[0].room, `user:${ownerId}`);
});

test('socket customer send also persists and emits the notification', async (t) => {
  const notifications = mockNotifications(t);
  const io = fakeIo();
  let lookupCount = 0;
  t.mock.method(Conversation, 'findById', () => {
    lookupCount += 1;
    if (lookupCount === 1) return Promise.resolve(conversation);
    return { populate() { return this; }, lean: async () => conversation };
  });
  t.mock.method(Conversation, 'updateOne', async () => ({}));
  t.mock.method(Business, 'findById', () => ({ select: async () => business }));
  t.mock.method(Message, 'create', async () => ({ populate: async () => {}, toObject: () => savedMessage }));
  const handlers = {};
  registerMessageSocket(io, { user: { _id: customerId, role: 'CUSTOMER' }, rooms: new Set([`conversation:${conversationId}`]), on: (event, handler) => { handlers[event] = handler; } });
  let response;
  await handlers['message:send']({ conversationId, content: 'Xin chào' }, (data) => { response = data; });
  assert.equal(response.success, true);
  assert.equal(notifications.length, 1);
  assert.equal(io.emitted.filter((event) => event.event === 'notification:new').length, 1);
});

test('disabled message preference suppresses owner alerts; owner replies do not notify themselves', async (t) => {
  const notifications = mockNotifications(t, false);
  await events.customerMessage({ business, conversation, message: savedMessage, senderId: customerId });
  await events.customerMessage({ business, conversation, message: savedMessage, senderId: ownerId });
  assert.equal(notifications.length, 0);
});

test('message notifications persist even when no socket server is connected', async (t) => {
  const notifications = mockNotifications(t);
  await events.customerMessage({ business, conversation, message: savedMessage, senderId: customerId });
  assert.equal(notifications.length, 1);
});

test('notification failure does not turn a saved message into a failed send', async (t) => {
  t.mock.method(Settings, 'findOne', () => { throw new Error('database failure'); });
  const log = t.mock.method(console, 'error', () => {});
  await assert.doesNotReject(events.customerMessage({ business, conversation, message: savedMessage, senderId: customerId }));
  assert.equal(log.mock.callCount(), 1);
});
