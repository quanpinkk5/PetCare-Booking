const assert = require('node:assert/strict');
const { test } = require('node:test');
const Booking = require('../src/models/Booking');
const Pet = require('../src/models/Pet');
const Branch = require('../src/models/Branch');
const Service = require('../src/models/Service');
const BranchService = require('../src/models/BranchService');
const controller = require('../src/controllers/customer/bookingController');
const customerId = '507f1f77bcf86cd799439011';
const id = '507f1f77bcf86cd799439012';
const call = async (handler, query = {}, params = {}) => {
  let response;
  await handler({ user: { _id: customerId, role: 'CUSTOMER' }, query, params }, {
    code: 200, status(code) { this.code = code; return this; }, json(data) { response = { status: this.code, ...data }; },
  }, (error) => { throw error; });
  return response;
};
const chain = (data, checks = {}) => ({
  select() { return this; }, populate() { return this; }, sort() { return this; },
  skip(value) { checks.skip?.(value); return this; }, limit(value) { checks.limit?.(value); return this; },
  lean: async () => data,
});
const stats = (t) => {
  t.mock.method(Booking, 'aggregate', async (pipeline) => {
    assert.equal(pipeline[0].$match.customerId.toString(), customerId);
    assert.equal(pipeline[0].$match.status, undefined);
    return [{ _id: 'PENDING', count: 2 }, { _id: 'COMPLETED', count: 3 }];
  });
  t.mock.method(Booking, 'countDocuments', async (filter) => {
    assert.equal(filter.customerId, customerId);
    return filter.status === 'CONFIRMED' ? 1 : 2;
  });
};
test('list is scoped to current customer, paginated, and returns global dashboard counts', async (t) => {
  stats(t);
  t.mock.method(Booking, 'find', (filter) => {
    assert.deepEqual(filter, { customerId, status: 'PENDING' });
    return chain([{ _id: id }], { skip: (value) => assert.equal(value, 4), limit: (value) => assert.equal(value, 4) });
  });
  const result = await call(controller.getAllBookings, { status: 'PENDING', page: '2', limit: '4' });
  assert.equal(result.status, 200);
  assert.equal(result.currentPage, 2);
  assert.equal(result.summary.total, 5);
  assert.equal(result.summary.statusCounts.PENDING, 2);
  assert.equal(result.summary.statusCounts.CANCELLED, 0);
  assert.equal(result.summary.upcoming, 1);
});
for (const [time, from, until] of [
  ['today', '2026-10-20', '2026-10-21'], ['week', '2026-10-19', '2026-10-26'], ['month', '2026-10-01', '2026-11-01'],
]) test(`${time} filter uses Vietnam calendar dates and overlapping boarding stays`, async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-20T03:00:00Z') });
  stats(t);
  t.mock.method(Booking, 'find', (filter) => {
    assert.equal(filter.customerId, customerId);
    assert.equal(filter.$or[0].bookingDate.$gte.toISOString().slice(0, 10), from);
    assert.equal(filter.$or[0].bookingDate.$lt.toISOString().slice(0, 10), until);
    assert.equal(filter.$or[1].checkInDate.$lt.toISOString().slice(0, 10), until);
    assert.equal(filter.$or[1].checkOutDate.$gt.toISOString().slice(0, 10), from);
    return chain([]);
  });
  assert.equal((await call(controller.getAllBookings, { time })).status, 200);
});
test('search escapes regex and matches booking code, owned pets, services and branches', async (t) => {
  stats(t);
  t.mock.method(Pet, 'find', (filter) => {
    assert.equal(filter.ownerId, customerId);
    assert.equal(filter.$or[0].name.$regex, 'Milo\\.\\*'); return chain([{ _id: 'pet-1' }]);
  });
  t.mock.method(Branch, 'find', () => chain([{ _id: 'branch-1' }]));
  t.mock.method(Service, 'find', () => chain([{ _id: 'service-1' }]));
  t.mock.method(BranchService, 'find', () => chain([{ _id: 'offering-1' }]));
  t.mock.method(Booking, 'find', (filter) => {
    assert.equal(filter.customerId, customerId);
    assert.equal(filter.$and[0].$or[0].bookingCode.$regex, 'Milo\\.\\*');
    assert.deepEqual(filter.$and[0].$or[1].petId.$in, ['pet-1']); return chain([]);
  });
  assert.equal((await call(controller.getAllBookings, { search: 'Milo.*' })).status, 200);
});
test('invalid filters fail before database access', async (t) => {
  const find = t.mock.method(Booking, 'find', () => { throw new Error('Unexpected database read'); });
  for (const query of [{ status: 'invalid' }, { page: 0 }, { limit: 101 }, { search: {} }, { time: 'year' }]) {
    assert.equal((await call(controller.getAllBookings, query)).status, 400);
  }
  assert.equal(find.mock.callCount(), 0);
});
test('detail does not expose another customer booking', async (t) => {
  t.mock.method(Booking, 'findOne', (filter) => { assert.deepEqual(filter, { _id: id, customerId }); return chain(null); });
  assert.equal((await call(controller.getBookingById, {}, { id })).status, 404);
  assert.equal((await call(controller.getBookingById, {}, { id: 'invalid' })).status, 400);
});
test('cancel requires unpaid mutable state and an atomic ownership guard', async (t) => {
  t.mock.method(Booking, 'findOne', async () => ({ status: 'CONFIRMED', paymentStatus: 'UNPAID' }));
  t.mock.method(Booking, 'findOneAndUpdate', async (filter, update) => {
    assert.equal(filter.customerId, customerId);
    assert.equal(filter.paymentStatus, 'UNPAID');
    assert.deepEqual(filter.status, { $in: ['PENDING', 'CONFIRMED'] });
    assert.equal(update.$push.statusHistory.changedBy, customerId);
    return { _id: id, status: 'CANCELLED' };
  });
  assert.equal((await call(controller.cancelBooking, {}, { id })).data.status, 'CANCELLED');
});
test('paid booking cancellation is rejected without writing', async (t) => {
  t.mock.method(Booking, 'findOne', async () => ({ status: 'CONFIRMED', paymentStatus: 'PAID' }));
  const update = t.mock.method(Booking, 'findOneAndUpdate', () => { throw new Error('Unexpected write'); });
  assert.equal((await call(controller.cancelBooking, {}, { id })).status, 409);
  assert.equal(update.mock.callCount(), 0);
});
