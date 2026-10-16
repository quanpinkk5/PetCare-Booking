import { Info } from "lucide-react";
import { METRICS_DATA } from "../../data/paymentData";

export default function PaymentMetrics() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS_DATA.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.id}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${metric.bg} ${metric.color}`}
            >
              <Icon size={22} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <span>{metric.title}</span>
                <Info size={12} className="cursor-pointer text-slate-400" />
              </div>

              <div className="mt-0.5 text-base font-bold tracking-tight text-slate-900">
                {metric.value}
              </div>

              <div
                className={`mt-0.5 flex flex-wrap items-center gap-1 text-[11px] font-medium ${metric.trendColor}`}
              >
                <span>{metric.trend}</span>
                <span className="font-normal text-slate-400">
                  {metric.sub}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
