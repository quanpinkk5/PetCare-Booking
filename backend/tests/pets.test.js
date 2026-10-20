const assert = require('node:assert/strict');
const { before, test } = require('node:test');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const Pet = require('../src/models/Pet');
const routes = require('../src/routes/customer/petRoutes');

const customer = { _id: '507f1f77bcf86cd799439011', role: 'CUSTOMER', status: 'ACTIVE', tokenVersion: 0 };
const petId = '507f1f77bcf86cd799439022';
let token;
before(() => {
  process.env.JWT_SECRET = 'pets-test-secret';
  token = jwt.sign({ userId: customer._id, tokenVersion: 0 }, process.env.JWT_SECRET);
});

const request = (method, path = '/pets', body, authorized = true) => new Promise((resolve, reject) => {
  const req = { method, url: path, body, headers: authorized ? { authorization: `Bearer ${token}` } : {} };
  const res = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { resolve({ status: this.statusCode, ...data }); },
  };
  routes.handle(req, res, (error) => reject(error || new Error('Route did not respond')));
});

test('all pet endpoints require login and the CUSTOMER role', async (t) => {
  const user = t.mock.method(User, 'findById', async () => ({ ...customer, role: 'ADMIN' }));
  for (const [method, path] of [['GET', '/pets'], ['POST', '/pets'], ['PATCH', `/pets/${petId}`], ['DELETE', `/pets/${petId}`]]) {
    assert.equal((await request(method, path, {}, false)).status, 401);
    assert.equal((await request(method, path, {})).status, 403);
  }
  assert.equal(user.mock.callCount(), 4);
});

test('create, list, update, clear optional fields and soft delete use the authenticated owner', async (t) => {
  t.mock.method(User, 'findById', async () => customer);
  let stored;
  t.mock.method(Pet, 'create', async (data) => {
    assert.equal(data.ownerId, customer._id);
    assert.equal(data.status, 'ACTIVE');
    stored = { _id: petId, ...data };
    return stored;
  });
  t.mock.method(Pet, 'find', (filter) => {
    assert.deepEqual(filter, { ownerId: customer._id, status: 'ACTIVE' });
    return { sort: async (sort) => {
      assert.deepEqual(sort, { createdAt: -1 });
      return stored?.status === 'ACTIVE' ? [stored] : [];
    } };
  });
  t.mock.method(Pet, 'findOneAndUpdate', async (filter, update, options) => {
    assert.deepEqual(filter, { _id: petId, ownerId: customer._id, status: 'ACTIVE' });
    assert.deepEqual(options, { new: true, runValidators: true });
    stored = { ...stored, ...update.$set };
    return stored;
  });
  const created = await request('POST', '/pets', {
    name: '  Milo  ', species: 'DOG', gender: 'MALE', weight: 5.5,
    dateOfBirth: '2024-02-29', feedingNotes: ' Ăn hạt ', careNotes: ' Dị ứng ',
  });
  assert.equal(created.status, 201);
  assert.equal(created.data.name, 'Milo');
  assert.equal(created.data.careNotes, 'Dị ứng');
  assert.equal(created.data.dateOfBirth.toISOString(), '2024-02-29T00:00:00.000Z');
  assert.equal((await request('GET')).data.length, 1);
  const updated = await request('PATCH', `/pets/${petId}`, { name: 'Mimi', species: 'CAT', weight: null, dateOfBirth: null, gender: null });
  assert.equal(updated.status, 200);
  assert.equal(updated.data.name, 'Mimi');
  assert.equal(updated.data.weight, null);
  assert.equal(updated.data.gender, null);
  assert.equal(updated.data.dateOfBirth, null);
  assert.equal(updated.data.feedingNotes, 'Ăn hạt');
  const deleted = await request('DELETE', `/pets/${petId}`);
  assert.equal(deleted.status, 200);
  assert.equal(deleted.data.status, 'INACTIVE');
  assert.equal((await request('GET')).data.length, 0);
});

test('pet mutation validation rejects invalid fields without writing', async (t) => {
  t.mock.method(User, 'findById', async () => customer);
  const create = t.mock.method(Pet, 'create', () => { throw new Error('Unexpected create'); });
  const update = t.mock.method(Pet, 'findOneAndUpdate', () => { throw new Error('Unexpected update'); });
  for (const extra of [
    { name: '' }, { species: 'BIRD' }, { gender: 'Đực' }, { weight: 0 }, { weight: '5' },
    { dateOfBirth: '2025-02-30' }, { dateOfBirth: '2999-01-01' }, { dateOfBirth: '' },
    { ownerId: 'other-owner' }, { status: 'INACTIVE' }, { avatar: 'blob:temporary' },
    { avatar: `data:image/png;base64,${Buffer.alloc(256 * 1024 + 1).toString('base64')}` },
    { careNotes: 123 }, { personality: 'x'.repeat(2001) },
  ]) {
    for (const [method, path] of [['POST', '/pets'], ['PATCH', `/pets/${petId}`]]) {
      const result = await request(method, path, { name: 'Milo', species: 'DOG', ...extra });
      assert.equal(result.status, 400, JSON.stringify(extra).slice(0, 100));
    }
  }
  for (const body of [null, [], {}, 'invalid']) {
    assert.equal((await request('POST', '/pets', body)).status, 400);
    assert.equal((await request('PATCH', `/pets/${petId}`, body)).status, 400);
  }
  assert.equal(create.mock.callCount(), 0);
  assert.equal(update.mock.callCount(), 0);
});

test('invalid IDs and pets belonging to another customer cannot be changed', async (t) => {
  t.mock.method(User, 'findById', async () => customer);
  const update = t.mock.method(Pet, 'findOneAndUpdate', async (filter) => {
    assert.equal(filter.ownerId, customer._id);
    assert.equal(filter.status, 'ACTIVE');
    return null;
  });
  for (const method of ['PATCH', 'DELETE']) {
    assert.equal((await request(method, '/pets/not-an-id', { name: 'Milo' })).status, 400);
    assert.equal((await request(method, `/pets/${petId}`, { name: 'Milo' })).status, 404);
  }
  assert.equal(update.mock.callCount(), 2);
});

test('optional pet fields may be null under the MongoDB schema', async () => {
  await new Pet({ ownerId: customer._id, name: 'Milo', species: 'DOG', gender: null, weight: null, dateOfBirth: null, status: 'ACTIVE' }).validate();
});
