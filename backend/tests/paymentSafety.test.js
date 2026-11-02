const assert = require('node:assert/strict');
const { test } = require('node:test');
const mongoose = require('mongoose');
const Booking = require('../src/models/Booking');
const Payment = require('../src/models/Payment');
const BranchService = require('../src/models/BranchService');
const Branch = require('../src/models/Branch');
const { signVnpay } = require('../src/utils/vnpay');
const { vnpayIpn, createVnpayPayment, retryVnpayPayment } = require('../src/controllers/customer/paymentsController');
const { cancelBooking } = require('../src/controllers/customer/bookingController');

const bookingId = '507f1f77bcf86cd799439012';
const customerId = '507f1f77bcf86cd799439011';
const invoke = async (handler, req) => {
  let result;
  await handler(req, {
    status(code) { this.code = code; return this; },
    json(body) { result = { status: this.code, ...body }; },
  }, (error) => { throw error; });
  return result;
};

function setup(t) {
  for (const [key, value] of Object.entries({
    VNP_TMN_CODE: 'TESTCODE', VNP_HASH_SECRET: 'test-secret',
    VNP_URL: 'https://example.com/pay', VNP_RETURN_URL: 'https://example.com/return',
  })) {
    const old = process.env[key];
    process.env[key] = value;
    t.after(() => { if (old === undefined) delete process.env[key]; else process.env[key] = old; });
  }
  const state = { paymentSaves: 0, bookingSaves: 0, ended: 0, cancelWrites: 0, created: 0 };
  state.booking = {
    _id: bookingId, customerId, status: 'CONFIRMED', paymentStatus: 'UNPAID',
    totalPrice: 10000, bookingCode: 'BK-TEST', branchServiceId: 'service',
    async save() { state.bookingSaves++; },
  };
  state.payment = {
    _id: 'payment', bookingId, status: 'PROCESSING', amount: 10000,
    paymentCode: 'TEST-REF', metadata: { vnpCreateDate: '20261102090000' },
    async save() { state.paymentSaves++; },
  };
  state.session = {
    withTransaction: async (fn) => fn(),
    endSession: async () => { state.ended++; },
  };
  t.mock.method(mongoose, 'startSession', async () => state.session);
  t.mock.method(Payment, 'findOne', () => ({
    session: async (session) => { assert.equal(session, state.session); return state.active; },
    then(resolve, reject) { return Promise.resolve(state.payment).then(resolve, reject); },
  }));
  t.mock.method(Payment, 'findById', () => ({
    select() { return this; }, session: async () => state.payment,
  }));
  t.mock.method(Booking, 'findById', () => ({ session: async () => state.booking }));
  t.mock.method(Booking, 'findOne', async () => state.booking);
  t.mock.method(Booking, 'findOneAndUpdate', async (filter, update, options) => {
    assert.equal(options.session, state.session);
    assert.equal(filter.paymentStatus, 'UNPAID');
    assert.equal(filter.customerId, customerId);
    state.cancelWrites++;
    return state.cancelResult === undefined ? { ...state.booking, status: 'CANCELLED' } : state.cancelResult;
  });
  return state;
}

async function ipn(responseCode = '00', transactionStatus = '00', overrides = {}) {
  const query = {
    vnp_TmnCode: 'TESTCODE', vnp_TxnRef: 'TEST-REF', vnp_Amount: '1000000',
    vnp_ResponseCode: responseCode, vnp_TransactionNo: '12345', ...overrides,
  };
  if (transactionStatus !== undefined) query.vnp_TransactionStatus = transactionStatus;
  query.vnp_SecureHash = signVnpay(query);
  return invoke(vnpayIpn, { query });
}
const cancel = () => invoke(cancelBooking, {
  user: { _id: customerId }, params: { id: bookingId }, body: { reason: 'busy' },
});

