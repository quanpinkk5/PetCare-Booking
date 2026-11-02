const assert = require('node:assert/strict');
const { test } = require('node:test');
const { once } = require('node:events');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const Booking = require('../src/models/Booking');
const BranchService = require('../src/models/BranchService');
const Branch = require('../src/models/Branch');
const Payment = require('../src/models/Payment');
const { verifyVnpay } = require('../src/utils/vnpay');

for (const bookingStatus of ["CONFIRMED", "IN_PROGRESS", "COMPLETED"]) {
test(`payment creation and retry support an unpaid ${bookingStatus} booking through the authenticated routes`, async (t) => {
  const config = {
    JWT_SECRET: 'payment-test-secret',
    VNP_TMN_CODE: 'TESTCODE',
    VNP_HASH_SECRET: 'payment-test-hash-secret',
    VNP_URL: 'https://example.com/payment',
    VNP_RETURN_URL: 'http://localhost:5000/api/customer/payments/vnpay/return',
  };
  const previous = Object.fromEntries(Object.keys(config).map((key) => [key, process.env[key]]));
  Object.assign(process.env, config);
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const customerId = '507f1f77bcf86cd799439011';
  const bookingId = '507f1f77bcf86cd799439012';
  t.mock.method(User, 'findById', async () => ({
    _id: customerId, role: 'CUSTOMER', status: 'ACTIVE', tokenVersion: 0,
  }));
  t.mock.method(Booking, 'findOne', async (filter) => {
    assert.deepEqual(filter, { _id: bookingId, customerId });
    return {
      _id: bookingId, customerId, bookingCode: 'BK-TEST',
      branchServiceId: 'offering', status: bookingStatus, paymentStatus: 'UNPAID', totalPrice: 150000,
    };
  });
  t.mock.method(BranchService, 'findById', async () => ({ branchId: 'branch' }));
  t.mock.method(Branch, 'findById', async () => ({ businessId: 'business' }));
  t.mock.method(Payment, 'findOne', async () => null);
  const session = { withTransaction: async (fn) => fn(), endSession: async () => {} };
  t.mock.method(mongoose, 'startSession', async () => session);
  t.mock.method(Booking, 'updateOne', async () => ({ matchedCount: 1 }));
  t.mock.method(Payment, 'create', async ([data]) => [{ _id: 'payment', ...data }]);
  const update = t.mock.method(Payment, 'updateOne', async () => ({ modifiedCount: 1 }));

  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await once(server, 'listening');
  const token = jwt.sign({ userId: customerId, tokenVersion: 0 }, config.JWT_SECRET);
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/customer/payments/vnpay/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    },
    body: JSON.stringify({ bookingId }),
  });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('access-control-allow-origin'), process.env.FRONTEND_URL || 'http://localhost:5173');
  const result = await response.json();
  assert.equal(result.success, true);
  assert.equal(result.data.bookingId, bookingId);
  const params = Object.fromEntries(new URL(result.data.paymentUrl).searchParams);
  assert.equal(params.vnp_Amount, '15000000');
  assert.equal(verifyVnpay(params), true);
  assert.equal(update.mock.callCount(), 1);

  // The retry route accepts the same JSON payload and creates a payment when
  // there is no active VNPAY attempt. Exercise the real auth/router chain.
  t.mock.method(Payment, 'findOne', () => ({
    select() { return this; }, sort: async () => null,
    then(resolve, reject) { return Promise.resolve(null).then(resolve, reject); },
  }));
  const retry = await fetch(`http://127.0.0.1:${server.address().port}/api/customer/payments/vnpay/retry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bookingId }),
  });
  assert.equal(retry.status, 201);
  assert.equal((await retry.json()).data.bookingId, bookingId);
  assert.equal(update.mock.callCount(), 2);
});

}
