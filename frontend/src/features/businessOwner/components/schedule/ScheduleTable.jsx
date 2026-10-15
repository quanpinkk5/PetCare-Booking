import { Clock, Info } from "lucide-react";
import { DAYS_OF_WEEK, TIME_SLOTS_DATA } from "../../data/scheduleData";

export default function ScheduleTable({ onSelectSlot }) {
  const getSlotStyle = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100";
      case "booked":
        return "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100";
      case "maintenance":
        return "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100";
      case "off":
      default:
        return "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100";
    }
  };

  return (
    <div className="w-full lg:col-span-9 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Lịch làm việc chi tiết theo tuần
          </h3>
          <p className="text-[11px] text-slate-400">
            Nhấp vào một khung giờ để xem chi tiết hoặc điều chỉnh trạng thái
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Còn chỗ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600">Đã đầy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Bảo trì/Khử khuẩn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="text-slate-600">Nghỉ / Đóng</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="py-2.5 px-3 font-semibold text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-slate-400" />
                  <span>Khung giờ</span>
                </div>
              </th>
              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day.key}
                  className="py-2.5 px-3 text-center font-semibold text-slate-700"
                >
                  <div>{day.fullLabel}</div>
                  <div className="text-[10px] font-normal text-slate-400">
                    {day.date}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TIME_SLOTS_DATA.map((row) => (
              <tr key={row.time} className="hover:bg-slate-50/50 transition-colors">
                <td className="whitespace-nowrap py-3 px-3 font-medium text-slate-700">
                  {row.time}
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const slot = row.slots[day.key];
                  if (!slot) {
                    return (
                      <td key={day.key} className="py-2 px-2 text-center text-slate-300">
                        -
                      </td>
                    );
                  }

                  return (
                    <td key={day.key} className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSlot?.({
                            time: row.time,
                            day: day.fullLabel,
                            date: day.date,
                            ...slot,
                          })
                        }
                        className={`w-full rounded-lg border py-1.5 px-2 text-[11px] font-medium transition cursor-pointer ${getSlotStyle(
                          slot.status
                        )}`}
                      >
                        <div>{slot.title}</div>
                        {slot.max > 0 && (
                          <div className="text-[9px] opacity-75">
                            {slot.booked}/{slot.max} chỗ
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
        <Info size={13} />
        <span>
          Cài đặt lịch áp dụng tuần hoàn mỗi tuần trừ các khung giờ được khai báo trong phần Ngoại lệ.
        </span>
      </div>
    </div>
  );
}