for (const status of ['PENDING', 'CANCELLED']) {
  test(`${status} bookings cannot create or retry payments through the API`, async (t) => {
    const state = setup(t);
    state.booking.status = status;
    const create = t.mock.method(Payment, 'create', () => { throw new Error('Unexpected payment'); });
    const fetch = t.mock.method(global, 'fetch', () => { throw new Error('Unexpected QueryDR'); });
    for (const handler of [createVnpayPayment, retryVnpayPayment]) {
      const result = await invoke(handler, { user: { _id: customerId, role: 'CUSTOMER' }, body: { bookingId } });
      assert.equal(result.success, false);
      assert.equal(result.code, 'BOOKING_NOT_PAYABLE');
    }
    assert.equal(create.mock.callCount(), 0);
    assert.equal(fetch.mock.callCount(), 0);
  });
}

test('a legacy successful IPN for an unconfirmed booking records evidence for reconciliation', async (t) => {
  const state = setup(t);
  state.booking.status = 'PENDING';
  assert.equal((await ipn()).RspCode, '00');
  assert.equal(state.payment.status, 'PROCESSING');
  assert.equal(state.payment.metadata.reconciliationRequired, true);
  assert.equal(state.payment.metadata.reconciliationReason, 'BOOKING_NOT_PAYABLE');
  assert.equal(state.booking.paymentStatus, 'UNPAID');
  assert.equal(state.bookingSaves, 0);
});

test('verified success settles payment and booking atomically; duplicate IPN is idempotent', async (t) => {
  const state = setup(t);
  assert.equal((await ipn()).RspCode, '00');
  assert.equal(state.payment.status, 'PAID');
  assert.equal(state.booking.paymentStatus, 'PAID');
  assert.equal(state.payment.transactionId, '12345');
  assert.equal(state.payment.metadata.vnpCreateDate, '20261102090000');
  assert.equal((await ipn()).RspCode, '02');
  assert.equal(state.paymentSaves, 1);
  assert.equal(state.bookingSaves, 1);
});

for (const code of ['09', '10', '11', '12', '13', '24', '51', '65', '75', '79']) {
  test(`explicit failure ${code}/02 closes the attempt and preserves request metadata`, async (t) => {
    const state = setup(t);
    assert.equal((await ipn(code, '02')).RspCode, '00');
    assert.equal(state.payment.status, 'FAILED');
    assert.ok(state.payment.failedAt instanceof Date);
    assert.equal(state.payment.metadata.vnpCreateDate, '20261102090000');
    assert.equal(state.booking.paymentStatus, 'UNPAID');
    assert.equal(state.bookingSaves, 0);
  });
}

for (const [code, status] of [
  ['07', '07'], ['07', '02'], ['99', '02'], ['XX', '02'], ['00', '01'],
  ['00', '04'], ['00', '05'], ['00', '06'], ['00', '07'], ['24', '00'], ['24', null],
]) {
  test(`uncertain IPN ${code}/${status} keeps the lock and records reconciliation evidence`, async (t) => {
    const state = setup(t);
    assert.equal((await ipn(code, status)).RspCode, '00');
    assert.equal(state.payment.status, 'PROCESSING');
    assert.equal(state.payment.metadata.reconciliationRequired, true);
    assert.equal(state.payment.metadata.responseCode, code);
    assert.equal(state.payment.failedAt, undefined);
    assert.equal(state.bookingSaves, 0);
    state.active = state.payment;
    assert.equal((await cancel()).code, 'PAYMENT_IN_PROGRESS');
    assert.equal(state.cancelWrites, 0);
  });
}

test('a later successful IPN resolves an uncertain result', async (t) => {
  const state = setup(t);
  await ipn('07', '07');
  await ipn();
  assert.equal(state.payment.status, 'PAID');
  assert.equal(state.payment.metadata.reconciliationRequired, false);
  assert.equal(state.payment.metadata.reconciliationReason, undefined);
});

