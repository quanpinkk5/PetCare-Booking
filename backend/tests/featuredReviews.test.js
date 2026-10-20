const assert = require('node:assert/strict');
const { test } = require('node:test');
const Review = require('../src/models/Review');
const routes = require('../src/routes/public/reviewRoutes');
const get = () => new Promise((resolve, reject) => {
  routes.handle({ method: 'GET', url: '/reviews/featured', headers: {} }, {
    status(code) { this.code = code; return this; },
    json(data) { resolve({ status: this.code, ...data }); },
  }, (error) => reject(error || new Error('Route did not respond')));
});

test('homepage reviews are public, latest first, visible and limited after business and completed booking eligibility', async (t) => {
  t.mock.method(Review, 'aggregate', async (pipeline) => {
    assert.deepEqual(pipeline[0], { $match: { status: 'VISIBLE' } });
    assert.deepEqual(pipeline[1], { $sort: { createdAt: -1, _id: -1 } });
    const business = pipeline.find((stage) => stage.$lookup?.from === 'businesses').$lookup;
    assert.deepEqual(business.pipeline[0], { $match: { status: 'APPROVED' } });
    const booking = pipeline.find((stage) => stage.$lookup?.from === 'bookings').$lookup;
    assert.equal(booking.pipeline[0].$match.status, 'COMPLETED');
    assert.deepEqual(booking.pipeline[0].$match.$expr.$and, [
      { $eq: ['$_id', '$$bookingId'] }, { $eq: ['$customerId', '$$customerId'] },
    ]);
    const limitIndex = pipeline.findIndex((stage) => stage.$limit);
    assert.equal(pipeline[limitIndex].$limit, 3);
    assert.deepEqual(pipeline[limitIndex - 1], { $unwind: '$booking' });
    assert.ok(pipeline.findIndex((stage) => stage.$unwind === '$business') < limitIndex);
    assert.deepEqual(pipeline.at(-1).$project.customer.$cond.slice(0, 2), [
      '$isAnonymous', { fullName: 'Khách hàng ẩn danh', avatar: '' },
    ]);
    return [{ _id: 'review', rating: 2, comment: 'Cần cải thiện', createdAt: '2026-10-20',
      customer: { fullName: 'An', avatar: '', _id: 'private-user', email: 'private-email' },
      service: { name: 'Tắm' }, business: { _id: 'business', name: 'Pet Spa' },
      bookingId: 'private-booking', customerId: 'private-id', likedBy: ['private-id'] }];
  });
  const response = await get();
  assert.equal(response.status, 200);
  assert.deepEqual(response.data[0], { _id: 'review', rating: 2, comment: 'Cần cải thiện', createdAt: '2026-10-20',
    customer: { fullName: 'An', avatar: '' }, service: { name: 'Tắm' },
    business: { _id: 'business', name: 'Pet Spa' }, verified: true });
});

test('homepage reviews return an honest empty list and handle removed customer and service', async (t) => {
  t.mock.method(Review, 'aggregate', async () => []);
  assert.deepEqual((await get()).data, []);
  t.mock.method(Review, 'aggregate', async () => [{ _id: 'review', rating: 3, business: { _id: 'business', name: 'Spa' } }]);
  const response = await get();
  assert.deepEqual(response.data[0].customer, { fullName: 'Khách hàng', avatar: '' });
  assert.deepEqual(response.data[0].service, { name: '' });
  assert.equal(response.data[0].comment, '');
});

test('homepage review database errors reach the error handler instead of returning fake reviews', async (t) => {
  t.mock.method(Review, 'aggregate', async () => { throw new Error('Database unavailable'); });
  await assert.rejects(get(), /Database unavailable/);
});
