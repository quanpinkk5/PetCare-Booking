export const scheduleSlotKey = (slot) => String(slot._id || `${slot.startTime}|${slot.endTime}`);

export const scheduleSlotPayload = (slot) => ({
  startTime: slot.startTime,
  endTime: slot.endTime,
  capacity: slot.capacity,
  status: slot.status,
});

export const getTodayLocal = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};

export const getWeekStart = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  const weekday = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + (weekday === 0 ? -6 : 1 - weekday));
  return date.toISOString().slice(0, 10);
};

export const getWeekDates = (weekStart) => Array.from({ length: 7 }, (_, index) => {
  const date = new Date(`${weekStart}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString().slice(0, 10);
});
