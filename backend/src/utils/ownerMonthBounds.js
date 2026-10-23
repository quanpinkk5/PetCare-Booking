// Booking calendar dates are stored at UTC midnight; choose the month in Vietnam.
module.exports = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "numeric" }).formatToParts(now);
  const year = Number(parts.find((item) => item.type === "year").value);
  const month = Number(parts.find((item) => item.type === "month").value) - 1;
  return { previous: new Date(Date.UTC(year, month - 1, 1)), current: new Date(Date.UTC(year, month, 1)), next: new Date(Date.UTC(year, month + 1, 1)) };
};
