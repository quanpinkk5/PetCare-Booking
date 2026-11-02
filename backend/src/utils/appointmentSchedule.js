const { normalizeScheduleSlot } = require('./scheduleSlots');

const timeToMinutes = (value) => {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const toRange = (item) => {
  const start = timeToMinutes(item.startTime);
  const end = timeToMinutes(item.endTime);
  return start !== null && end !== null && start < end ? { ...item, start, end } : null;
};

// Both the time picker and booking submission must use the owner's schedule.
// Custom hours replace the weekly template, including when it has OFF slots.
const getAppointmentRanges = (schedule, exceptions, defaultCapacity) => {
  if (exceptions.some((item) => item.type === 'CLOSED')) return [];
  const custom = exceptions.filter((item) => item.type === 'CUSTOM_HOURS');
  const slots = custom.length
    ? custom.map((item) => ({ ...item, status: 'AVAILABLE' }))
    : schedule?.slots || [];
  return slots.map((item) => normalizeScheduleSlot(item, defaultCapacity))
    .filter((item) => item.status === 'AVAILABLE')
    .map(toRange).filter(Boolean).sort((a, b) => a.start - b.start);
};

const getAppointmentCapacity = (range, start, end, exceptions) => {
  // BLOCK_SLOT closes every appointment touching the blocked interval.
  const blocked = exceptions.filter((item) => item.type === 'BLOCK_SLOT')
    .map(toRange).filter(Boolean)
    .some((item) => start < item.end && end > item.start);
  return blocked ? 0 : range.capacity;
};

module.exports = { getAppointmentRanges, getAppointmentCapacity };
