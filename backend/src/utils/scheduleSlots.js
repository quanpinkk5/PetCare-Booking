// Legacy schedules store only working hours. Read missing configuration from
// the offering without changing persisted data or overriding explicit limits.
const normalizeScheduleSlot = (slot, defaultCapacity) => {
  const value = slot.capacity ?? defaultCapacity;
  const capacity = value == null ? null : Number(value);
  return {
    ...slot,
    capacity: Number.isInteger(capacity) && capacity >= 0 ? capacity : null,
    status: slot.status || "AVAILABLE",
  };
};

module.exports = { normalizeScheduleSlot };
