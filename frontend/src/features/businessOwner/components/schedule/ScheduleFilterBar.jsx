import { ChevronDown, Calendar, CalendarX, Plus } from "lucide-react";
import ScheduleViewControls from "./ScheduleViewControls";
export default function ScheduleFilterBar({
  branches = [],
  services = [],
  branchId = "",
  branchServiceId = "",
  onBranchChange,
  onServiceChange,
  onAddSchedule,
  onAddException,
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
}) {
  return (
<section className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3.5 pb-7 pt-3.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Chi nhánh */}
        <div className="flex w-44 flex-col gap-1">
          <label className="mb-1 text-[9px] font-medium text-slate-400">
            Chi nhánh
          </label>

          <div className="relative">
            <select
              value={branchId}
              onChange={(e) => onBranchChange?.(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
            >
              {branches.length === 0 && (
                <option value="">Chưa có chi nhánh</option>
              )}

              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1.5 text-slate-400"
            />
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="flex w-44 flex-col gap-1">
          <label className="mb-1 text-[9px] font-medium text-slate-400">
            Dịch vụ
          </label>

          <div className="relative">
            <select
              value={branchServiceId}
              onChange={(e) => onServiceChange?.(e.target.value)}
              disabled={services.length === 0}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              {services.length === 0 && (
                <option value="">Chưa có dịch vụ</option>
              )}

              {services.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.serviceId?.name || "Dịch vụ"}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1.5 text-slate-400"
            />
          </div>
        </div>

        {/* Chế độ xem: hiện chỉ hỗ trợ lịch tuần,tuần hiện tạI */}
        {/* Hai ô cuối nằm cùng một hàng */}
        <div className="min-w-0 md:col-span-2">
          <ScheduleViewControls
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 sm:pt-0">
        <button
          type="button"
          onClick={onAddSchedule}
          disabled={!branchServiceId}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          <span>Thêm lịch</span>
        </button>

        <button
          type="button"
          onClick={onAddException}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm hover:bg-emerald-50"
        >
          <CalendarX size={14} />
          <span>Thêm ngoại lệ</span>
        </button>
      </div>
    </section>
  );
}
