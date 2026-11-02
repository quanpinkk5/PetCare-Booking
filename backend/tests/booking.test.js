const assert = require('node:assert/strict');
const { test } = require('node:test');
const mongoose = require('mongoose');
const { createBooking } = require('../src/controllers/customer/bookingController');
const { getAvailableSlots } = require('../src/controllers/customer/availableSlotsController');
const Pet = require('../src/models/Pet');
const BranchService = require('../src/models/BranchService');
const Branch = require('../src/models/Branch');
const Business = require('../src/models/Business');
const Service = require('../src/models/Service');
const Schedule = require('../src/models/Schedule');
const ScheduleException = require('../src/models/ScheduleException');
const Booking = require('../src/models/Booking');
const Notification = require('../src/models/Notification');
const NotificationSettings = require('../src/models/BusinessNotificationSettings');

const ids = {
  user: '507f1f77bcf86cd799439011', pet: '507f1f77bcf86cd799439012',
  offering: '507f1f77bcf86cd799439013', branch: '507f1f77bcf86cd799439014',
  business: '507f1f77bcf86cd799439015', service: '507f1f77bcf86cd799439016',
};
const user = { _id: ids.user, role: 'CUSTOMER' };
const appointment = { petId: ids.pet, branchServiceId: ids.offering, bookingDate: '2099-01-05', startTime: '09:00' };
const boarding = { petId: ids.pet, branchServiceId: ids.offering, checkInDate: '2099-01-05', checkOutDate: '2099-01-08' };

const invoke = async (body = appointment, auth = user, app) => {
  let response;
  let unexpected;
  const res = {
    code: 200, status(code) { this.code = code; return this; },
    json(data) { response = { status: this.code, ...data }; return this; },
  };
  await createBooking({ body, user: auth, app }, res, (error) => { unexpected = error; });
  if (unexpected) throw unexpected;
  return response;
};

const setup = (t, options = {}) => {
  const state = { activeQuery: false, created: [], ended: 0, locks: 0, committed: false };
  const offering = {
    _id: ids.offering, branchId: ids.branch, serviceId: ids.service, status: 'ACTIVE',
    petTypes: ['DOG'], price: 150000, pricingUnit: 'PER_SERVICE', durationMinutes: 60,
    capacity: 1, ...options.offering,
  };
  const session = {
    async withTransaction(callback, transactionOptions) {
      assert.deepEqual(transactionOptions, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
      if (options.transactionError) throw options.transactionError;
      try { await callback(); }
      catch (error) {
        if (!options.retry || error.code !== 112) throw error;
        offering.price = 250000;
        await callback();
      }
      state.committed = true;
    },
    async endSession() { state.ended += 1; },
  };
  const query = (result) => ({
    select() { return this; },
    session(value) { assert.equal(value, session); this.inTransaction = true; return this; },
    async lean() {
      if (!this.inTransaction) return result;
      assert.equal(state.activeQuery, false, 'Transaction queries must run sequentially');
      state.activeQuery = true;
      await Promise.resolve();
      state.activeQuery = false;
      return result;
    },
  });
  t.mock.method(mongoose, 'startSession', async () => session);
  t.mock.method(BranchService, 'findOneAndUpdate', async (filter, update, config) => {
    assert.deepEqual(filter, { _id: ids.offering, status: 'ACTIVE' });
    assert.deepEqual(update, { $inc: { bookingRevision: 1 } });
    assert.equal(config.session, session);
    assert.ok(config.returnDocument === 'after' || config.new === true, 'Lock must return the updated offering');
    state.locks += 1;
    return options.missingOffering ? null : offering;
  });
  t.mock.method(Pet, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: ids.pet, ownerId: ids.user, status: 'ACTIVE' });
    return query(options.missingPet ? null : { species: options.species || 'DOG' });
  });
  t.mock.method(Branch, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: ids.branch, status: 'ACTIVE' });
    return query(options.missingBranch ? null : { businessId: ids.business });
  });
  t.mock.method(Business, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: ids.business, status: 'APPROVED' });
    return query(options.missingBusiness ? null : { _id: ids.business, ownerId: options.ownerId });
  });
  t.mock.method(Service, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: ids.service, businessId: ids.business, status: 'ACTIVE' });
    return query(options.missingService ? null : { serviceType: options.type || 'APPOINTMENT' });
  });
  t.mock.method(Schedule, 'findOne', (filter) => {
    assert.equal(filter.isActive, true);
    assert.equal(filter.dayOfWeek, 'MONDAY');
    return query(options.noSchedule ? null : { slots: options.slots || [{ startTime: '09:00', endTime: '12:00' }] });
  });
  t.mock.method(ScheduleException, 'find', (filter) => {
    assert.equal(filter.date.$gte.toISOString(), '2099-01-05T00:00:00.000Z');
    assert.equal(filter.date.$lt.toISOString(), '2099-01-06T00:00:00.000Z');
    return query(options.exceptions || []);
  });
  t.mock.method(Booking, 'find', (filter) => {
    assert.equal(filter.branchServiceId, ids.offering);
    assert.deepEqual(filter.status, { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] });
    if (filter.bookingType === 'APPOINTMENT') {
      assert.equal(filter.bookingDate.$gte.toISOString(), '2099-01-04T17:00:00.000Z');
      assert.equal(filter.bookingDate.$lt.toISOString(), '2099-01-05T17:00:00.000Z');
    }
    return query(options.bookings || []);
  });
  t.mock.method(Booking, 'create', async (documents, config) => {
    assert.equal(config.session, session);
    if (options.retry && state.locks === 1) throw Object.assign(new Error('Write conflict'), { code: 112 });
    if (options.createError) throw options.createError;
    state.created.push(documents[0]);
    return documents.map((document) => ({ _id: '507f1f77bcf86cd799439018', ...document }));
  });
  return state;
};

