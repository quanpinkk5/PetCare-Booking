import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { petApi } from '../src/features/customer/services/petApi.js';

beforeEach(() => authApi.setAccessToken('customer-token'));

test('pet CRUD uses authenticated requests and sends only the provided payload', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    assert.equal(options.credentials, 'include');
    assert.equal(options.headers.Authorization, 'Bearer customer-token');
    return Response.json({ success: true, data: options.method ? { _id: 'pet-1' } : [] });
  });
  const payload = { name: 'Milo', species: 'DOG', weight: 5 };
  await petApi.list();
  await petApi.create(payload);
  await petApi.update('pet-1', payload);
  await petApi.remove('pet-1');
  assert.deepEqual(calls.map(({ url }) => new URL(url).pathname), [
    '/api/customer/pets', '/api/customer/pets', '/api/customer/pets/pet-1', '/api/customer/pets/pet-1',
  ]);
  assert.deepEqual(calls.map(({ options }) => options.method || 'GET'), ['GET', 'POST', 'PATCH', 'DELETE']);
  assert.deepEqual(JSON.parse(calls[1].options.body), payload);
  assert.deepEqual(JSON.parse(calls[2].options.body), payload);
  assert.equal(calls[3].options.body, undefined);
});

test('expired pet requests refresh the shared token and retry the same mutation', async (t) => {
  let refreshCalls = 0;
  let updateCalls = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.endsWith('/auth/refresh')) {
      refreshCalls += 1;
      return Response.json({ data: { accessToken: 'fresh-token' } });
    }
    updateCalls += 1;
    assert.equal(options.method, 'PATCH');
    assert.deepEqual(JSON.parse(options.body), { name: 'Milo' });
    return options.headers.Authorization === 'Bearer fresh-token'
      ? Response.json({ data: { _id: 'pet-1', name: 'Milo' } })
      : Response.json({ message: 'Token expired' }, { status: 401 });
  });
  assert.equal((await petApi.update('pet-1', { name: 'Milo' })).data.name, 'Milo');
  assert.equal(refreshCalls, 1);
  assert.equal(updateCalls, 2);
});

test('pet ownership or save errors propagate to the caller', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không tìm thấy thú cưng' }, { status: 404 }));
  await assert.rejects(petApi.remove('other-pet'), /Không tìm thấy thú cưng/);
  await assert.rejects(petApi.update('other-pet', { name: 'Name' }), /Không tìm thấy thú cưng/);
});
