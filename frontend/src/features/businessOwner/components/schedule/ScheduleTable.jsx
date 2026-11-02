
import { useMemo } from "react";
import { Clock, Info } from "lucide-react";

const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Thứ Hai" },
  { key: "TUESDAY", label: "Thứ Ba" },
  { key: "WEDNESDAY", label: "Thứ Tư" },
  { key: "THURSDAY", label: "Thứ Năm" },
  { key: "FRIDAY", label: "Thứ Sáu" },
  { key: "SATURDAY", label: "Thứ Bảy" },
  { key: "SUNDAY", label: "Chủ Nhật" },
];

const STATUS_CONFIG = {
  AVAILABLE: {
    title: "Đang hoạt động",
    className:
      "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
  },
  MAINTENANCE: {
    title: "Bảo trì/Khử khuẩn",
    className:
      "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  },
  OFF: {
    title: "Nghỉ / Đóng",
    className:
      "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100",
  },
};

export default function ScheduleTable({
  schedules = [],
  onSelectSlot,
}) {
  // Gom các khung giờ từ dữ liệu API thành từng hàng của bảng
  const timeRows = useMemo(() => {
    const rows = new Map();

    for (const schedule of schedules) {
      if (!schedule.isActive) continue;

      for (const slot of schedule.slots || []) {
        const time = `${slot.startTime} - ${slot.endTime}`;

        if (!rows.has(time)) {
          rows.set(time, {
            time,
            startTime: slot.startTime,
            slots: {},
          });
        }

        rows.get(time).slots[schedule.dayOfWeek] = {
          ...slot,
          scheduleId: schedule._id,
          dayOfWeek: schedule.dayOfWeek,
        };
      }
    }

    return [...rows.values()].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [schedules]);

  return (
    <div className="w-full lg:col-span-9 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Lịch làm việc chi tiết theo tuần
          </h3>

          <p className="text-[11px] text-slate-400">
            Nhấp vào một khung giờ để xem chi tiết hoặc điều chỉnh trạng thái
          </p>
        </div>

        {/* Chú thích màu sắc */}
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Đang hoạt động</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">
              Bảo trì/Khử khuẩn
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="text-slate-600">Nghỉ / Đóng</span>
          </div>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-3 py-2.5 font-semibold text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-slate-400" />
                  <span>Khung giờ</span>
                </div>
              </th>

              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day.key}
                  className="px-3 py-2.5 text-center font-semibold text-slate-700"
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {timeRows.map((row) => (
              <tr
                key={row.time}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700">
                  {row.time}
                </td>

                {DAYS_OF_WEEK.map((day) => {
                  const slot = row.slots[day.key];

                  if (!slot) {
                    return (
                      <td
                        key={day.key}
                        className="px-2 py-2 text-center text-slate-300"
                      >
                        -
                      </td>
                    );
                  }

                  const config =
                    STATUS_CONFIG[slot.status] ||
                    STATUS_CONFIG.OFF;

                  return (
                    <td
                      key={day.key}
                      className="px-2 py-2 text-center"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSlot?.({
                            ...slot,
                            time: row.time,
                            day: day.label,
                          })
                        }
                        className={`w-full cursor-pointer rounded-lg border px-2 py-1.5 text-[11px] font-medium transition ${config.className}`}
                      >
                        <div>{config.title}</div>

                        <div className="text-[9px] opacity-75">
                          {slot.capacity == null ? "Chưa cấu hình sức chứa" : `Tối đa ${slot.capacity} chỗ`}
                        </div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Chưa có lịch */}
        {timeRows.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            Chưa có lịch làm việc cho dịch vụ này.
            <p className="mt-1 text-xs text-slate-400">
              Nhấn "Thêm lịch" để bắt đầu thiết lập.
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <Info size={13} />
        <span>
          Lịch được áp dụng lặp lại hằng tuần, trừ các ngày có
          ngoại lệ được khai báo.
        </span>
      </div>
    </div>
  );
}
