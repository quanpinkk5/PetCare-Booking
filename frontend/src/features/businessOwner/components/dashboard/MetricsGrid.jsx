import { METRICS } from "../../data/dashboardData";

export default function MetricsGrid() {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => {
                const Icon = metric.icon;

                return (
                    <div
                        key={metric.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                    >
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${metric.bg} ${metric.text}`}
                        >
                            <Icon className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                                {metric.title}
                            </p>

                            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900">
                                    {metric.value}
                                </span>

                                <span
                                    className={`flex items-center text-[11px] font-semibold ${metric.trendColor}`}
                                >
                                    {metric.trend}
                                </span>
                            </div>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                                {metric.subtitle}
                            </p>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}