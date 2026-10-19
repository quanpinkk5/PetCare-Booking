const assert = require('node:assert/strict');
const { test } = require('node:test');
const mongoose = require('mongoose');
const { createBooking } = require('../src/controllers/customer/bookingController');
const Pet = require('../src/models/Pet');
const BranchService = require('../src/models/BranchService');
const Branch = require('../src/models/Branch');
const Business = require('../src/models/Business');
const Service = require('../src/models/Service');
const Schedule = require('../src/models/Schedule');
const ScheduleException = require('../src/models/ScheduleException');
const Booking = require('../src/models/Booking');

const ids = {
  user: '507f1f77bcf86cd799439011', pet: '507f1f77bcf86cd799439012',
  offering: '507f1f77bcf86cd799439013', branch: '507f1f77bcf86cd799439014',
  business: '507f1f77bcf86cd799439015', service: '507f1f77bcf86cd799439016',
};
const user = { _id: ids.user, role: 'CUSTOMER' };
const appointment = { petId: ids.pet, branchServiceId: ids.offering, bookingDate: '2099-01-05', startTime: '09:00' };
const boarding = { petId: ids.pet, branchServiceId: ids.offering, checkInDate: '2099-01-05', checkOutDate: '2099-01-08' };

const invoke = async (body = appointment, auth = user) => {
  let response;
  let unexpected;
  const res = {
    code: 200, status(code) { this.code = code; return this; },
    json(data) { response = { status: this.code, ...data }; return this; },
  };
  await createBooking({ body, user: auth }, res, (error) => { unexpected = error; });
  if (unexpected) throw unexpected;
  return response;
};

const setup = (t, options = {}) => {
  const state = { activeQuery: false, created: [], ended: 0, locks: 0 };
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
    },
    async endSession() { state.ended += 1; },
  };
  const query = (result) => ({
    session(value) { assert.equal(value, session); return this; },
    async lean() {
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
    return query(options.missingBusiness ? null : { _id: ids.business });
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
  t.mock.method(ScheduleException, 'find', () => query(options.exceptions || []));
  t.mock.method(Booking, 'find', (filter) => {
    assert.equal(filter.branchServiceId, ids.offering);
    assert.deepEqual(filter.status, { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] });
    return query(options.bookings || []);
  });
  t.mock.method(Booking, 'create', async (documents, config) => {
    assert.equal(config.session, session);
    if (options.retry && state.locks === 1) throw Object.assign(new Error('Write conflict'), { code: 112 });
    if (options.createError) throw options.createError;
    state.created.push(documents[0]);
    return documents;
  });
  return state;
};

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
