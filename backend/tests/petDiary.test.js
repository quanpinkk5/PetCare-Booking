const test = require('node:test');
const assert = require('node:assert/strict');
const Booking = require('../src/models/Booking');
const PetDiary = require('../src/models/PetDiary');
const { getDiary } = require('../src/controllers/customer/petDiaryController');
const customerId = '507f1f77bcf86cd799439011';
const bookingId = '507f1f77bcf86cd799439012';
const call = async (id = bookingId) => {
  let result;
  await getDiary({ user: { _id: customerId }, params: { id }, query: { customerId: 'other' } }, {
    code: 200, status(code) { this.code = code; return this; }, json(data) { result = { status: this.code, ...data }; },
  }, (error) => { throw error; });
  return result;
};
const chain = (data) => ({ select() { return this; }, populate() { return this; }, sort() { return this; }, lean: async () => data });

test('diary resolves owned booking before loading its activities and excludes staff identity', async (t) => {
  t.mock.method(Booking, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: bookingId, customerId });
    return chain({ _id: bookingId });
  });
  t.mock.method(PetDiary, 'find', (filter) => {
    assert.deepEqual(filter, { bookingId });
    return { ...chain([{ _id: 'entry', activityType: 'EATING' }]),
      select(fields) { assert.equal(fields.includes('createdBy'), false); return this; },
    };
  });
  const result = await call();
  assert.equal(result.status, 200);
  assert.equal(result.data.entries[0].activityType, 'EATING');
});

test('another customer booking and malformed IDs never expose journal entries', async (t) => {
  t.mock.method(Booking, 'findOne', () => chain(null));
  const find = t.mock.method(PetDiary, 'find', () => { throw new Error('must not query'); });
  assert.equal((await call()).status, 404);
  assert.equal((await call('invalid')).status, 400);
  assert.equal(find.mock.callCount(), 0);
});

test('bookings without journal entries return an honest empty list', async (t) => {
  t.mock.method(Booking, 'findOne', () => chain({ _id: bookingId }));
  t.mock.method(PetDiary, 'find', () => chain([]));
  assert.deepEqual((await call()).data.entries, []);
});
