import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { bookingApi } from '../src/features/customer/services/bookingApi.js';
import { apiBookingStatus, bookingCardData, bookingDetailData } from '../src/features/customer/services/bookingData.js';

test('list, detail and cancel use the authenticated booking API and database ID', async (t) => {
  authApi.setAccessToken('customer-token');
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ parsed: new URL(url), options });
    assert.equal(options.headers.Authorization, 'Bearer customer-token');
    return Response.json({ data: [] });
  });
  await bookingApi.list({ status: apiBookingStatus('in-progress'), time: 'week', search: 'Milo & Spa', page: 2, limit: 4 });
  await bookingApi.detail('database-id');
  await bookingApi.cancel('database-id', 'busy');
  assert.equal(calls[0].parsed.searchParams.get('status'), 'IN_PROGRESS');
  assert.equal(calls[0].parsed.searchParams.get('search'), 'Milo & Spa');
  assert.equal(calls[0].parsed.searchParams.get('page'), '2');
  assert.equal(calls[1].parsed.pathname, '/api/customer/bookings/database-id');
  assert.equal(calls[2].parsed.pathname, '/api/customer/bookings/database-id/cancel');
  assert.equal(calls[2].options.method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[2].options.body), { reason: 'busy' });
  assert.equal(apiBookingStatus('all'), undefined);
});

test('expired booking request refreshes the token and retries', async (t) => {
  authApi.setAccessToken('expired');
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls += 1;
    if (url.endsWith('/auth/refresh')) return Response.json({ data: { accessToken: 'fresh' } });
    return options.headers.Authorization === 'Bearer fresh' ? Response.json({ data: [] }) : Response.json({ message: 'Expired' }, { status: 401 });
  });
  await bookingApi.list();
  assert.equal(calls, 3);
});

test('cancellation errors reach the existing confirmation dialog', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Lịch đã thanh toán không thể hủy' }, { status: 409 }));
  await assert.rejects(bookingApi.cancel('id'), /đã thanh toán/);
});

const fixture = {
  _id: 'database-id', bookingCode: 'BK-CODE', status: 'CONFIRMED', paymentStatus: 'PAID', totalPrice: 0,
  bookingType: 'APPOINTMENT', bookingDate: '2026-10-20T00:00:00Z', startTime: '09:00', endTime: '10:00',
  petId: { _id: 'pet-1', name: 'Milo', breed: 'Poodle', gender: 'MALE', weight: 5, personality: 'Hiền' },
  branchServiceId: { _id: 'offering-1', durationMinutes: 60, serviceId: { name: 'Tắm', description: 'Tắm và vệ sinh' }, branchId: { name: 'Chi nhánh A', address: { detail: '123 Đường A', province: 'HCM' }, phone: '0901234567' } },
};
test('adapter preserves frontend fields while separating display code and navigation ID', () => {
  const card = bookingCardData(fixture);
  assert.equal(card.id, 'BK-CODE');
  assert.equal(card.recordId, 'database-id');
  assert.equal(card.petName, 'Milo');
  assert.equal(card.service, 'Tắm');
  assert.equal(card.location, 'Chi nhánh A');
  assert.equal(card.price, '0đ');
  assert.equal(card.statusType, 'confirmed');
  assert.equal(card.statusStep, 3);
  assert.equal(card.date, '20/10/2026');
  const detail = bookingDetailData(fixture);
  assert.equal(detail.pet.weight, '5kg');
  assert.equal(detail.facility.phone, '0901234567');
  assert.equal(detail.note, 'Không có ghi chú.');
  assert.equal(detail.paymentStatus, 'PAID');
});
test('boarding uses check-in/check-out dates and booked total, not the current offering price', () => {
  const card = bookingCardData({ ...fixture, bookingType: 'BOARDING', checkInDate: '2026-10-20', checkOutDate: '2026-10-23', numberOfDays: 3, totalPrice: 450000 });
  assert.equal(card.date, '20/10/2026 – 23/10/2026');
  assert.equal(card.time, '3 ngày lưu trú');
  assert.equal(card.price, '450.000đ');
});
test('deleted pets or services remain viewable without inventing customer data', () => {
  const detail = bookingDetailData({ ...fixture, petId: null, branchServiceId: null });
  assert.equal(detail.pet.name, 'Thú cưng không còn tồn tại');
  assert.equal(detail.service.name, 'Dịch vụ không còn tồn tại');
  assert.equal(detail.pet.gender, '');
  assert.equal(detail.pet.weight, 'Chưa cập nhật');
  assert.equal(detail.facility.phone, 'Chưa cập nhật');
});