test('success after historical cancellation persists evidence without reviving the booking', async (t) => {
  const state = setup(t);
  state.booking.status = 'CANCELLED';
  assert.equal((await ipn()).RspCode, '00');
  assert.equal(state.payment.status, 'PROCESSING');
  assert.equal(state.payment.metadata.reconciliationReason, 'BOOKING_NOT_PAYABLE');
  assert.equal(state.payment.transactionId, '12345');
  assert.equal(state.paymentSaves, 1);
  assert.equal(state.bookingSaves, 0);
  assert.equal(state.booking.paymentStatus, 'UNPAID');
});

test('invalid signature or amount never changes payment state', async (t) => {
  const state = setup(t);
  assert.equal((await invoke(vnpayIpn, { query: {} })).RspCode, '97');
  assert.equal((await ipn('00', '00', { vnp_Amount: '1' })).RspCode, '04');
  assert.equal(state.paymentSaves, 0);
});

for (const status of ['PENDING', 'PROCESSING']) test(`even an overdue ${status} attempt blocks cancellation`, async (t) => {
  const state = setup(t);
  state.active = { ...state.payment, status, expiresAt: new Date(0) };
  assert.equal((await cancel()).status, 409);
  assert.equal(state.cancelWrites, 0);
  assert.equal(state.ended, 1);
});

test('confirmed failure releases the lock and permits cancellation', async (t) => {
  const state = setup(t);
  await ipn('24', '02');
  state.active = null;
  assert.equal((await cancel()).data.status, 'CANCELLED');
  assert.equal(state.cancelWrites, 1);
});

test('cancellation transaction retry observes a newly committed payment', async (t) => {
  const state = setup(t);
  state.active = null;
  state.session.withTransaction = async (fn) => {
    await fn(); // Simulate an aborted first attempt after a Booking write conflict.
    state.active = state.payment;
    await fn();
  };
  assert.equal((await cancel()).code, 'PAYMENT_IN_PROGRESS');
  assert.equal(state.ended, 1);
});

test('cancellation does not overwrite a booking settled after its initial read', async (t) => {
  const state = setup(t);
  state.active = null;
  state.cancelResult = null;
  assert.equal((await cancel()).status, 409);
});

test('IPN transaction retry resets a previous callback reply', async (t) => {
  const state = setup(t);
  const actualBooking = state.booking;
  state.session.withTransaction = async (fn) => {
    state.booking = null;
    await fn();
    state.booking = actualBooking;
    await fn();
  };
  assert.equal((await ipn()).RspCode, '00');
  assert.equal(state.payment.status, 'PAID');
});

test('creation rechecks the booking inside the transaction after a racing cancellation', async (t) => {
  const state = setup(t);
  state.payment = null;
  t.mock.method(BranchService, 'findById', async () => ({ branchId: 'branch' }));
  t.mock.method(Branch, 'findById', async () => ({ businessId: 'business' }));
  t.mock.method(Booking, 'updateOne', async (filter, update, options) => {
    assert.deepEqual(filter.status, { $in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] });
    assert.equal(filter.paymentStatus, 'UNPAID');
    assert.equal(filter.totalPrice, 10000);
    assert.equal(options.session, state.session);
    assert.equal(update.$inc.__v, 1);
    return { matchedCount: 0 };
  });
  const create = t.mock.method(Payment, 'create', () => { throw new Error('Unexpected creation'); });
  const result = await invoke(createVnpayPayment, {
    user: { _id: customerId, role: 'CUSTOMER' }, body: { bookingId },
  });
  assert.equal(result.status, 409);
  assert.equal(result.code, 'BOOKING_NOT_PAYABLE');
  assert.equal(create.mock.callCount(), 0);
  assert.equal(state.ended, 1);
});

for (const status of ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']) {
  test(`successful IPN settles an unpaid ${status} booking`, async (t) => {
    const state = setup(t);
    state.booking.status = status;
    assert.equal((await ipn()).RspCode, '00');
    assert.equal(state.booking.paymentStatus, 'PAID');
    assert.equal(state.payment.status, 'PAID');
    assert.equal(state.booking.status, status);
    assert.equal((await ipn()).RspCode, '02');
    assert.equal(state.bookingSaves, 1);
  });
}