test('new booking stores an owner notification in its transaction and emits only after commit', async (t) => {
  const ownerId = '507f1f77bcf86cd799439017';
  const state = setup(t, { ownerId, retry: true });
  let transaction;
  t.mock.method(NotificationSettings, 'findOne', (filter) => {
    assert.deepEqual(filter, { userId: ownerId });
    return { select(field) { assert.equal(field, 'notifyNewBooking'); return this; },
      session(session) { transaction = session; return this; }, lean: async () => null };
  });
  t.mock.method(Notification, 'create', async ([data], options) => {
    assert.equal(options.session, transaction);
    assert.equal(state.committed, false);
    assert.equal(data.userId, ownerId);
    assert.equal(data.type, 'BOOKING_REQUESTED');
    assert.equal(data.referenceId, '507f1f77bcf86cd799439018');
    assert.equal(data.metadata.bookingId, state.created[0].bookingCode);
    assert.equal(data.metadata.totalPrice, 250000);
    return [{ _id: 'notification-id', ...data }];
  });
  const events = [];
  const io = { to(room) { return { emit(event, data) {
    assert.equal(state.committed, true);
    events.push({ room, event, data });
  } }; } };
  assert.equal((await invoke(appointment, user, { get: () => io })).status, 201);
  assert.equal(events.length, 1);
  assert.equal(events[0].room, `user:${ownerId}`);
  assert.equal(events[0].event, 'notification:new');
});

test('disabled booking preference suppresses notifications without rejecting the booking', async (t) => {
  const ownerId = '507f1f77bcf86cd799439017';
  setup(t, { ownerId });
  t.mock.method(NotificationSettings, 'findOne', () => ({ select() { return this; }, session() { return this; }, lean: async () => ({ notifyNewBooking: false }) }));
  const create = t.mock.method(Notification, 'create', () => { throw new Error('must not create disabled notification'); });
  assert.equal((await invoke()).status, 201);
  assert.equal(create.mock.callCount(), 0);
});

test('failure to store booking notification fails the transaction and never publishes a phantom event', async (t) => {
  setup(t, { ownerId: '507f1f77bcf86cd799439017' });
  t.mock.method(NotificationSettings, 'findOne', () => ({ select() { return this; }, session() { return this; }, lean: async () => null }));
  const failure = new Error('notification insert failed');
  t.mock.method(Notification, 'create', async () => { throw failure; });
  const io = { to() { throw new Error('must not publish'); } };
  await assert.rejects(invoke(appointment, user, { get: () => io }), failure);
});

