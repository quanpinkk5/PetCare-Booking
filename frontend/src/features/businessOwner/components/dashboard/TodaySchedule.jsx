import { ArrowRight, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TODAY_SCHEDULE } from "../../data/dashboardData";

export default function TodaySchedule() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-800">
            Lịch hôm nay
          </h4>

          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <CalendarDays size={14} />
            22/05/2025
          </span>
        </div>

        <div className="relative ml-2 space-y-3 border-l-2 border-emerald-500/30 pl-3">
          {TODAY_SCHEDULE.map((schedule) => (
            <div key={schedule.id} className="relative pl-3">
              <div
                className={`absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${schedule.dot}`}
              />

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  {schedule.time}
                </span>

                <span
                  className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${schedule.statusClass}`}
                >
                  {schedule.status}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg">{schedule.emoji}</span>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {schedule.pet}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {schedule.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3 text-center">
        <button
          type="button"
          onClick={() => navigate("/business/schedule")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Xem tất cả lịch hôm nay <ArrowRight size={12} />
        </button>
      </div>
    </section>
  );
}