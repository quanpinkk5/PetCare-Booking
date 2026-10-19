import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { serviceApi } from '../src/features/customer/services/serviceApi.js';

test('service filters are encoded and zero price is preserved for public requests', async (t) => {
  authApi.setAccessToken(null);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.pathname, '/api/customer/services');
    assert.equal(parsed.searchParams.get('search'), 'Tắm & Spa');
    assert.equal(parsed.searchParams.get('categoryId'), 'category-1');
    assert.equal(parsed.searchParams.get('petType'), 'CAT');
    assert.equal(parsed.searchParams.get('serviceType'), 'BOARDING');
    assert.equal(parsed.searchParams.get('minPrice'), '0');
    assert.equal(parsed.searchParams.get('maxPrice'), '300000');
    assert.equal(parsed.searchParams.get('sort'), 'priceAsc');
    assert.equal(parsed.searchParams.get('page'), '2');
    assert.equal(parsed.searchParams.get('limit'), '8');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ data: [], pagination: { total: 10, totalPages: 2 } });
  });
  const result = await serviceApi.list({ search: 'Tắm & Spa', categoryId: 'category-1', petType: 'CAT', serviceType: 'BOARDING', minPrice: 0, maxPrice: 300000, sort: 'priceAsc', page: 2, limit: 8 });
  assert.equal(result.pagination.total, 10);
});

test('categories load from the backend without hardcoded category IDs', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(new URL(url).pathname, '/api/customer/service-categories');
    return Response.json({ data: [{ _id: 'category-1', name: 'Grooming' }] });
  });
  assert.equal((await serviceApi.categories()).data[0].name, 'Grooming');
});

test('cleared filters are omitted while pagination and sorting remain', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    const query = new URL(url).searchParams;
    assert.deepEqual([...query.keys()], ['page', 'sort']);
    return Response.json({ data: [] });
  });
  await serviceApi.list({ search: '', categoryId: '', minPrice: '', maxPrice: null, petType: undefined, page: 1, sort: 'newest' });
});

test('API validation and network failures reach the page for retry', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Bộ lọc không hợp lệ' }, { status: 400 }));
  await assert.rejects(serviceApi.list({ minPrice: -1 }), /Bộ lọc không hợp lệ/);
  fetch.mock.mockImplementation(async () => { throw new Error('Network unavailable'); });
  await assert.rejects(serviceApi.categories(), /Network unavailable/);
});