test('missing auth and malformed or client-controlled booking fields fail before opening a session', async (t) => {
  const start = t.mock.method(mongoose, 'startSession', () => { throw new Error('Unexpected transaction'); });
  assert.equal((await invoke(appointment, null)).status, 401);
  assert.equal((await invoke(appointment, { ...user, role: 'ADMIN' })).status, 403);
  for (const body of [null, [], 'invalid', {}, { ...appointment, petId: {} },
    { ...appointment, totalPrice: 1 }, { ...appointment, status: 'CONFIRMED' },
    { ...appointment, customerNote: 5 }, { ...boarding, boardingDetails: [] }]) {
    assert.equal((await invoke(body)).status, 400);
  }
  assert.equal(start.mock.callCount(), 0);
});

test('appointment uses server duration, price, owner and initial status inside one transaction', async (t) => {
  const state = setup(t);
  const response = await invoke({ ...appointment, customerNote: '  Chăm sóc nhẹ nhàng  ' });
  assert.equal(response.status, 201);
  assert.equal(response.data.endTime, '10:00');
  assert.equal(response.data.unitPrice, 150000);
  assert.equal(response.data.totalPrice, 150000);
  assert.equal(response.data.customerId, ids.user);
  assert.equal(response.data.status, 'PENDING');
  assert.equal(response.data.paymentStatus, 'UNPAID');
  assert.equal(response.data.customerNote, 'Chăm sóc nhẹ nhàng');
  assert.equal(response.data.statusHistory[0].changedBy, ids.user);
  assert.match(response.data.bookingCode, /^BK-[A-Z0-9]+-[A-F0-9]{16}$/);
  assert.equal(state.created.length, 1);
  assert.equal(state.ended, 1);
});

for (const [name, options] of [
  ['pet owned by another customer', { missingPet: true }],
  ['inactive offering', { missingOffering: true }],
  ['inactive branch', { missingBranch: true }],
  ['unapproved business', { missingBusiness: true }],
  ['inactive or unrelated service', { missingService: true }],
]) {
  test(`rejects ${name} and closes the session`, async (t) => {
    const state = setup(t, options);
    assert.equal((await invoke()).status, 404);
    assert.equal(state.created.length, 0);
    assert.equal(state.ended, 1);
  });
}

test('locked offering must support the pet species and have valid price/unit', async (t) => {
  const state = setup(t, { species: 'CAT' });
  assert.equal((await invoke()).status, 400);
  assert.equal(state.created.length, 0);
});

for (const [name, body, options, status] of [
  ['invalid date', { ...appointment, bookingDate: '2099-02-30' }, {}, 400],
  ['past date', { ...appointment, bookingDate: '2000-01-01' }, {}, 400],
  ['invalid time', { ...appointment, startTime: '24:00' }, {}, 400],
  ['unaligned slot', { ...appointment, startTime: '09:30' }, {}, 409],
  ['no schedule', appointment, { noSchedule: true }, 409],
  ['closed day', appointment, { exceptions: [{ type: 'CLOSED' }] }, 409],
  ['blocked slot', appointment, { exceptions: [{ type: 'BLOCK_SLOT', startTime: '09:00', endTime: '10:00' }] }, 409],
  ['full slot', appointment, { bookings: [{ startTime: '09:00', endTime: '10:00' }] }, 409],
  ['mixed payload', { ...appointment, checkInDate: '2099-01-05' }, {}, 400],
  ['invalid price', appointment, { offering: { price: -1 } }, 400],
  ['wrong pricing unit', appointment, { offering: { pricingUnit: 'PER_DAY' } }, 400],
]) {
  test(`appointment rejects ${name}`, async (t) => {
    const state = setup(t, options);
    assert.equal((await invoke(body)).status, status);
    assert.equal(state.created.length, 0);
    assert.equal(state.ended, 1);
  });
}

test('custom hours replace normal schedule; adjacent bookings do not occupy the slot', async (t) => {
  setup(t, { noSchedule: true,
    exceptions: [{ type: 'CUSTOM_HOURS', startTime: '09:00', endTime: '11:00', capacity: 1 }],
    bookings: [{ startTime: '08:00', endTime: '09:00' }, { startTime: '10:00', endTime: '11:00' }],
  });
  assert.equal((await invoke()).status, 201);
});

