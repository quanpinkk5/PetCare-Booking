import test from 'node:test';
import assert from 'node:assert/strict';
import { petDiaryData, diaryDateKey } from '../src/features/customer/services/petDiaryData.js';
import { petDiaryApi } from '../src/features/customer/services/petDiaryApi.js';
import { authApi } from '../src/features/auth/services/authApi.js';

const booking = {
  _id: 'booking-id', bookingCode: 'BK-DIARY', status: 'COMPLETED', bookingType: 'BOARDING',
  checkInDate: '2026-11-01', checkOutDate: '2026-11-04', numberOfDays: 3,
  petId: { name: 'Kiki', gender: 'FEMALE', weight: 0 },
  branchServiceId: { branchId: { name: 'Chi nhánh A', businessId: 'business-id' }, serviceId: { name: 'Lưu trú' } },
};

test('pet diary loads through the authenticated booking route with cancellation support', async (t) => {
  authApi.setAccessToken('customer-diary');
  t.after(() => authApi.setAccessToken(null));
  const signal = new AbortController().signal;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/customer/bookings/booking%2Fid/diary');
    assert.equal(options.headers.Authorization, 'Bearer customer-diary');
    assert.equal(options.signal, signal);
    return Response.json({ data: { booking, entries: [] } });
  });
  assert.equal((await petDiaryApi.detail('booking/id', { signal })).data.booking._id, 'booking-id');
});

test('activity dates follow Vietnam midnight and summaries contain only the selected day', () => {
  const entries = [
    { _id: 'late', activityType: 'EATING', activityTime: '2026-11-01T17:00:00Z', description: 'Bữa tối', images: ['https://example.com/meal.jpg', { url: 'https://example.com/meal.jpg' }, { url: 'javascript:bad' }] },
    { _id: 'early', activityType: 'WALKING', activityTime: '2026-11-01T16:59:59Z' },
  ];
  assert.equal(diaryDateKey(entries[0].activityTime), '2026-11-02');
  const diary = petDiaryData(booking, entries, '2026-11-02', new Date('2026-11-02T01:00:00Z'));
  assert.equal(diary.activities.length, 1);
  assert.equal(diary.activities[0].desc, 'Bữa tối');
  assert.equal(diary.activities[0].time, '00:00');
  assert.equal(diary.summary.meals, '1 bữa');
  assert.equal(diary.summary.walks, '0 lần');
  assert.equal(diary.todayPhotos.length, 1);
  assert.equal(diary.pet.currentDay, 2);
  assert.equal(diary.messageUrl, '/messages?businessId=business-id');
});

test('empty diaries and removed relations do not inherit demo activities, photos, phone or pet gender', () => {
  const diary = petDiaryData({ ...booking, petId: null, branchServiceId: null }, [], '', new Date('2026-11-02T00:00:00Z'));
  assert.deepEqual(diary.activities, []);
  assert.deepEqual(diary.todayPhotos, []);
  assert.equal(diary.summary.photosCount, 0);
  assert.equal(diary.pet.genderSymbol, '');
  assert.equal(diary.pet.avatar, '');
  assert.equal(diary.facility.phone, '');
  assert.equal(diary.messageUrl, '');
  assert.equal(diary.facility.checkInTime, 'Chưa có cập nhật');
});

test('appointments retain appointment times and default to the latest actual journal date', () => {
  const diary = petDiaryData({ ...booking, bookingType: 'APPOINTMENT', bookingDate: '2026-11-01', startTime: '09:00', endTime: '10:00' },
    [{ _id: 'entry', activityType: 'UNKNOWN', createdAt: '2026-11-01T02:00:00Z' }], '', new Date('2026-11-02T00:00:00Z'));
  assert.equal(diary.isBoarding, false);
  assert.equal(diary.pet.appointmentTime, '09:00 - 10:00');
  assert.equal(diary.selectedDate, '2026-11-01');
  assert.equal(diary.activities[0].title, 'Cập nhật chăm sóc');
  assert.equal(diary.pet.weight, '0kg');
});
