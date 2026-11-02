const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const getWeekStart = (dateString) => {
  const date = parseLocalDate(dateString);

  // Thứ Hai là ngày đầu tuần
  const weekday = date.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;

  date.setDate(date.getDate() + diff);

  return formatLocalDate(date);
};

export const getWeekDates = (weekStart) => {
  const monday = parseLocalDate(weekStart);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return formatLocalDate(date);
  });
};

export const getTodayLocal = () => formatLocalDate(new Date());

const formatDisplayDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export default function ScheduleViewControls({
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
}) {
  const weekStart = getWeekStart(selectedDate);
  const weekDates = getWeekDates(weekStart);

  const weekLabel =
    `${formatDisplayDate(weekDates[0])} - ` + formatDisplayDate(weekDates[6]);

 
return (
  <div className="flex items-start gap-2.5">
    {/* Chế độ xem */}
    <div className="flex w-36 flex-col gap-1">
      <label className="mb-1 text-[9px] font-medium text-slate-400">
        Chế độ xem
      </label>

      <select
        value={viewMode}
        onChange={(e) => onViewModeChange(e.target.value)}
        className="h-[32px] w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
      >
        <option value="week">Xem theo tuần</option>
        <option value="day">Xem theo ngày</option>
      </select>
    </div>

    {/* Tuần / Ngày làm việc */}
    <div className="relative flex w-48 flex-col gap-1">
      <label className="mb-1 text-[9px] font-medium text-slate-400">
        {viewMode === "week" ? "Tuần làm việc" : "Ngày làm việc"}
      </label>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          if (e.target.value) {
            onDateChange(e.target.value);
          }
        }}
        className="h-[32px] w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
      />

      {/* Giữ dòng hiển thị tuần nhưng không ảnh hưởng căn hàng */}
      <p className="absolute left-0 top-full mt-1 whitespace-nowrap text-[10px] text-slate-500">
        {viewMode === "week"
          ? `Tuần: ${weekLabel}`
          : `Ngày: ${formatDisplayDate(selectedDate)}`}
      </p>
    </div>
  </div>
);

}
