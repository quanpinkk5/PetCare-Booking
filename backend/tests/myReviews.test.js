const assert = require('node:assert/strict');
const { test } = require('node:test');
const controller = require('../src/controllers/customer/reviewController');
const Review = require('../src/models/Review');
const Booking = require('../src/models/Booking');
const BranchService = require('../src/models/BranchService');
const Branch = require('../src/models/Branch');
const Business = require('../src/models/Business');
const Service = require('../src/models/Service');
const userId = '507f1f77bcf86cd799439011';
const bookingId = '507f1f77bcf86cd799439012';
const reviewId = '507f1f77bcf86cd799439013';
const chain = (data) => ({ select() { return this; }, populate() { return this; }, sort() { return this; }, lean: async () => data });
const call = async (handler, body, id = reviewId) => {
  let result;
  await handler({ user: { _id: userId, role: 'CUSTOMER' }, params: { id }, body }, {
    code: 200, status(code) { this.code = code; return this; }, json(data) { result = { status: this.code, ...data }; },
  }, (error) => { throw error; });
  return result;
};
test('my reviews only returns visible owned reviews and derives persisted helpful state', async (t) => {
  t.mock.method(Review, 'find', (filter) => {
    assert.deepEqual(filter, { customerId: userId, status: 'VISIBLE' });
    return chain([{ _id: reviewId, likedBy: [userId], rating: 5 }]);
  });
  const result = await call(controller.getMyReviews);
  assert.equal(result.data[0].likesCount, 1); assert.equal(result.data[0].isLiked, true);
  assert.equal(result.data[0].likedBy, undefined);
});
test('pending reviews require owned completed bookings and exclude all existing reviews including hidden', async (t) => {
  t.mock.method(Review, 'find', (filter) => { assert.deepEqual(filter, { customerId: userId }); return chain([{ bookingId }]); });
  t.mock.method(Booking, 'find', (filter) => {
    assert.deepEqual(filter, { customerId: userId, status: 'COMPLETED', _id: { $nin: [bookingId] } }); return chain([]);
  });
  assert.deepEqual((await call(controller.getPendingReviews)).data, []);
});
test('create validates and resolves the authenticated completed booking before writing', async (t) => {
  t.mock.method(Booking, 'findOne', (filter) => { assert.deepEqual(filter, { _id: bookingId, customerId: userId }); return chain({ _id: bookingId, branchServiceId: 'offering', status: 'COMPLETED' }); });
  t.mock.method(Review, 'findOne', () => chain(null));
  t.mock.method(BranchService, 'findById', () => chain({ branchId: 'branch', serviceId: 'service' }));
  t.mock.method(Branch, 'findById', () => chain({ _id: 'branch', businessId: 'business' }));
  t.mock.method(Business, 'findById', () => chain({ _id: 'business' }));
  t.mock.method(Service, 'findOne', (filter) => { assert.deepEqual(filter, { _id: 'service', businessId: 'business' }); return chain({ _id: 'service' }); });
  t.mock.method(Review, 'create', async (data) => {
    assert.equal(data.customerId, userId); assert.equal(data.status, 'VISIBLE');
    assert.equal(data.businessId, 'business'); assert.equal(data.isAnonymous, true);
    assert.equal(data.comment, 'Trải nghiệm tốt'); assert.deepEqual(data.subRatings, { care: 4 });
    return { _id: reviewId, ...data };
  });
  assert.equal((await call(controller.createReview, { bookingId, rating: 4, comment: ' Trải nghiệm tốt ', isAnonymous: true, subRatings: { care: 4 }, tags: ['Tốt'], images: ['https://example.com/photo.jpg'] })).status, 201);
});
test('invalid or privileged fields are rejected before writes', async (t) => {
  const create = t.mock.method(Review, 'create', () => { throw new Error('Unexpected write'); });
  for (const extra of [{ rating: 0 }, { rating: 2.5 }, { businessId: 'fake' }, { status: 'HIDDEN' }, { businessReply: {} }, { images: ['blob:temporary'] }, { subRatings: { care: 6 } }, { tags: ['x'.repeat(101)] }, { isAnonymous: 'true' }]) {
    assert.equal((await call(controller.createReview, { bookingId, rating: 5, ...extra })).status, 400);
  }
  assert.equal((await call(controller.createReview, null)).status, 400);
  assert.equal(create.mock.callCount(), 0);
});
test('another customer booking, incomplete booking and duplicate reviews cannot be reviewed', async (t) => {
  const booking = t.mock.method(Booking, 'findOne', () => chain(null));
  assert.equal((await call(controller.createReview, { bookingId, rating: 5 })).status, 404);
  booking.mock.mockImplementation(() => chain({ _id: bookingId, status: 'PENDING' }));
  assert.equal((await call(controller.createReview, { bookingId, rating: 5 })).status, 400);
  booking.mock.mockImplementation(() => chain({ _id: bookingId, status: 'COMPLETED' }));
  t.mock.method(Review, 'findOne', () => chain({ _id: reviewId }));
  assert.equal((await call(controller.createReview, { bookingId, rating: 5 })).status, 409);
});
test('edit and delete always require ownership and visible status', async (t) => {
  t.mock.method(Review, 'findOneAndUpdate', async (filter, update) => {
    assert.deepEqual(filter, { _id: reviewId, customerId: userId, status: 'VISIBLE' });
    return { _id: reviewId, ...update.$set };
  });
  assert.equal((await call(controller.updateReview, { rating: 3, comment: 'Góp ý' })).status, 200);
  assert.equal((await call(controller.deleteReview)).data.status, 'HIDDEN');
});
test('helpful sets a desired state atomically instead of double toggling on retries', async (t) => {
  t.mock.method(Review, 'findOneAndUpdate', (filter, update) => {
    assert.equal(filter.customerId, userId);
    assert.deepEqual(update, { $addToSet: { likedBy: userId } });
    return chain({ _id: reviewId, likedBy: [userId] });
  });
  assert.equal((await call(controller.setHelpful, { liked: true })).data.isLiked, true);
});
