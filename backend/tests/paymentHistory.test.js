const test = require('node:test');
const assert = require('node:assert/strict');
const Payment = require('../src/models/Payment');
const { getPaymentHistory } = require('../src/controllers/customer/paymentsController');

test('customer history scopes query to authenticated customer and excludes gateway metadata', async (t) => {
  const records = [{ paymentCode: 'PAY-1' }];
  const query = {
    select(fields) {
      assert.equal(fields.includes('metadata'), false);
      assert.equal(fields.includes('amount'), true);
      return this;
    },
    populate() { return this; },
    sort(order) { assert.deepEqual(order, { createdAt: -1, _id: -1 }); return this; },
    lean: async () => records,
  };
  t.mock.method(Payment, 'find', (filter) => {
    assert.deepEqual(filter, { customerId: 'logged-in-customer' });
    return query;
  });
  await getPaymentHistory({ user: { id: 'logged-in-customer', role: 'CUSTOMER' }, query: { customerId: 'other' } }, {
    json(payload) { assert.deepEqual(payload, { success: true, data: records }); },
  }, (error) => { throw error; });
});

test('history denies non-customers before querying', async (t) => {
  const find = t.mock.method(Payment, 'find', () => { throw new Error('must not query'); });
  const res = {
    status(code) { assert.equal(code, 403); return this; },
    json(payload) { assert.equal(payload.success, false); },
  };
  await getPaymentHistory({ user: { role: 'ADMIN' } }, res, (error) => { throw error; });
  assert.equal(find.mock.callCount(), 0);
});
