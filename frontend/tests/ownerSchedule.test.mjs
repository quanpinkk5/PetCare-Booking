import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authApi } from '../src/features/auth/services/authApi.js';
import { scheduleApi } from '../src/features/businessOwner/services/scheduleApi.js';
import { scheduleExceptionApi } from '../src/features/businessOwner/services/scheduleExceptionApi.js';
import { availabilityApi } from '../src/features/businessOwner/services/availabilityApi.js';
import { getTodayLocal, getWeekStart, getWeekDates, scheduleSlotKey, scheduleSlotPayload } from '../src/features/businessOwner/services/scheduleData.js';

test('week and day selection use Vietnam dates, including year rollover', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-01T18:00:00Z') });
  assert.equal(getTodayLocal(), '2026-11-02');
  assert.equal(getWeekStart('2027-01-03'), '2026-12-28');
  assert.deepEqual(getWeekDates('2026-12-28'), ['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03']);
});

test('legacy slots without IDs can be individually updated or removed; UI metadata is excluded from payloads', () => {
  const slots = [
    { startTime: '08:00', endTime: '12:00', capacity: 5, status: 'AVAILABLE' },
    { startTime: '13:30', endTime: '18:30', capacity: 5, status: 'AVAILABLE' },
  ];
  assert.notEqual(scheduleSlotKey(slots[0]), scheduleSlotKey(slots[1]));
  assert.deepEqual(slots.filter((slot) => scheduleSlotKey(slot) !== scheduleSlotKey(slots[0])), [slots[1]]);
  assert.equal(scheduleSlotKey({ ...slots[0], _id: 'real-id' }), 'real-id');
  assert.deepEqual(scheduleSlotPayload({ ...slots[0], _id: 'real-id', scheduleId: 'parent', day: 'Thứ Hai' }), slots[0]);
});

test('schedule, exceptions and actual availability use the backend routes and cancellation signals', async (t) => {
  authApi.setAccessToken('owner');
  const calls = [];
  const signal = new AbortController().signal;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), options });
    assert.equal(options.headers.Authorization, 'Bearer owner');
    return Response.json({ success: true, data: {} });
  });
  const schedule = { branchServiceId: 'offering', dayOfWeek: 'MONDAY', slots: [] };
  const exception = { branchServiceId: 'offering', date: '2026-11-02', type: 'CLOSED' };
  await scheduleApi.list('offering', signal);
  await scheduleApi.create(schedule);
  await scheduleApi.update('schedule-id', { slots: [] });
  await scheduleApi.remove('schedule-id');
  await scheduleExceptionApi.list('offering', signal);
  await scheduleExceptionApi.create(exception);
  await scheduleExceptionApi.update('exception-id', exception);
  await scheduleExceptionApi.remove('exception-id');
  await availabilityApi.getSlots('offering', '2026-11-02', signal);
  assert.equal(calls[0].url.pathname, '/api/business-owner/schedules');
  assert.equal(calls[0].url.searchParams.get('branchServiceId'), 'offering');
  assert.equal(calls[0].options.signal, signal);
  assert.deepEqual(JSON.parse(calls[1].options.body), schedule);
  assert.equal(calls[2].options.method, 'PATCH');
  assert.equal(calls[3].options.method, 'DELETE');
  assert.equal(calls[4].url.pathname, '/api/business-owner/schedule-exceptions');
  assert.deepEqual(JSON.parse(calls[5].options.body), exception);
  assert.equal(calls[6].options.method, 'PATCH');
  assert.equal(calls[7].options.method, 'DELETE');
  assert.equal(calls[8].url.pathname, '/api/public/availability/slots');
  assert.equal(calls[8].url.searchParams.get('date'), '2026-11-02');
  assert.equal(calls[8].options.signal, signal);
});

test('backend schedule conflict reaches the caller without being reported as saved', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Khung giờ đã có Booking' }, { status: 409 }));
  await assert.rejects(scheduleApi.update('schedule-id', { slots: [] }), /đã có Booking/);
});
