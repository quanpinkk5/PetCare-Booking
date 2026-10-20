const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const BranchService = require('../src/models/BranchService');
const ServiceCategory = require('../src/models/ServiceCategory');
const app = require('../src/app');

// Follow the customer routes in their real app registration order, without opening a port.
const router = express.Router();
for (const layer of app.router.stack) {
  if (layer.name === 'router' && layer.match('/api/customer')) router.use(layer.handle);
}
const get = (path, query = {}) => new Promise((resolve, reject) => {
  const req = { method: 'GET', url: path, query, headers: {} };
  const res = { code: 200, status(code) { this.code = code; return this; }, json(data) { resolve({ status: this.code, ...data }); } };
  router.handle(req, res, (error) => reject(error || new Error('Route did not respond')));
});

test('service categories are public and contain only active category fields', async (t) => {
  t.mock.method(ServiceCategory, 'find', (filter) => {
    assert.deepEqual(filter, { status: 'ACTIVE' });
    return {
      select(fields) { assert.equal(fields, 'name code description icon'); return this; },
      sort() { return this; }, lean: async () => [{ _id: 'cat-1', name: 'Grooming' }],
    };
  });
  const response = await get('/service-categories');
  assert.equal(response.status, 200);
  assert.equal(response.data[0].name, 'Grooming');
});

test('public service listing joins only active offerings, services, branches and approved businesses', async (t) => {
  t.mock.method(BranchService, 'aggregate', async (pipeline) => {
    assert.deepEqual(pipeline[0], { $match: { status: 'ACTIVE' } });
    const matches = pipeline.filter((stage) => stage.$match).map((stage) => stage.$match);
    assert.ok(matches.some((match) => match['service.status'] === 'ACTIVE'));
    assert.ok(matches.some((match) => match['branch.status'] === 'ACTIVE'));
    assert.ok(matches.some((match) => match['business.status'] === 'APPROVED'));
    // A branch cannot advertise a service belonging to a different business.
    assert.ok(matches.some((match) => JSON.stringify(match.$expr) === JSON.stringify({ $eq: ['$branch.businessId', '$service.businessId'] })));
    assert.ok(matches.some((match) => match.$or?.some((condition) => condition['category.status'] === 'ACTIVE')));
    const facet = pipeline.at(-1).$facet;
    assert.deepEqual(facet.count, [{ $count: 'total' }]);
    assert.deepEqual(facet.data[0], { $sort: { _id: -1 } });
    assert.deepEqual(facet.data[1], { $skip: 0 });
    assert.deepEqual(facet.data[2], { $limit: 8 });
    const project = facet.data[3].$project;
    assert.equal(project['business.ownerId'], undefined);
    assert.equal(project['branch.phone'], undefined);
    assert.equal(project['service.name'], 1);
    assert.equal(project.price, 1);
    return [{ data: [{ _id: 'offering-1', price: 0, service: { name: 'Tắm' } }], count: [{ total: 1 }] }];
  });
  const response = await get('/services');
  assert.equal(response.status, 200);
  assert.equal(response.data[0].price, 0);
  assert.deepEqual(response.pagination, { page: 1, limit: 8, total: 1, totalPages: 1 });
});

test('filters apply to the offering and service before sorting, counting and pagination', async (t) => {
  const categoryId = '507f1f77bcf86cd799439011';
  t.mock.method(BranchService, 'aggregate', async (pipeline) => {
    assert.deepEqual(pipeline[0].$match, { status: 'ACTIVE', petTypes: 'CAT', price: { $gte: 0, $lte: 300000 } });
    const serviceMatch = pipeline.find((stage) => stage.$match?.['service.categoryId']).$match;
    assert.equal(serviceMatch['service.categoryId'].toString(), categoryId);
    assert.equal(serviceMatch['service.serviceType'], 'BOARDING');
    const search = pipeline.find((stage) => stage.$match?.$or?.[0]?.['service.name']).$match.$or;
    assert.deepEqual(search[0], { 'service.name': { $regex: 'Spa\\.\\*', $options: 'i' } });
    const facet = pipeline.at(-1).$facet;
    assert.deepEqual(facet.data[0], { $sort: { price: 1, _id: -1 } });
    assert.deepEqual(facet.data[1], { $skip: 6 });
    assert.deepEqual(facet.data[2], { $limit: 6 });
    return [{ data: [], count: [{ total: 7 }] }];
  });
  const response = await get('/services', { search: ' Spa.* ', categoryId, petType: 'CAT', serviceType: 'BOARDING', minPrice: '0', maxPrice: '300000', sort: 'priceAsc', page: '2', limit: '6' });
  assert.equal(response.status, 200);
  assert.deepEqual(response.pagination, { page: 2, limit: 6, total: 7, totalPages: 2 });
});

test('invalid service filters are rejected before querying MongoDB', async (t) => {
  const aggregate = t.mock.method(BranchService, 'aggregate', () => { throw new Error('Unexpected database read'); });
  for (const query of [
    { search: {} }, { search: 'x'.repeat(201) }, { categoryId: 'invalid' },
    { petType: 'BIRD' }, { serviceType: 'UNKNOWN' }, { sort: '__proto__' },
    { minPrice: '-1' }, { maxPrice: 'abc' }, { minPrice: '100', maxPrice: '50' },
    { page: '0' }, { page: '1.5' }, { page: '9007199254740991' }, { limit: '101' },
  ]) {
    const response = await get('/services', query);
    assert.equal(response.status, 400, JSON.stringify(query));
  }
  assert.equal(aggregate.mock.callCount(), 0);
});

test('no matching services returns an empty list and zero pagination', async (t) => {
  t.mock.method(BranchService, 'aggregate', async () => [{ data: [], count: [] }]);
  const response = await get('/services');
  assert.equal(response.status, 200);
  assert.deepEqual(response.data, []);
  assert.equal(response.pagination.total, 0);
  assert.equal(response.pagination.totalPages, 0);
});
