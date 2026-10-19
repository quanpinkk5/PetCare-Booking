const assert = require('node:assert/strict');
const { test } = require('node:test');
const Business = require('../src/models/Business');
const Review = require('../src/models/Review');
const routes = require('../src/routes/public/reviewRoutes');
const id = '507f1f77bcf86cd799439011';

const get = (query = {}, businessId = id) => new Promise((resolve, reject) => {
  const req = { method: 'GET', url: `/businesses/${businessId}/reviews`, query, headers: {} };
  const res = { code: 200, status(code) { this.code = code; return this; }, json(data) { resolve({ status: this.code, ...data }); } };
  routes.handle(req, res, (error) => reject(error || new Error('Route did not respond')));
});
const approved = (t, exists = true) => t.mock.method(Business, 'findOne', (filter) => {
  assert.deepEqual(filter, { _id: id, status: 'APPROVED' });
  return { select() { return this; }, lean: async () => exists ? { _id: id } : null };
});
const reviewQuery = (result, checks = {}) => ({
  select(fields) { assert.ok(!fields.includes('bookingId')); return this; },
  populate(field, fields) {
    assert.ok(['customerId', 'branchId', 'serviceId'].includes(field));
    assert.ok(!fields.includes('email') && !fields.includes('phone')); return this;
  },
  sort(value) { checks.sort?.(value); return this; },
  skip(value) { checks.skip?.(value); return this; },
  limit(value) { checks.limit?.(value); return this; },
  lean: async () => result,
});

test('public business reviews are scoped, hide private IDs and include actual rating statistics', async (t) => {
  approved(t);
  t.mock.method(Review, 'find', (filter) => {
    assert.deepEqual(filter, { businessId: id, status: 'VISIBLE' });
    return reviewQuery([{
      _id: 'review-1', rating: 5, comment: 'Dịch vụ tốt', images: ['photo.png'], createdAt: '2026-01-01',
      customerId: { _id: 'private-user', fullName: 'Nguyễn An', avatar: 'avatar.png' },
      branchId: { _id: 'branch-1', name: 'Chi nhánh A' }, serviceId: { name: 'Tắm' },
      bookingId: 'private-booking', businessReply: { content: 'Cảm ơn bạn', repliedAt: '2026-01-02', repliedBy: 'private-staff' },
    }]);
  });
  t.mock.method(Review, 'countDocuments', async (filter) => {
    assert.deepEqual(filter, { businessId: id, status: 'VISIBLE' }); return 3;
  });
  t.mock.method(Review, 'aggregate', async (pipeline) => {
    assert.equal(pipeline[0].$match.businessId.toString(), id);
    assert.equal(pipeline[0].$match.status, 'VISIBLE');
    return [{ _id: 5, count: 2 }, { _id: 2, count: 1 }];
  });
  const response = await get();
  assert.equal(response.status, 200);
  assert.equal(response.summary.averageRating, 4);
  assert.equal(response.summary.totalReviews, 3);
  assert.equal(response.summary.distribution[0].count, 2);
  assert.deepEqual(response.data[0].customer, { fullName: 'Nguyễn An', avatar: 'avatar.png' });
  assert.deepEqual(response.data[0].branch, { name: 'Chi nhánh A' });
  assert.equal(response.data[0].bookingId, undefined);
  assert.equal(response.data[0].customerId, undefined);
  assert.equal(response.data[0].businessReply.repliedBy, undefined);
});

test('rating and sort filters paginate the list while summary covers all visible business reviews', async (t) => {
  approved(t);
  t.mock.method(Review, 'find', (filter) => {
    assert.deepEqual(filter, { businessId: id, status: 'VISIBLE', rating: 5 });
    return reviewQuery([], {
      sort: (value) => assert.deepEqual(value, { rating: 1, createdAt: -1, _id: -1 }),
      skip: (value) => assert.equal(value, 5), limit: (value) => assert.equal(value, 5),
    });
  });
  t.mock.method(Review, 'countDocuments', async (filter) => { assert.equal(filter.rating, 5); return 6; });
  t.mock.method(Review, 'aggregate', async (pipeline) => {
    assert.equal(pipeline[0].$match.rating, undefined);
    return [{ _id: 5, count: 6 }, { _id: 4, count: 2 }];
  });
  const response = await get({ page: '2', limit: '5', rating: '5', sort: 'lowest' });
  assert.deepEqual(response.pagination, { page: 2, limit: 5, total: 6, totalPages: 2 });
  assert.equal(response.summary.totalReviews, 8);
  assert.equal(response.summary.averageRating, 4.8);
});

test('unknown or unapproved business cannot expose reviews', async (t) => {
  approved(t, false);
  const find = t.mock.method(Review, 'find', () => { throw new Error('Unexpected query'); });
  assert.equal((await get()).status, 404);
  assert.equal(find.mock.callCount(), 0);
});

test('invalid IDs and filters fail before reading the database', async (t) => {
  const find = t.mock.method(Business, 'findOne', () => { throw new Error('Unexpected query'); });
  assert.equal((await get({}, 'invalid')).status, 400);
  for (const query of [{ page: '0' }, { page: '1.5' }, { limit: '51' }, { rating: '6' }, { rating: '1.5' }, { sort: '__proto__' }]) {
    assert.equal((await get(query)).status, 400);
  }
  assert.equal(find.mock.callCount(), 0);
});

test('no reviews and deleted related records produce honest empty or neutral values', async (t) => {
  approved(t);
  t.mock.method(Review, 'find', () => reviewQuery([{ _id: 'review-1', rating: 3, customerId: null, branchId: null, serviceId: null }]));
  t.mock.method(Review, 'countDocuments', async () => 1);
  t.mock.method(Review, 'aggregate', async () => []);
  const response = await get();
  assert.equal(response.summary.averageRating, 0);
  assert.equal(response.summary.totalReviews, 0);
  assert.equal(response.data[0].customer.fullName, 'Khách hàng');
  assert.equal(response.data[0].service.name, '');
  assert.deepEqual(response.data[0].images, []);
  assert.equal(response.data[0].businessReply, null);
});
