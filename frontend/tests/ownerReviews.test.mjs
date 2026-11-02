import test from 'node:test';
import assert from 'node:assert/strict';
import { authApi } from '../src/features/auth/services/authApi.js';
import { ownerReviewApi } from '../src/features/businessOwner/services/reviewApi.js';
import { ownerReviewData, filterOwnerReviews, summarizeOwnerReviews } from '../src/features/businessOwner/services/reviewView.js';

test('review API sends authenticated requests with encoded IDs and supported mutation fields', async (t) => {
  authApi.setAccessToken('owner');
  t.after(() => authApi.setAccessToken(null));
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer owner');
    calls.push({ path: new URL(url).pathname, ...options });
    return Response.json({ success: true, data: [] });
  });
  const signal = new AbortController().signal;
  await ownerReviewApi.list(signal);
  await ownerReviewApi.reply('review/id', 'Cảm ơn');
  await ownerReviewApi.hide('review/id', false);
  assert.equal(calls[0].path, '/api/businessOwner/reviews');
  assert.equal(calls[0].signal, signal);
  assert.equal(calls[1].path, '/api/businessOwner/reviews/review%2Fid/reply');
  assert.deepEqual(JSON.parse(calls[1].body), { content: 'Cảm ơn' });
  assert.equal(calls[2].method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[2].body), { hidden: false });
});

test('failed writes propagate so forms can retain their drafts', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không được phép' }, { status: 403 }));
  await assert.rejects(ownerReviewApi.reply('id', 'draft'), /Không được phép/);
  await assert.rejects(ownerReviewApi.hide('id', true), /Không được phép/);
});

test('adapter uses real customer, pet, reply author and Vietnam date while preserving moderation state', () => {
  const review = ownerReviewData({ _id: 'r', customerId: { fullName: 'An' }, rating: 4, status: 'VISIBLE', ownerHidden: true,
    createdAt: '2026-11-01T17:30:00Z', branchId: { _id: 'b', name: 'Branch' }, serviceId: { name: 'Boarding', serviceType: 'BOARDING' },
    bookingId: { status: 'COMPLETED', petId: { name: 'Miu', species: 'CAT', breed: 'Tabby' } },
    businessReply: { content: 'Cảm ơn', repliedAt: '2026-11-02T00:00:00Z' } }, { name: 'Actual business' });
  assert.equal(review.customer, 'An');
  assert.equal(review.pet.name, 'Miu');
  assert.equal(review.verified, true);
  assert.equal(review.reply.author, 'Actual business');
  assert.equal(review.date, '02/11/2026');
  assert.equal(review.hidden, true);
  assert.equal(review.status, 'VISIBLE');
});

test('anonymous and missing references never inherit sample identities, pets, bookings or replies', () => {
  const review = ownerReviewData({ _id: 'r', isAnonymous: true, customerId: { fullName: 'Private' }, bookingId: { petId: { name: 'Private pet' } } });
  assert.equal(review.customer, 'Khách hàng ẩn danh');
  assert.equal(review.pet.name, '—');
  assert.equal(review.reply, null);
  assert.equal(review.verified, false);
  assert.equal(ownerReviewData({ _id: 'r', customerId: null, bookingId: null }).pet.name, '—');
});

test('search, rating, reply and branch filters combine; duplicate branch names use IDs and sorting keeps time of day', () => {
  const base = ownerReviewData({ _id: '1', customerId: { fullName: 'An' }, branchId: { _id: 'a', name: 'Same name' }, rating: 3, createdAt: '2026-11-02T01:00:00Z' });
  const later = { ...base, id: '2', branchId: 'b', createdAt: '2026-11-02T02:00:00Z' };
  assert.deepEqual(filterOwnerReviews([base, later], { search: 'An', rating: 'low', branch: 'a' }).map((r) => r.id), ['1']);
  assert.deepEqual(filterOwnerReviews([base, later]).map((r) => r.id), ['2', '1']);
  assert.deepEqual(filterOwnerReviews([base, later], { sort: 'oldest' }).map((r) => r.id), ['1', '2']);
  assert.equal(filterOwnerReviews([{ ...base, reply: { content: 'Done' } }], { rating: 'unreplied' }).length, 0);
});

test('summary uses publicly visible reviews, including owner-collapsed cards, and derives all distributions', () => {
  const reviews = [5, 4, 3, 1].map((rating, index) => ({ id: String(index), rating, status: 'VISIBLE', hidden: index === 0 }));
  reviews.push({ rating: 5, status: 'HIDDEN' });
  const summary = summarizeOwnerReviews(reviews);
  assert.equal(summary.total, 4);
  assert.equal(summary.average, 3.25);
  assert.deepEqual(summary.sentiments.map((s) => s.count), [2, 1, 1]);
  assert.equal(summary.distribution[0].percent, 25);
  assert.equal(summary.metrics[3].value, '50%');
  assert.equal(summary.metrics[2].value, 4);
  assert.equal(summarizeOwnerReviews([]).metrics[0].value, '—');
});

test('monthly trend respects Vietnam midnight and year rollover without inventing growth from zero', () => {
  const reviews = ['2026-12-31T17:00:00Z', '2027-01-01T00:00:00Z', '2026-12-30T00:00:00Z'].map((createdAt) => ({ rating: 5, status: 'VISIBLE', createdAt }));
  assert.match(summarizeOwnerReviews(reviews, new Date('2026-12-31T17:00:00Z')).trend, /Tăng 100.0%/);
  assert.match(summarizeOwnerReviews(reviews.slice(0, 2), new Date('2027-01-01T00:00:00Z')).trend, /tháng trước chưa có/);
});
