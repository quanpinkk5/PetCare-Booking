import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { reviewApi } from '../src/features/customer/services/reviewApi.js';
import { homeReviewData } from '../src/features/customer/services/homeReviewData.js';

test('homepage reviews load from the public endpoint without a logged-in session', async (t) => {
  authApi.setAccessToken(null);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/reviews/featured');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ success: true, data: [] });
  });
  assert.deepEqual((await reviewApi.featured()).data, []);
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Không thể tải đánh giá' }, { status: 503 }));
  await assert.rejects(reviewApi.featured(), /Không thể tải đánh giá/);
});

test('homepage cards preserve actual ratings, Vietnamese dates and anonymous identities', () => {
  const review = homeReviewData({ _id: 'review-1', rating: 2, comment: 'Cần cải thiện',
    customer: { fullName: 'Khách hàng ẩn danh', avatar: '' }, createdAt: '2026-10-19T18:30:00Z',
    service: { name: 'Tắm' }, business: { _id: 'business', name: 'Pet Spa' }, verified: true });
  assert.equal(review.rating, 2);
  assert.equal(review.name, 'Khách hàng ẩn danh');
  assert.equal(review.img, '');
  assert.equal(review.date, '20/10/2026');
  assert.equal(review.businessId, 'business');
  assert.equal(review.verified, true);
  assert.equal(review.review, 'Cần cải thiện');
});

test('missing review metadata never becomes a fabricated five-star testimonial or avatar', () => {
  const review = homeReviewData({ _id: 'review', createdAt: 'invalid' });
  assert.equal(review.name, 'Khách hàng');
  assert.equal(review.img, '');
  assert.equal(review.date, '');
  assert.equal(review.rating, 0);
  assert.equal(review.verified, false);
  assert.equal(review.review, 'Khách hàng chưa viết nhận xét.');
});