async function customerSlots(t, options = {}) {
  t.mock.method(BranchService, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: ids.offering, status: 'ACTIVE' });
    return { select() { return this; }, lean: async () => ({
      _id: ids.offering, branchId: ids.branch, serviceId: ids.service,
      durationMinutes: 60, capacity: 1, ...options.offering,
    }) };
  });
  let result;
  await getAvailableSlots({ params: { id: ids.offering }, query: { date: appointment.bookingDate } }, {
    status(code) { assert.equal(code, 200); return this; },
    json(body) { result = body.data.availableSlots; },
  }, (error) => { throw error; });
  return result;
}

test('customer slots follow owner working ranges, duration, per-range capacity and unavailable statuses', async (t) => {
  const options = { offering: { durationMinutes: 30, capacity: 5 }, slots: [
    { startTime: '09:00', endTime: '10:00', capacity: 2, status: 'AVAILABLE' },
    { startTime: '10:00', endTime: '11:00', capacity: 5, status: 'OFF' },
    { startTime: '11:00', endTime: '12:00', capacity: 5, status: 'MAINTENANCE' },
    { startTime: '13:30', endTime: '14:45', capacity: 1, status: 'AVAILABLE' },
  ], bookings: [{ startTime: '09:00', endTime: '09:30' }] };
  setup(t, options);
  const slots = await customerSlots(t, options);
  assert.deepEqual(slots.map((slot) => [slot.startTime, slot.endTime, slot.capacity, slot.remainingCapacity]), [
    ['09:00', '09:30', 2, 1], ['09:30', '10:00', 2, 2],
    ['13:30', '14:00', 1, 1], ['14:00', '14:30', 1, 1],
  ]);
  assert.equal(slots[0].workingStartTime, '09:00');
  assert.equal(slots[0].workingEndTime, '10:00');
  for (const slot of slots) {
    assert.equal((await invoke({ ...appointment, startTime: slot.startTime })).status, 201);
  }
  for (const startTime of ['10:00', '11:00', '12:00', '14:30', '09:15']) {
    assert.equal((await invoke({ ...appointment, startTime })).status, 409);
  }
});

for (const status of ['OFF', 'MAINTENANCE']) test(`owner changes selected range to ${status}: hide it and reject a stale booking`, async (t) => {
  const options = { slots: [{ startTime: '09:00', endTime: '12:00', capacity: 3, status }] };
  const state = setup(t, options);
  assert.deepEqual(await customerSlots(t, options), []);
  assert.equal((await invoke()).status, 409);
  assert.equal(state.created.length, 0);
});

test('owner range limit overrides offering capacity in both availability and booking creation', async (t) => {
  const options = { offering: { capacity: 5 },
    slots: [{ startTime: '09:00', endTime: '12:00', capacity: 1 }],
    bookings: [{ startTime: '09:00', endTime: '10:00' }] };
  const state = setup(t, options);
  const slots = await customerSlots(t, options);
  assert.ok(!slots.some((slot) => slot.startTime === '09:00'));
  assert.ok(slots.some((slot) => slot.startTime === '10:00'));
  assert.equal((await invoke()).status, 409);
  assert.equal(state.created.length, 0);
});

test('owner custom hours can increase capacity and replace an OFF template', async (t) => {
  const options = { slots: [{ startTime: '09:00', endTime: '12:00', status: 'OFF' }],
    exceptions: [{ type: 'CUSTOM_HOURS', startTime: '09:00', endTime: '11:00', capacity: 3 }],
    bookings: [{ startTime: '09:00', endTime: '10:00' }] };
  setup(t, options);
  const slots = await customerSlots(t, options);
  assert.equal(slots[0].capacity, 3);
  assert.equal(slots[0].remainingCapacity, 2);
  assert.equal((await invoke()).status, 201);
  assert.equal((await invoke({ ...appointment, startTime: '11:00' })).status, 409);
});

test('partial blocked periods remove touching appointments and reject forged selection', async (t) => {
  const options = { offering: { durationMinutes: 30 },
    exceptions: [{ type: 'BLOCK_SLOT', startTime: '09:15', endTime: '09:45', capacity: 5 }] };
  setup(t, options);
  const slots = await customerSlots(t, options);
  assert.ok(!slots.some((slot) => ['09:00', '09:30'].includes(slot.startTime)));
  assert.ok(slots.some((slot) => slot.startTime === '10:00'));
  assert.equal((await invoke()).status, 409);
});

