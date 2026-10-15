import { STATS } from "../../data/bookingData";

export default function BookingStatCards({ activeStatus, onSelectStatus }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const isSelected = activeStatus === stat.label || (stat.id === "total" && activeStatus === "Tất cả trạng thái");

        return (
          <button
            type="button"
            key={stat.id}
            onClick={() => {
              if (stat.id === "total") {
                onSelectStatus?.("Tất cả trạng thái");
              } else {
                onSelectStatus?.(activeStatus === stat.label ? "Tất cả trạng thái" : stat.label);
              }
            }}
            className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              isSelected
                ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">
                {stat.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}
              >
                <Icon size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {stat.value}
              </h3>
              <span
                className={`text-[10px] ${stat.descColor || "text-slate-400"} font-medium`}
              >
                {stat.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
