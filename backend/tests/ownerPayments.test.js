const test = require('node:test');
const assert = require('node:assert/strict');
const Business = require('../src/models/Business');
const Branch = require('../src/models/Branch');
const Payment = require('../src/models/Payment');
const { getPayments } = require('../src/controllers/businessOwner/paymentsController');

const next = (error) => { throw error; };
test('owner payments reject other roles before accessing data', async (t) => {
  t.mock.method(Business, 'findOne', () => { throw new Error('must not query'); });
  await getPayments({ user: { role: 'CUSTOMER' } }, {
    status(code) { assert.equal(code, 403); return this; },
    json(body) { assert.equal(body.success, false); },
  }, next);
});

test('owner without a business receives an empty list', async (t) => {
  t.mock.method(Business, 'findOne', () => ({ select() { return this; }, lean: async () => null }));
  t.mock.method(Payment, 'find', () => { throw new Error('must not query payments'); });
  await getPayments({ user: { id: 'owner', role: 'BUSINESS_OWNER' } }, {
    json(body) { assert.deepEqual(body, { success: true, data: [], branches: [] }); },
  }, next);
});

test('payments and branches are scoped to the authenticated owner, excluding sensitive fields', async (t) => {
  t.mock.method(Business, 'findOne', (filter) => {
    assert.deepEqual(filter, { ownerId: 'owner' });
    return { select() { return this; }, lean: async () => ({ _id: 'owned-business' }) };
  });
  const records = [{ paymentCode: 'PAY-1' }];
  t.mock.method(Payment, 'find', (filter) => {
    assert.deepEqual(filter, { businessId: 'owned-business' });
    return {
      select(fields) { assert.ok(fields.includes('amount')); assert.ok(!fields.includes('metadata')); return this; },
      populate(options) {
        if (options.path === 'customerId') assert.equal(options.select, 'fullName phone avatar');
        return this;
      },
      sort(order) { assert.deepEqual(order, { createdAt: -1, _id: -1 }); return this; },
      lean: async () => records,
    };
  });
  t.mock.method(Branch, 'find', (filter) => {
    assert.deepEqual(filter, { businessId: 'owned-business' });
    return { select() { return this; }, sort() { return this; }, lean: async () => [] };
  });
  await getPayments({ user: { _id: 'owner', role: 'BUSINESS_OWNER' }, query: { businessId: 'someone-else' } }, {
    json(body) { assert.deepEqual(body, { success: true, data: records, branches: [] }); },
  }, next);
});

test('database failures propagate to the error handler', async (t) => {
  const failure = new Error('database unavailable');
  t.mock.method(Business, 'findOne', () => { throw failure; });
  await getPayments({ user: { id: 'owner', role: 'BUSINESS_OWNER' } }, {}, (error) => assert.equal(error, failure));
});
