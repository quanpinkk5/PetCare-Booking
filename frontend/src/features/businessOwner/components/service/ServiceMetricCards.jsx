import { TrendingUp } from "lucide-react";
import { METRICS, BOOKING_METRIC } from "../../data/serviceData";

export default function ServiceMetricCards() {
    const BookingIcon = BOOKING_METRIC.icon;

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => {
                const Icon = metric.icon;

                return (
                    <div
                        key={metric.id}
                        className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-sm"
                    >
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${metric.iconBg} ${metric.iconColor}`}
                        >
                            <Icon size={22} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                                {metric.label}
                            </p>
                            <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                                {metric.value}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                                {metric.sub}
                            </p>
                        </div>
                    </div>
                );
            })}

            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookingIcon size={22} />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                        {BOOKING_METRIC.label}
                    </p>
                    <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                        {BOOKING_METRIC.value}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <TrendingUp size={12} />
                        <span>
                            {BOOKING_METRIC.trend}{" "}
                            <span className="font-normal text-slate-400">
                                {BOOKING_METRIC.sub}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
