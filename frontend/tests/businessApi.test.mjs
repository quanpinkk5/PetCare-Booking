import assert from 'node:assert/strict';
import { test } from 'node:test';
import { businessApi } from '../src/features/customer/services/businessApi.js';
import { authApi } from '../src/features/auth/services/authApi.js';
import { formatAddress, imageUrl, openingHoursText, servicePrice, businessRating } from '../src/features/customer/services/businessData.js';

test('business list sends encoded filters and server pagination without requiring login', async (t) => {
  authApi.setAccessToken(null);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.pathname, '/api/customer/businesses');
    assert.equal(parsed.searchParams.get('search'), 'Pet & Spa');
    assert.equal(parsed.searchParams.get('location'), 'Hà Nội');
    assert.equal(parsed.searchParams.get('minRating'), '4.5');
    assert.equal(parsed.searchParams.get('sort'), 'rating');
    assert.equal(parsed.searchParams.get('page'), '2');
    assert.equal(parsed.searchParams.get('limit'), '8');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ data: [], pagination: { page: 2, total: 10, totalPages: 2 } });
  });
  const result = await businessApi.list({ search: 'Pet & Spa', location: 'Hà Nội', minRating: 4.5, sort: 'rating', page: 2, limit: 8 });
  assert.equal(result.pagination.total, 10);
});

test('detail, branches and services use the selected database IDs', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(new URL(url).pathname);
    return Response.json({ data: {} });
  });
  await businessApi.detail('business-1');
  await businessApi.branches('business-1');
  await businessApi.services('branch-2');
  assert.deepEqual(calls, ['/api/customer/businesses/business-1', '/api/customer/businesses/business-1/branches', '/api/customer/branches/branch-2/services']);
});

test('unavailable businesses surface the API error without returning mock data', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không tìm thấy doanh nghiệp' }, { status: 404 }));
  await assert.rejects(businessApi.detail('missing'), /Không tìm thấy doanh nghiệp/);
});

test('address and image formatting supports existing mixed schema values', () => {
  assert.equal(formatAddress({ detail: '123 Đường A', ward: 'Phường B', district: 'Quận C', province: 'Hà Nội' }), '123 Đường A, Phường B, Quận C, Hà Nội');
  assert.equal(formatAddress('  Địa chỉ cũ  '), 'Địa chỉ cũ');
  assert.equal(formatAddress(null), '');
  assert.equal(imageUrl([null, { url: 'https://example.com/image.png' }]), 'https://example.com/image.png');
  assert.equal(imageUrl([], 'logo.png'), 'logo.png');
  assert.equal(imageUrl(undefined), '');
});

test('service prices preserve zero, pricing units and unknown data', () => {
  assert.equal(servicePrice({ price: 0 }), '0 ₫ / dịch vụ');
  assert.equal(servicePrice({ price: 150000, pricingUnit: 'PER_DAY' }), '150.000 ₫ / ngày');
  assert.equal(servicePrice({}), 'Liên hệ cơ sở');
});

test('opening hours show actual values and never invent an opening schedule', () => {
  assert.deepEqual(openingHoursText([]), ['Chưa cập nhật giờ mở cửa']);
  assert.deepEqual(openingHoursText([null, {}]), ['Chưa cập nhật giờ mở cửa']);
  assert.deepEqual(openingHoursText([{ day: 'T2', openTime: '08:00', closeTime: '18:00' }, { day: 'CN', isClosed: true }]), ['T2: 08:00 - 18:00', 'CN: Đóng cửa']);
});

test('business review requests use a scoped public endpoint with rating, sorting and pagination', async (t) => {
  authApi.setAccessToken(null);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.pathname, '/api/businesses/business-1/reviews');
    assert.equal(parsed.searchParams.get('page'), '2');
    assert.equal(parsed.searchParams.get('rating'), '5');
    assert.equal(parsed.searchParams.get('sort'), 'highest');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ data: [], summary: { totalReviews: 0 }, pagination: { page: 2 } });
  });
  assert.equal((await businessApi.reviews('business-1', { page: 2, rating: 5, sort: 'highest' })).summary.totalReviews, 0);
});

test('unreviewed businesses never get a fabricated 4.9 or legacy rating', () => {
  for (const business of [{}, { averageRating: 4.9, totalReviews: 0 }, { rating: 5, reviewsCount: 100 }, { averageRating: 5, totalReviews: -1 }]) {
    assert.deepEqual(businessRating(business), { count: 0, hasRating: false, label: 'Chưa có đánh giá' });
  }
});

test('business cards display real low and fractional scores and protect invalid averages', () => {
  assert.deepEqual(businessRating({ averageRating: 2, totalReviews: 3 }), { count: 3, hasRating: true, label: '2.0' });
  assert.deepEqual(businessRating({ averageRating: 4.3, totalReviews: 10 }), { count: 10, hasRating: true, label: '4.3' });
  for (const averageRating of [NaN, Infinity, undefined, '4.8', 8]) {
    assert.equal(businessRating({ averageRating, totalReviews: 1 }).label, 'Chưa có điểm');
  }
});
