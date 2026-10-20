const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const Business = require('../src/models/Business');
const Branch = require('../src/models/Branch');
const BranchService = require('../src/models/BranchService');
const Service = require('../src/models/Service');

// Keep the same customer route order as app.js to catch authentication shadowing.
const router = express.Router();
router.use(require('../src/routes/customer/profileRoutes'));
router.use(require('../src/routes/customer/petRoutes'));
router.use(require('../src/routes/customer/businessesRoutes'));
router.use(require('../src/routes/customer/branchesRoutes'));
router.use(require('../src/routes/customer/branchServicesRoutes'));
const id = '507f1f77bcf86cd799439011';
const branchId = '507f1f77bcf86cd799439022';
const serviceId = '507f1f77bcf86cd799439033';

const get = (url, query = {}) => new Promise((resolve, reject) => {
  const req = { method: 'GET', url, headers: {}, query };
  const res = { code: 200, status(code) { this.code = code; return this; }, json(data) { resolve({ status: this.code, ...data }); } };
  router.handle(req, res, (error) => reject(error || new Error('Route did not respond')));
});
const chain = (result, checks = {}) => ({
  select(value) { checks.select?.(value); return this; },
  sort(value) { checks.sort?.(value); return this; },
  skip(value) { checks.skip?.(value); return this; },
  limit(value) { checks.limit?.(value); return this; },
  lean: async () => result,
  then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); },
});

test('public business list filters approved businesses, escapes search and paginates before attaching active branches', async (t) => {
  let countFilter;
  t.mock.method(Business, 'find', (filter) => {
    countFilter = filter;
    assert.equal(filter.status, 'APPROVED');
    assert.deepEqual(filter.name, { $regex: 'Pet\\.\\*', $options: 'i' });
    assert.deepEqual(filter.averageRating, { $gte: 4.5 });
    return chain([{ _id: id, name: 'Pet.*', averageRating: 4.8 }], {
      skip: (value) => assert.equal(value, 8), limit: (value) => assert.equal(value, 8),
      sort: (value) => assert.deepEqual(value, { averageRating: -1, totalReviews: -1, _id: -1 }),
    });
  });
  t.mock.method(Business, 'countDocuments', async (filter) => { assert.deepEqual(filter, countFilter); return 9; });
  t.mock.method(Branch, 'find', (filter) => {
    assert.deepEqual(filter, { businessId: { $in: [id] }, status: 'ACTIVE' });
    return chain([{ _id: branchId, businessId: id, address: { province: 'Hà Nội' } }]);
  });
  const response = await get('/businesses', { search: 'Pet.*', minRating: '4.5', sort: 'rating', page: '2', limit: '8' });
  assert.equal(response.status, 200);
  assert.equal(response.data[0].branches[0]._id, branchId);
  assert.deepEqual(response.pagination, { page: 2, limit: 8, total: 9, totalPages: 2 });
});

test('location searches only active branches and constrains business IDs', async (t) => {
  t.mock.method(Branch, 'distinct', async (field, filter) => {
    assert.equal(field, 'businessId');
    assert.equal(filter.status, 'ACTIVE');
    assert.equal(filter.$or[0]['address.province'].$regex, 'Hà Nội');
    return [id];
  });
  t.mock.method(Business, 'find', (filter) => { assert.deepEqual(filter._id, { $in: [id] }); return chain([]); });
  t.mock.method(Business, 'countDocuments', async () => 0);
  const response = await get('/businesses', { location: 'Hà Nội' });
  assert.equal(response.status, 200);
  assert.equal(response.pagination.total, 0);
  assert.deepEqual(response.data, []);
});

test('invalid pagination and filters fail before database reads', async (t) => {
  const find = t.mock.method(Business, 'find', () => { throw new Error('Unexpected query'); });
  for (const query of [{ page: '0' }, { limit: '101' }, { page: '1.5' }, { minRating: '6' }, { minRating: 'abc' }, { sort: '__proto__' }, { search: {} }, { location: {} }]) {
    assert.equal((await get('/businesses', query)).status, 400);
  }
  assert.equal(find.mock.callCount(), 0);
});

test('business details are public and unavailable businesses return 404', async (t) => {
  assert.equal((await get('/businesses/invalid')).status, 400);
  const find = t.mock.method(Business, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: id, status: 'APPROVED' });
    return chain({ _id: id, name: 'Approved business' });
  });
  assert.equal((await get(`/businesses/${id}`)).data.name, 'Approved business');
  find.mock.mockImplementation(() => chain(null));
  assert.equal((await get(`/businesses/${id}`)).status, 404);
});

test('branches are only returned for approved businesses and ACTIVE status', async (t) => {
  t.mock.method(Business, 'findOne', (filter) => {
    assert.equal(filter.status, 'APPROVED');
    return chain({ _id: id });
  });
  t.mock.method(Branch, 'find', (filter) => {
    assert.deepEqual(filter, { businessId: id, status: 'ACTIVE' });
    return chain([{ _id: branchId, name: 'Active branch' }]);
  });
  assert.equal((await get(`/businesses/${id}/branches`)).data[0]._id, branchId);
});

test('branch services exclude inactive or unrelated services and preserve branch prices', async (t) => {
  t.mock.method(Branch, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: branchId, status: 'ACTIVE' });
    return chain({ _id: branchId, businessId: id });
  });
  t.mock.method(Business, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: id, status: 'APPROVED' });
    return chain({ _id: id });
  });
  t.mock.method(BranchService, 'find', (filter) => {
    assert.deepEqual(filter, { branchId, status: 'ACTIVE' });
    return chain([{ _id: 'offering-1', branchId, serviceId, price: 0, pricingUnit: 'PER_SERVICE' }, { _id: 'offering-2', branchId, serviceId: 'missing-service' }]);
  });
  t.mock.method(Service, 'find', (filter) => {
    assert.equal(filter.businessId, id);
    assert.equal(filter.status, 'ACTIVE');
    return chain([{ _id: serviceId, name: 'Tắm', description: 'Tắm và vệ sinh' }]);
  });
  const result = await get(`/branches/${branchId}/services`);
  assert.equal(result.status, 200);
  assert.equal(result.data.length, 1);
  assert.equal(result.data[0].price, 0);
  assert.equal(result.data[0].service.name, 'Tắm');
});
