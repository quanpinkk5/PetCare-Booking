const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const jwt = require('jsonwebtoken');
const Notification = require('../src/models/Notification');
const Settings = require('../src/models/BusinessNotificationSettings');
const User = require('../src/models/User');
const controller = require('../src/controllers/businessOwner/notificationsController');
const userId = '507f1f77bcf86cd799439011', id = '507f1f77bcf86cd799439012';
const query = (data) => ({ select() { return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, lean: async () => data });
const call = async (handler, options = {}) => {
  let result;
  await handler({ user: { _id: userId }, query: {}, body: {}, params: { id }, ...options }, {
    code: 200, status(code) { this.code = code; return this; }, json(body) { result = { code: this.code, ...body }; },
  }, (error) => { throw error; });
  return result;
};

test('owner notification list and pagination only use authenticated recipient', async (t) => {
  t.mock.method(Notification, 'find', (filter) => {
    assert.deepEqual(filter, { userId });
    const q = query([{ _id: id }]);
    q.skip = (value) => { assert.equal(value, 100); return q; };
    return q;
  });
  t.mock.method(Notification, 'countDocuments', async (filter) => { assert.deepEqual(filter, { userId }); return 101; });
  const result = await call(controller.list, { query: { page: 2, userId: 'other', businessId: 'other' } });
  assert.equal(result.pagination.totalPages, 2);
  assert.equal(result.data[0]._id, id);
});

test('invalid pagination, read values and bulk IDs fail before database operations', async (t) => {
  for (const method of ['find', 'findOneAndUpdate', 'updateMany', 'deleteMany']) t.mock.method(Notification, method, () => { throw new Error('must not access database'); });
  assert.equal((await call(controller.list, { query: { page: '-1' } })).code, 400);
  assert.equal((await call(controller.setRead, { body: { isRead: 'true' } })).code, 400);
  for (const ids of [[], ['bad'], Array(1001).fill(id), 'bad']) {
    assert.equal((await call(controller.markMultipleRead, { body: { ids } })).code, 400);
    assert.equal((await call(controller.removeMultiple, { body: { ids } })).code, 400);
  }
});

test('single read and delete protect other recipients and use server timestamps', async (t) => {
  t.mock.method(Notification, 'findOneAndUpdate', (filter, update) => {
    assert.deepEqual(filter, { userId, _id: id });
    assert.equal(update.$set.isRead, true);
    assert.ok(update.$set.readAt instanceof Date);
    return query(null);
  });
  t.mock.method(Notification, 'findOneAndDelete', async (filter) => { assert.deepEqual(filter, { userId, _id: id }); return null; });
  assert.equal((await call(controller.setRead, { body: { isRead: true } })).code, 404);
  assert.equal((await call(controller.remove)).code, 404);
});

test('bulk read and delete deduplicate IDs and always retain recipient ownership', async (t) => {
  t.mock.method(Notification, 'updateMany', async (filter, update) => {
    assert.deepEqual(filter, { userId, _id: { $in: [id] } });
    assert.equal(update.$set.isRead, true);
    assert.ok(update.$set.readAt instanceof Date);
    return { modifiedCount: 1 };
  });
  t.mock.method(Notification, 'deleteMany', async (filter) => {
    assert.deepEqual(filter, { userId, _id: { $in: [id] } }); return { deletedCount: 1 };
  });
  assert.equal((await call(controller.markMultipleRead, { body: { ids: [id, id], userId: 'other' } })).count, 1);
  assert.equal((await call(controller.removeMultiple, { body: { ids: [id] } })).count, 1);
});

test('settings have server defaults and update only allowed booleans for the logged-in owner', async (t) => {
  t.mock.method(Settings, 'findOne', (filter) => { assert.deepEqual(filter, { userId }); return query(null); });
  assert.deepEqual((await call(controller.getSettings)).data, Settings.defaults);
  t.mock.method(Settings, 'findOneAndUpdate', (filter, update, options) => {
    assert.deepEqual(filter, { userId });
    assert.deepEqual(update, { $set: { notifyNewBooking: false } });
    assert.equal(options.upsert, true);
    return query({ notifyNewBooking: false });
  });
  assert.equal((await call(controller.updateSettings, { body: { notifyNewBooking: false } })).data.notifyNewBooking, false);
  for (const body of [{ userId: 'other' }, { soundEnabled: 'false' }, {}, []]) {
    assert.equal((await call(controller.updateSettings, { body })).code, 400);
  }
});

test('read-all and clearing read notifications never affect another recipient', async (t) => {
  t.mock.method(Notification, 'updateMany', async (filter) => { assert.deepEqual(filter, { userId, isRead: { $ne: true } }); });
  t.mock.method(Notification, 'deleteMany', async (filter) => { assert.deepEqual(filter, { userId, isRead: true }); });
  assert.equal((await call(controller.markAllRead)).success, true);
  assert.equal((await call(controller.clearRead)).success, true);
});

test('notification endpoints require login and reject customers before database access', async (t) => {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'owner-notification-test';
  t.after(() => { if (previous === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous; });
  t.mock.method(User, 'findById', async () => ({ _id: userId, role: 'CUSTOMER', status: 'ACTIVE', tokenVersion: 0 }));
  const app = require('../src/app');
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}/api/businessOwner/notifications`;
  assert.equal((await fetch(url)).status, 401);
  const token = jwt.sign({ userId, tokenVersion: 0 }, process.env.JWT_SECRET);
  assert.equal((await fetch(url, { headers: { Authorization: `Bearer ${token}` } })).status, 403);
});
