const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const jwt = require('jsonwebtoken');
const Notification = require('../src/models/Notification');
const User = require('../src/models/User');
const app = require('../src/app');
const controller = require('../src/controllers/customer/notificationsController');
const userId = '507f1f77bcf86cd799439011';
const id = '507f1f77bcf86cd799439012';
const call = async (handler, { params = {}, body = {}, query = {} } = {}) => {
  let result;
  await handler({ user: { _id: userId }, params, body, query }, {
    code: 200, status(code) { this.code = code; return this; },
    json(data) { result = { status: this.code, ...data }; },
  }, (error) => { throw error; });
  return result;
};

test('notification list ignores supplied ownership and paginates only the authenticated customer', async (t) => {
  t.mock.method(Notification, 'countDocuments', async (filter) => {
    assert.deepEqual(filter, { userId });
    return 102;
  });
  t.mock.method(Notification, 'find', (filter) => {
    assert.deepEqual(filter, { userId });
    return {
      select(fields) { assert.equal(fields.includes('userId'), false); return this; },
      sort(order) { assert.deepEqual(order, { createdAt: -1, _id: -1 }); return this; },
      skip(value) { assert.equal(value, 100); return this; },
      limit(value) { assert.equal(value, 100); return this; },
      lean: async () => [{ _id: id }],
    };
  });
  const result = await call(controller.list, { query: { page: '2', userId: 'someone-else' } });
  assert.equal(result.pagination.totalPages, 2);
  assert.equal(result.data[0]._id, id);
  assert.equal((await call(controller.list, { query: { page: '-1' } })).status, 400);
});

test('read and unread updates use atomic ownership filters and authoritative server timestamps', async (t) => {
  for (const isRead of [true, false]) {
    t.mock.method(Notification, 'findOneAndUpdate', (filter, update, options) => {
      assert.deepEqual(filter, { userId, _id: id });
      assert.equal(update.$set.isRead, isRead);
      assert.equal(update.$set.readAt instanceof Date, isRead);
      if (!isRead) assert.equal(update.$set.readAt, null);
      assert.equal(options.new, true);
      return { select() { return this; }, lean: async () => ({ _id: id, isRead }) };
    });
    const result = await call(controller.setRead, { params: { id }, body: { isRead, userId: 'other' } });
    assert.equal(result.data.isRead, isRead);
  }
  assert.equal((await call(controller.setRead, { params: { id }, body: { isRead: 'false' } })).status, 400);
  assert.equal((await call(controller.remove, { params: { id: 'invalid' } })).status, 400);
});

test('missing or another customer notification cannot be changed or deleted', async (t) => {
  t.mock.method(Notification, 'findOneAndUpdate', (filter) => {
    assert.deepEqual(filter, { userId, _id: id });
    return { select() { return this; }, lean: async () => null };
  });
  t.mock.method(Notification, 'findOneAndDelete', async (filter) => {
    assert.deepEqual(filter, { userId, _id: id }); return null;
  });
  assert.equal((await call(controller.setRead, { params: { id }, body: { isRead: true } })).status, 404);
  assert.equal((await call(controller.remove, { params: { id } })).status, 404);
});

test('bulk changes stay within the customer and clearing read items preserves unread notifications', async (t) => {
  t.mock.method(Notification, 'updateMany', async (filter, update) => {
    assert.deepEqual(filter, { userId, isRead: { $ne: true } });
    assert.equal(update.$set.isRead, true);
  });
  t.mock.method(Notification, 'deleteMany', async (filter) => {
    assert.deepEqual(filter, { userId, isRead: true });
  });
  assert.equal((await call(controller.markAllRead)).success, true);
  assert.equal((await call(controller.clearRead)).success, true);
});

test('customer notification routes require authentication and reject other roles', async (t) => {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'notification-test';
  t.after(() => { if (previous === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous; });
  t.mock.method(User, 'findById', async () => ({ _id: userId, role: 'BUSINESS_OWNER', status: 'ACTIVE', tokenVersion: 0 }));
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}/api/customer/notifications`;
  assert.equal((await fetch(url)).status, 401);
  const token = jwt.sign({ userId, tokenVersion: 0 }, process.env.JWT_SECRET);
  assert.equal((await fetch(url, { headers: { Authorization: `Bearer ${token}` } })).status, 403);
});
