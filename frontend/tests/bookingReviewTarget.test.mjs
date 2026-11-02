import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveBookingReview, reviewData, pendingReviewData, reviewPayload } from '../src/features/customer/services/reviewData.js';

const booking = { _id: 'booking-id', bookingCode: 'BK-CODE', petId: { name: 'Kiki' } };

test('completed booking without a review opens a new review with the database booking ID', () => {
  const target = resolveBookingReview('booking-id', [pendingReviewData(booking)], []);
  assert.equal(target.isEditMode, false);
  assert.equal(target.tab, 'pending');
  assert.equal(reviewPayload({ ...target.item, rating: 5 }, true).bookingId, 'booking-id');
});

test('completed booking with an existing review opens that review for editing instead of an error', () => {
  const existing = reviewData({ _id: 'review-id', bookingId: booking, rating: 4, comment: 'Dịch vụ rất tốt' });
  for (const id of ['booking-id', 'BK-CODE']) {
    const target = resolveBookingReview(id, [], [existing]);
    assert.equal(target.isEditMode, true);
    assert.equal(target.tab, 'reviewed');
    assert.equal(target.item.id, 'review-id');
    assert.equal(target.item.comment, 'Dịch vụ rất tốt');
    assert.equal(reviewPayload(target.item, false).bookingId, undefined);
  }
});

test('existing review wins over a stale pending entry and unrelated bookings never open a form', () => {
  const existing = reviewData({ _id: 'review-id', bookingId: booking, rating: 4 });
  assert.equal(resolveBookingReview('booking-id', [pendingReviewData(booking)], [existing]).isEditMode, true);
  assert.equal(resolveBookingReview('other-booking', [pendingReviewData(booking)], [existing]), null);
});
