import {
    Star,
    MessageCircle,
    MessagesSquare,
    Smile,
} from "lucide-react";
import { REVIEW_METRICS } from "../../data/reviewData";

const ICONS = {
    star: Star,
    message: MessageCircle,
    messages: MessagesSquare,
    smile: Smile,
};

const COLORS = {
    emerald: {
        wrapper: "bg-emerald-50 text-emerald-600",
        growth: "text-emerald-600",
    },
    blue: {
        wrapper: "bg-blue-50 text-blue-600",
        growth: "text-emerald-600",
    },
    amber: {
        wrapper: "bg-amber-50 text-amber-500",
        growth: "text-slate-500",
    },
    teal: {
        wrapper: "bg-teal-50 text-teal-600",
        growth: "text-emerald-600",
    },
};

function ReviewMetricCard({ metric }) {
    const Icon = ICONS[metric.icon];
    const color = COLORS[metric.color];

    return (
        <article className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
                <span className="text-xs font-semibold text-slate-500">
                    {metric.title}
                </span>

                <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900">
                        {metric.value}
                    </span>

                    {metric.suffix && (
                        <span className="text-slate-400 text-sm font-medium">
                            {metric.suffix}
                        </span>
                    )}
                </div>

                {metric.description && (
                    <p className="text-[11px] text-slate-400">
                        {metric.description}
                    </p>
                )}

                {metric.growth && (
                    <div className={`pt-1 flex items-center text-[11px] font-semibold ${color.growth}`}>
                        <span>
                            {metric.growth}{" "}
                            <span className="font-normal text-slate-400">
                                {metric.growthDescription}
                            </span>
                        </span>
                    </div>
                )}

                {!metric.growth && (
                    <div className="pt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>{metric.growthDescription}</span>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    </div>
                )}
            </div>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.wrapper}`}>
                <Icon size={19} />
            </div>
        </article>
    );
}

export default function ReviewMetricCards() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {REVIEW_METRICS.map((metric) => (
                <ReviewMetricCard key={metric.title} metric={metric} />
            ))}
        </section>
    );
}