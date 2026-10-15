import { BellRing, ChevronRight } from "lucide-react";
import { ALERTS } from "../../data/bookingData";

export default function PendingAlertsWidget({ onSelectAlert }) {
  return (
    <div className="bg-white p-4.5 rounded-2xl border border-rose-100 shadow-2xs relative overflow-hidden">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <BellRing size={14} />
          </div>
          <span>Cần duyệt gấp ({ALERTS.length})</span>
        </div>
        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
      </div>

      <div className="space-y-2.5">
        {ALERTS.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onSelectAlert?.(alert)}
            className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                alt={alert.customer}
                src={alert.img}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-white shadow-2xs"
              />
              <div className="min-w-0">
                <div className="font-bold text-[11px] text-slate-800 truncate group-hover:text-emerald-700 transition">
                  {alert.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{alert.service}</div>
                <div className="text-[10px] text-slate-500 font-medium truncate">
                  {alert.customer}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 ml-2">
              <span className="inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-700">
                Chờ duyệt
              </span>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">
                {alert.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
