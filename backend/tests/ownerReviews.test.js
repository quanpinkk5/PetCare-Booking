const test = require('node:test');
const assert = require('node:assert/strict');
const Business = require('../src/models/Business');
const Review = require('../src/models/Review');
const controller = require('../src/controllers/businessOwner/reviewController');
const ownerId = '507f1f77bcf86cd799439011';
const businessId = '507f1f77bcf86cd799439012';
const reviewId = '507f1f77bcf86cd799439013';
const query = (result) => ({ select() { return this; }, populate() { return this; }, sort() { return this; }, lean: async () => result });
const business = (t, result = { _id: businessId, name: 'Real business' }) => t.mock.method(Business, 'findOne', (filter) => {
  assert.deepEqual(filter, { ownerId }); return query(result);
});
const call = async (handler, overrides = {}) => {
  let result;
  await handler({ user: { _id: ownerId }, params: { id: reviewId }, body: {}, ...overrides }, {
    code: 200, status(code) { this.code = code; return this; }, json(body) { result = { code: this.code, ...body }; },
  }, (err) => { throw err; });
  return result;
};

test('owner review list uses authenticated business and strips anonymous identity and pet details', async (t) => {
  business(t);
  t.mock.method(Review, 'find', (filter) => {
    assert.deepEqual(filter, { businessId });
    return query([{ _id: reviewId, isAnonymous: true, customerId: { fullName: 'Private' }, bookingId: { petId: { name: 'Private pet' } } }, { _id: 'visible', customerId: { fullName: 'An' } }]);
  });
  const result = await call(controller.getReviews, { query: { businessId: 'other' } });
  assert.equal(result.data[0].customerId, null);
  assert.equal(result.data[0].bookingId, null);
  assert.equal(result.data[1].customerId.fullName, 'An');
});

test('missing business returns empty reviews and disallows writes', async (t) => {
  business(t, null);
  t.mock.method(Review, 'find', () => { throw new Error('must not query'); });
  t.mock.method(Review, 'findOneAndUpdate', () => { throw new Error('must not write'); });
  assert.deepEqual((await call(controller.getReviews)).data, []);
  assert.equal((await call(controller.replyReview, { body: { content: 'Hello' } })).code, 404);
});

test('reply writes only business reply, authenticates author and returns the saved populated review', async (t) => {
  business(t);
  t.mock.method(Review, 'findOneAndUpdate', (filter, update, options) => {
    assert.deepEqual(filter, { _id: reviewId, businessId, status: 'VISIBLE' });
    assert.equal(update.$set['businessReply.content'], 'Cảm ơn');
    assert.equal(update.$set['businessReply.repliedBy'], ownerId);
    assert.ok(update.$set['businessReply.repliedAt'] instanceof Date);
    assert.equal(Object.keys(update.$set).length, 3);
    assert.equal(options.runValidators, true);
    assert.equal(options.returnDocument, 'after');
    return query({ _id: reviewId, businessReply: { content: 'Cảm ơn' } });
  });
  const result = await call(controller.replyReview, { body: { content: ' Cảm ơn ' } });
  assert.equal(result.data.businessReply.content, 'Cảm ơn');
});

test('foreign or moderated reviews cannot be replied to', async (t) => {
  business(t);
  t.mock.method(Review, 'findOneAndUpdate', (filter) => {
    assert.equal(filter.businessId, businessId);
    assert.equal(filter.status, 'VISIBLE');
    return query(null);
  });
  assert.equal((await call(controller.replyReview, { body: { content: 'Hello' } })).code, 404);
});

test('owner hide and restore persist management preference without changing public moderation', async (t) => {
  business(t);
  let expectedHidden = true;
  t.mock.method(Review, 'findOneAndUpdate', (filter, update) => {
    assert.deepEqual(filter, { _id: reviewId, businessId });
    assert.deepEqual(update, { $set: { ownerHidden: expectedHidden } });
    return query({ _id: reviewId, status: 'HIDDEN', ownerHidden: expectedHidden });
  });
  assert.equal((await call(controller.hideReview, { body: { hidden: true } })).data.ownerHidden, true);
  expectedHidden = false;
  const restored = await call(controller.hideReview, { body: { hidden: false } });
  assert.equal(restored.data.ownerHidden, false);
  assert.equal(restored.data.status, 'HIDDEN');
});

test('reply and hide reject invalid payloads and protected fields before database access', async (t) => {
  t.mock.method(Business, 'findOne', () => { throw new Error('must not query'); });
  for (const body of [{}, { content: '' }, { content: '  ' }, { content: 1 }, { content: 'x'.repeat(3001) }, { content: 'ok', rating: 5 }, { content: 'ok', businessId: 'other' }]) {
    assert.equal((await call(controller.replyReview, { body })).code, 400);
  }
  for (const body of [{ hidden: 'true' }, { hidden: true, status: 'VISIBLE' }, []]) {
    assert.equal((await call(controller.hideReview, { body })).code, 400);
  }
  assert.equal((await call(controller.replyReview, { params: { id: 'invalid' }, body: { content: 'ok' } })).code, 400);
});

test('database errors reach the error handler', async (t) => {
  const failure = new Error('database unavailable');
  t.mock.method(Business, 'findOne', () => { throw failure; });
  await assert.rejects(call(controller.getReviews), failure);
});

test('all owner review routes require authentication and the owner role', () => {
  const router = require('../src/routes/businessOwner/reviewRoutes');
  for (const layer of router.stack.filter((item) => item.route)) {
    assert.equal(layer.route.stack.length, 3);
    let status;
    layer.route.stack[1].handle({ user: { role: 'CUSTOMER' } }, { status(code) { status = code; return this; }, json() {} }, () => { throw new Error('must reject'); });
    assert.equal(status, 403);
  }
});
