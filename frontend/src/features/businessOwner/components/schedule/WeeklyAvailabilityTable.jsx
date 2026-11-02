
const WEEK_DAYS = [
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
  "Chủ Nhật",
];

const STATUS_STYLE = {
  AVAILABLE: "bg-emerald-50 text-emerald-700",
  FULL: "bg-red-50 text-red-600",
  BLOCKED: "bg-amber-50 text-amber-700",
  MAINTENANCE: "bg-orange-50 text-orange-700",
  OFF: "bg-slate-100 text-slate-500",
};

const formatDay = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}`;
};

const getSlotLabel = (slot) => {
  switch (slot.status) {
    case "BLOCKED":
      return "Đã khóa";
    case "MAINTENANCE":
      return "Bảo trì";
    case "OFF":
      return "Nghỉ / Đóng";
    case "FULL":
      return "Đã đầy";
    default:
      return `${slot.bookedCount}/${slot.capacity} chỗ`;
  }
};

export default function WeeklyAvailabilityTable({
  days = [],
  loading = false,
  error = "",
  viewMode = "week",
}) {
  // Tập hợp các khoảng giờ có trong tuần.
  // Giữ cả startTime và endTime để không gộp nhầm slot.
  const timeSlots = [
    ...new Set(
      days.flatMap((day) =>
        (day.slots || []).map(
          (slot) => `${slot.startTime}|${slot.endTime}`
        )
      )
    ),
  ].sort((a, b) => a.localeCompare(b));

  const title =
    viewMode === "week"
      ? "Lịch làm việc thực tế theo tuần"
      : "Lịch làm việc thực tế theo ngày";

  return (
    <section className="min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Đã áp dụng ngoại lệ và số Booking theo từng ngày
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-[11px]">
        <span className="text-emerald-600">● Còn chỗ</span>
        <span className="text-red-600">● Đã đầy</span>
        <span className="text-amber-600">● Đã khóa</span>
        <span className="text-orange-600">● Bảo trì</span>
        <span className="text-slate-500">● Nghỉ / Đóng</span>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Đang tải lịch làm việc...
        </p>
      ) : error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      ) : days.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Vui lòng chọn dịch vụ để xem lịch.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-center text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-3 py-3 text-left font-semibold">
                  Khung giờ
                </th>

                {days.map((day, index) => (
                  <th
                    key={day.date}
                    className="min-w-[110px] px-2 py-3 font-semibold"
                  >
                    <div>
                      {viewMode === "week"
                        ? WEEK_DAYS[index]
                        : "Ngày làm việc"}
                    </div>
                    <div className="mt-1 font-normal text-slate-400">
                      {formatDay(day.date)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((timeKey) => {
                const [startTime, endTime] = timeKey.split("|");

                return (
                  <tr key={timeKey} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-3 py-4 text-left font-medium text-slate-700">
                      {startTime} - {endTime}
                    </td>

                    {days.map((day) => {
                      const slot = (day.slots || []).find(
                        (item) =>
                          item.startTime === startTime &&
                          item.endTime === endTime
                      );

                      if (!slot) {
                        return (
                          <td
                            key={day.date}
                            className="px-2 py-3 text-slate-300"
                          >
                            {day.isClosed ? "Nghỉ cả ngày" : "—"}
                          </td>
                        );
                      }

                      return (
                        <td key={day.date} className="px-2 py-3">
                          <div
                            className={`mx-auto max-w-[120px] rounded-lg px-2 py-2 ${
                              STATUS_STYLE[slot.status] ||
                              STATUS_STYLE.OFF
                            }`}
                          >
                            <span className="font-semibold">
                              {getSlotLabel(slot)}
                            </span>

                            <div className="mt-0.5 text-[10px] opacity-80">
                              {slot.bookedCount}/{slot.capacity} đã đặt
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {timeSlots.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-500">
              {days.some((day) => day.isClosed)
                ? "Ngày được chọn đang nghỉ hoặc không có khung giờ hoạt động."
                : "Chưa có khung giờ làm việc."}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        Số liệu hiển thị theo dạng: đã đặt / sức chứa.
        Thay đổi lịch lặp lại được thực hiện trong chế độ quản lý lịch mặc định.
      </p>
    </section>
  );
}
