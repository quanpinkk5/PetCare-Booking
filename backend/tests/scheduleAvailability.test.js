const assert = require('node:assert/strict');
const { test } = require('node:test');
const BranchService = require('../src/models/BranchService');
const Branch = require('../src/models/Branch');
const Business = require('../src/models/Business');
const Schedule = require('../src/models/Schedule');
const ScheduleException = require('../src/models/ScheduleException');
const Booking = require('../src/models/Booking');
const { getAvailableSlots } = require('../src/controllers/public/availabilityController');
const { getSchedules } = require('../src/controllers/businessOwner/schedulesController');
const { normalizeScheduleSlot } = require('../src/utils/scheduleSlots');
const id = '507f1f77bcf86cd799439011';
const chain = (data) => ({
  select() { return this; }, lean: async () => data,
  then(resolve, reject) { return Promise.resolve(data).then(resolve, reject); },
});
async function call(handler, query) {
  let result;
  await handler({ query, user: { _id: 'owner' } }, {
    code: 200, status(code) { this.code = code; return this; },
    json(data) { result = { code: this.code, ...data }; },
  });
  return result;
}
function mockAvailability(t, { slots = [], exceptions = [], bookings = [], capacity = 5 } = {}) {
  t.mock.method(BranchService, 'findById', () => chain({ status: 'ACTIVE', capacity }));
  t.mock.method(Schedule, 'findOne', (filter) => {
    assert.equal(filter.branchServiceId, id);
    assert.equal(filter.dayOfWeek, 'MONDAY');
    assert.equal(filter.isActive, true);
    return chain({ slots });
  });
  t.mock.method(ScheduleException, 'find', (filter) => {
    assert.equal(filter.date.$gte.toISOString(), '2026-11-02T00:00:00.000Z');
    return chain(exceptions);
  });
  t.mock.method(Booking, 'find', (filter) => {
    assert.equal(filter.branchServiceId, id);
    assert.equal(filter.bookingType, 'APPOINTMENT');
    assert.equal(filter.status.$ne, 'CANCELLED');
    assert.equal(filter.bookingDate.$gte.toISOString(), '2026-11-01T17:00:00.000Z');
    return chain(bookings);
  });
}
const query = { branchServiceId: id, date: '2026-11-02' };

test('legacy template and actual calendar read the same capacity and status without modifying data', async (t) => {
  const slots = [{ startTime: '08:00', endTime: '12:00' }, { startTime: '13:30', endTime: '18:30', capacity: null }];
  mockAvailability(t, { slots, bookings: [{ startTime: '17:00', endTime: '17:30' }] });
  const actual = await call(getAvailableSlots, query);
  assert.equal(actual.code, 200);
  assert.deepEqual(actual.data.slots.map((slot) => [slot.capacity, slot.bookedCount, slot.status, slot.isAvailable]),
    [[5, 0, 'AVAILABLE', true], [5, 1, 'AVAILABLE', true]]);
  t.mock.method(Branch, 'findById', () => chain({ businessId: 'business' }));
  t.mock.method(Business, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: 'business', ownerId: 'owner' }); return chain({});
  });
  t.mock.method(Schedule, 'find', () => chain([{ dayOfWeek: 'MONDAY', slots }]));
  const template = await call(getSchedules, { branchServiceId: id });
  assert.equal(template.code, 200);
  assert.deepEqual(template.data.schedules[0].slots.map((slot) => slot.capacity), [5, 5]);
  assert.ok(template.data.schedules[0].slots.every((slot) => slot.status === 'AVAILABLE'));
  assert.equal(slots[0].capacity, undefined);
  assert.equal(slots[0].status, undefined);
});

test('configured zero, full, maintenance, off and blocked states are preserved', async (t) => {
  mockAvailability(t, { slots: [
    { startTime: '08:00', endTime: '09:00', capacity: 1 },
    { startTime: '09:00', endTime: '10:00', capacity: 0 },
    { startTime: '10:00', endTime: '11:00', status: 'MAINTENANCE' },
    { startTime: '11:00', endTime: '12:00', status: 'OFF' },
    { startTime: '13:00', endTime: '14:00' },
  ], bookings: [{ startTime: '08:00', endTime: '08:30' }],
  exceptions: [{ type: 'BLOCK_SLOT', startTime: '13:30', endTime: '13:45' }] });
  const { data } = await call(getAvailableSlots, query);
  assert.deepEqual(data.slots.map((slot) => slot.status), ['FULL', 'FULL', 'MAINTENANCE', 'OFF', 'BLOCKED']);
  assert.ok(data.slots.every((slot) => !slot.isAvailable));
});

test('custom hours replace weekly hours; closed days contain no slots', async (t) => {
  mockAvailability(t, { slots: [{ startTime: '08:00', endTime: '12:00' }],
    exceptions: [{ type: 'CUSTOM_HOURS', startTime: '09:00', endTime: '10:00', capacity: 2 }] });
  const { data } = await call(getAvailableSlots, query);
  assert.equal(data.source, 'CUSTOM_HOURS');
  assert.equal(data.slots.length, 1);
  assert.equal(data.slots[0].capacity, 2);
  assert.equal(data.slots[0].startTime, '09:00');
  t.mock.method(ScheduleException, 'find', () => chain([{ type: 'CLOSED' }]));
  const closed = await call(getAvailableSlots, query);
  assert.equal(closed.data.isClosed, true);
  assert.deepEqual(closed.data.slots, []);
});

test('missing configuration is distinct from full capacity and invalid dates fail before database reads', async (t) => {
  mockAvailability(t, { slots: [{ startTime: '08:00', endTime: '12:00' }], capacity: null });
  const { data } = await call(getAvailableSlots, query);
  assert.equal(data.slots[0].status, 'UNCONFIGURED');
  assert.equal(data.slots[0].capacity, null);
  assert.equal(data.slots[0].isAvailable, false);
  assert.equal((await call(getAvailableSlots, { ...query, date: '2026-02-30' })).code, 400);
  assert.equal((await call(getSchedules, { branchServiceId: 'invalid' })).code, 400);
  assert.equal(normalizeScheduleSlot({ capacity: 0, status: 'OFF' }, 5).capacity, 0);
});

test('template cannot expose another owner schedule', async (t) => {
  t.mock.method(BranchService, 'findById', () => chain({ branchId: 'branch' }));
  t.mock.method(Branch, 'findById', () => chain({ businessId: 'foreign-business' }));
  t.mock.method(Business, 'findOne', (filter) => {
    assert.equal(filter.ownerId, 'owner'); return chain(null);
  });
  const read = t.mock.method(Schedule, 'find', () => { throw Error('unexpected read'); });
  assert.equal((await call(getSchedules, { branchServiceId: id })).code, 404);
  assert.equal(read.mock.callCount(), 0);
});
