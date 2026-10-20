import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { reviewApi } from '../src/features/customer/services/reviewApi.js';
import { reviewData, pendingReviewData, reviewPayload } from '../src/features/customer/services/reviewData.js';

test('review list, pending and mutations use authenticated customer endpoints', async (t) => {
  authApi.setAccessToken('customer-token');
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer customer-token');
    requests.push({ path: new URL(url).pathname, options });
    return Response.json({ data: [] });
  });
  await reviewApi.list(); await reviewApi.pending();
  await reviewApi.create({ bookingId: 'booking-1', rating: 5 });
  await reviewApi.update('review-1', { rating: 4 });
  await reviewApi.remove('review-1'); await reviewApi.helpful('review-1', true);
  assert.deepEqual(requests.map((item) => item.path), ['/api/customer/reviews', '/api/customer/reviews/pending-bookings', '/api/customer/reviews', '/api/customer/reviews/review-1', '/api/customer/reviews/review-1', '/api/customer/reviews/review-1/helpful']);
  assert.equal(requests[2].options.method, 'POST');
  assert.equal(requests[4].options.method, 'DELETE');
  assert.deepEqual(JSON.parse(requests[5].options.body), { liked: true });
});
test('save and delete failures propagate without reporting success', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không tìm thấy đánh giá của bạn' }, { status: 404 }));
  await assert.rejects(reviewApi.update('other', { rating: 5 }), /Không tìm thấy/);
  await assert.rejects(reviewApi.remove('other'), /Không tìm thấy/);
});
test('adapter separates booking display code from its database ID and preserves saved fields', () => {
  const item = reviewData({ _id: 'review-1', bookingId: { _id: 'booking-1', bookingCode: 'BK-CODE', totalPrice: 0, bookingDate: '2026-10-20', petId: { name: 'Milo', gender: 'MALE' } }, businessId: { _id: 'biz-1', name: 'Spa A' }, branchId: { name: 'Chi nhánh A' }, serviceId: { name: 'Tắm' }, rating: 2, subRatings: { care: 2 }, tags: ['Góp ý'], isAnonymous: true, businessReply: { content: 'Cảm ơn', repliedAt: '2026-10-20' }, likesCount: 3, isLiked: true });
  assert.equal(item.bookingRecordId, 'booking-1'); assert.equal(item.bookingId, 'BK-CODE');
  assert.equal(item.petName, 'Milo'); assert.equal(item.servicePrice, '0đ');
  assert.equal(item.ratingLabel, 'Chưa hài lòng'); assert.equal(item.isAnonymous, true);
  assert.equal(item.subRatings.care, 2); assert.equal(item.businessReply.content, 'Cảm ơn');
  assert.equal(item.likesCount, 3);
});
test('pending adapter uses completed booking data without invented rewards', () => {
  const item = pendingReviewData({ _id: 'booking-1', bookingCode: 'BK-CODE', totalPrice: 150000, petId: { name: 'Milo' }, branchServiceId: { branchId: { name: 'Branch A', businessId: { _id: 'biz-1', name: 'Spa A' } }, serviceId: { name: 'Tắm' } } });
  assert.equal(item.businessName, 'Spa A'); assert.equal(item.serviceName, 'Tắm');
  assert.equal(item.rewardPoints, undefined); assert.equal(item.voucherPromo, undefined);
});
test('only editable review fields are sent, never client ownership or business reply', () => {
  const source = { id: 'review-1', bookingRecordId: 'booking-1', bookingId: 'BK-CODE', businessId: 'fake-owner', businessReply: { content: 'fake' }, rating: 5, comment: 'Trải nghiệm tốt', images: ['https://example.com/image.png'], tags: ['Tốt'], subRatings: { care: 5 }, isAnonymous: true };
  const create = reviewPayload(source, true);
  assert.equal(create.bookingId, 'booking-1');
  assert.equal(create.businessId, undefined); assert.equal(create.businessReply, undefined);
  assert.equal(reviewPayload(source, false).bookingId, undefined);
  assert.equal(create.images.length, 1);
});