test('closed exceptions and explicit zero capacity cannot be bypassed at submission', async (t) => {
  const options = { slots: [{ startTime: '09:00', endTime: '12:00', capacity: 0 }] };
  setup(t, options);
  assert.deepEqual(await customerSlots(t, options), []);
  assert.equal((await invoke()).status, 409);
  t.mock.method(ScheduleException, 'find', () => ({
    select() { return this; }, session() { return this; }, lean: async () => [{ type: 'CLOSED' }],
  }));
  assert.deepEqual(await customerSlots(t, options), []);
  assert.equal((await invoke()).status, 409);
});

test('boarding calculates days and total from the locked daily price', async (t) => {
  setup(t, { type: 'BOARDING', offering: { pricingUnit: 'PER_DAY' } });
  const result = await invoke({ ...boarding, boardingDetails: { feedingNotes: 'Ăn hạt' } });
  assert.equal(result.status, 201);
  assert.equal(result.data.numberOfDays, 3);
  assert.equal(result.data.totalPrice, 450000);
  assert.equal(result.data.boardingDetails.feedingNotes, 'Ăn hạt');
  assert.equal(result.data.bookingDate, undefined);
});

test('boarding checks each occupied day and excludes check-out day', async (t) => {
  const state = setup(t, { type: 'BOARDING', offering: { pricingUnit: 'PER_DAY' }, bookings: [{
    checkInDate: new Date('2099-01-06'), checkOutDate: new Date('2099-01-07'),
  }] });
  assert.equal((await invoke(boarding)).status, 409);
  assert.equal(state.created.length, 0);
});

test('boarding can begin when an earlier stay checks out', async (t) => {
  setup(t, { type: 'BOARDING', offering: { pricingUnit: 'PER_DAY' }, bookings: [{
    checkInDate: new Date('2099-01-01'), checkOutDate: new Date('2099-01-05'),
  }] });
  assert.equal((await invoke(boarding)).status, 201);
});

test('boarding rejects reversed dates, long stays and appointment fields', async (t) => {
  const state = setup(t, { type: 'BOARDING', offering: { pricingUnit: 'PER_DAY' } });
  for (const body of [
    { ...boarding, checkOutDate: boarding.checkInDate },
    { ...boarding, checkOutDate: '2099-05-01' },
    { ...boarding, startTime: '09:00' },
  ]) assert.equal((await invoke(body)).status, 400);
  assert.equal(state.created.length, 0);
});

test('transaction retry re-locks and uses the latest offering price', async (t) => {
  const state = setup(t, { retry: true });
  const response = await invoke();
  assert.equal(response.status, 201);
  assert.equal(response.data.totalPrice, 250000);
  assert.equal(state.locks, 2);
  assert.equal(state.created.length, 1);
  assert.equal(state.ended, 1);
});

test('unsupported transactions return a clear error and never insert without a transaction', async (t) => {
  const state = setup(t, { transactionError: Object.assign(new Error('Standalone MongoDB'), { code: 20 }) });
  const response = await invoke();
  assert.equal(response.status, 503);
  assert.match(response.message, /replica set/);
  assert.equal(state.created.length, 0);
  assert.equal(state.ended, 1);
});

test('database validation failures return JSON and always close the session', async (t) => {
  const state = setup(t, { createError: Object.assign(new Error('Invalid booking'), { name: 'ValidationError' }) });
  assert.equal((await invoke()).status, 400);
  assert.equal(state.ended, 1);
});

test('driver-wrapped retryable writes error inside transaction reports the underlying unsupported transaction', async (t) => {
  const originalError = Object.assign(new Error('Transaction numbers are only allowed on a replica set member or mongos'), { code: 20, codeName: 'IllegalOperation' });
  const wrapped = new mongoose.mongo.MongoServerError({
    message: 'This MongoDB deployment does not support retryable writes. Please add retryWrites=false to your connection string.',
    originalError,
  });
  assert.equal(wrapped.code, undefined);
  const state = setup(t, { transactionError: wrapped });
  const result = await invoke();
  assert.equal(result.status, 503);
  assert.match(result.message, /replica set/);
  assert.equal(state.created.length, 0);
  assert.equal(state.ended, 1);
});

test('unexpected database failures reach the error handler after session cleanup', async (t) => {
  const error = new Error('Database unavailable');
  const state = setup(t, { createError: error });
  await assert.rejects(invoke(), (received) => received === error);
  assert.equal(state.created.length, 0);
  assert.equal(state.ended, 1);
});
