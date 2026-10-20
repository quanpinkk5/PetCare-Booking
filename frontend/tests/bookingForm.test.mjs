import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { bookingApi } from '../src/features/customer/services/bookingApi.js';
import { boardingDays, bookingPet, eligibleServices, loadBookingBranches, bookingPayload } from '../src/features/customer/services/bookingFormData.js';

const pet = { id: 'pet-id', species: 'CAT' };
const branch = { id: 'branch-id' };
const offering = { _id: 'offering-id', branchId: branch.id, petTypes: ['CAT'], price: 0,
  pricingUnit: 'PER_SERVICE', durationMinutes: 45, capacity: 2,
  service: { name: 'Tắm', serviceType: 'APPOINTMENT' } };
const service = eligibleServices([offering], pet)[0];
const form = { pet, branch, service, date: '2099-01-01', time: '09:30', note: ' Nhẹ tay ',
  slots: [{ startTime: '09:30', remainingCapacity: 1 }] };

test('booking options retain free prices, species compatibility and real durations', () => {
  assert.equal(service.unitPrice, 0);
  assert.equal(service.durationMinutes, 45);
  assert.equal(eligibleServices([offering], { species: 'DOG' }).length, 0);
  assert.equal(eligibleServices([{ ...offering, capacity: 0 }], pet).length, 0);
  assert.equal(eligibleServices([{ ...offering, pricingUnit: 'PER_DAY' }], pet).length, 0);
  assert.equal(eligibleServices([{ ...offering, service: null }], pet).length, 0);
  assert.equal(bookingPet({ _id: 'cat', species: 'CAT' }).image, '');
});

test('appointment payload uses real IDs and contains no client price, discount or status', () => {
  assert.deepEqual(bookingPayload(form), { petId: 'pet-id', branchServiceId: 'offering-id',
    customerNote: 'Nhẹ tay', bookingDate: '2099-01-01', startTime: '09:30' });
  assert.throws(() => bookingPayload({ ...form, time: '09:00' }), /khung giờ/);
  assert.throws(() => bookingPayload({ ...form, slots: [{ startTime: '09:30', remainingCapacity: 0 }] }), /khung giờ/);
  assert.throws(() => bookingPayload({ ...form, branch: { id: 'other-branch' } }), /phù hợp/);
  assert.throws(() => bookingPayload({ ...form, pet: { id: 'dog', species: 'DOG' } }), /phù hợp/);
  assert.throws(() => bookingPayload({ ...form, date: '2020-01-01' }), /ngày hợp lệ/);
});

test('boarding excludes appointment fields and charges only nights before checkout', () => {
  const boarding = eligibleServices([{ ...offering, pricingUnit: 'PER_DAY', service: { name: 'Lưu trú', serviceType: 'BOARDING' } }], pet)[0];
  assert.equal(boardingDays('2099-01-01', '2099-01-04'), 3);
  assert.equal(boardingDays('2099-01-01', '2099-01-01'), 0);
  assert.equal(boardingDays('2099-01-01', '2099-04-02'), 0);
  assert.deepEqual(bookingPayload({ ...form, service: boarding, checkOutDate: '2099-01-04' }), {
    petId: pet.id, branchServiceId: service.id, customerNote: 'Nhẹ tay',
    checkInDate: '2099-01-01', checkOutDate: '2099-01-04',
  });
  assert.throws(() => bookingPayload({ ...form, service: boarding, checkOutDate: '2099-01-01' }), /Ngày trả/);
});

test('branch loader follows pagination and never invents rating, phone or address', async () => {
  const pages = [];
  const branches = await loadBookingBranches({ list: async ({ page }) => {
    pages.push(page);
    return { data: [{ _id: 'business-' + page, name: 'Business', averageRating: 0,
      totalReviews: 0, branches: [{ _id: 'branch-' + page, name: 'Branch', address: { detail: '12 A', province: 'HCM' } }] }],
      pagination: { totalPages: 2 } };
  } });
  assert.deepEqual(pages, [1, 2]);
  assert.equal(branches.length, 2);
  assert.equal(branches[0].rating, 0);
  assert.equal(branches[0].address, '12 A, HCM');
  assert.equal(branches[0].phone, 'Chưa cập nhật');
});

test('create, offering and slots call actual customer routes and preserve API failures', async (t) => {
  authApi.setAccessToken('customer');
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), options });
    assert.equal(options.headers.Authorization, 'Bearer customer');
    assert.equal(options.credentials, 'include');
    if (options.method === 'POST') return Response.json({ data: { _id: 'created-id', bookingCode: 'BK-SERVER', totalPrice: 0 } }, { status: 201 });
    return Response.json({ data: {} });
  });
  const payload = bookingPayload(form);
  const created = await bookingApi.create(payload);
  await bookingApi.offering('offering-id');
  await bookingApi.availability('offering-id', '2099-01-01');
  assert.equal(created.data._id, 'created-id');
  assert.equal(calls[0].url.pathname, '/api/customer/bookings');
  assert.deepEqual(JSON.parse(calls[0].options.body), payload);
  assert.equal(calls[1].url.pathname, '/api/customer/branchServices/offering-id');
  assert.equal(calls[2].url.pathname, '/api/customer/branchServices/offering-id/availableSlots');
  assert.equal(calls[2].url.searchParams.get('date'), '2099-01-01');
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Khung giờ đã hết chỗ' }, { status: 409 }));
  await assert.rejects(bookingApi.create(payload), /hết chỗ/);
});
