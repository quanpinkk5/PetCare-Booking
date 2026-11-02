import { getWeekStart, getWeekDates } from "../../services/scheduleData";

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
      <p className="mt-1 whitespace-nowrap text-[10px] text-slate-500">
        {viewMode === "week"
          ? `Tuần: ${weekLabel}`
          : `Ngày: ${formatDisplayDate(selectedDate)}`}
      </p>
    </div>
  </div>
);

}
