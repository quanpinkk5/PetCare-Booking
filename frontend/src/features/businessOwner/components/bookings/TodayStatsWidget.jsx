import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function TodayStatsWidget() {
  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Calendar size={16} className="text-emerald-600" />
          <span>Hôm nay (22/05/2025)</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          Trực tiếp
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Tổng lịch hẹn
          </span>
          <span className="font-bold text-slate-800">12</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Chờ xác nhận
          </span>
          <span className="font-bold text-amber-600">3</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Đang phục vụ
          </span>
          <span className="font-bold text-blue-600">4</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Đã hoàn thành
          </span>
          <span className="font-bold text-emerald-600">5</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-slate-400">Tiến độ phục vụ hôm nay</span>
          <span className="font-bold text-emerald-600">75%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
          <div className="bg-emerald-500 h-2" style={{ width: "42%" }}></div>
          <div className="bg-blue-500 h-2" style={{ width: "33%" }}></div>
          <div className="bg-amber-400 h-2" style={{ width: "25%" }}></div>
        </div>
      </div>

      <Link
        to="/business/schedule"
        className="mt-4 block text-center py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
      >
        Xem lịch làm việc chi tiết →
      </Link>
    </div>
  );
}
