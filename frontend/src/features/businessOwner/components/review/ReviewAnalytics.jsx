import {
    Star,
    Info,
    Award,
    ArrowRight,
    Smile,
} from "lucide-react";

function RatingDistribution({ distribution, loading }) {
    return (
        <div className="md:col-span-5 space-y-2 text-xs">
            {distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-10 text-slate-500 font-medium shrink-0">
                        {row.stars} sao
                    </span>

                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${row.color} rounded-full`}
                            style={{ width: `${row.percent}%` }}
                        />
                    </div>

                    <span className="w-[76px] text-right font-medium text-slate-500 text-[11px] shrink-0">
                        {loading ? '—' : `${row.count} (${row.percent.toFixed(1)}%)`}
                    </span>
                </div>
            ))}
        </div>
    );
}

function RatingSummary({ summary, loading }) {
    return (
        <div className="md:col-span-4 md:pr-3 md:border-r border-slate-100 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900">{loading || !summary.total ? '—' : summary.average.toFixed(1)}</span>
                <span className="text-slate-400 font-semibold text-base">/ 5</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400 my-2 text-base">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill={!loading && index < Math.round(summary.average) ? 'currentColor' : 'none'} strokeWidth={1.5} />
                ))}
            </div>

            <p className="font-bold text-slate-800 text-xs mt-1">
                {loading ? 'Đang tải đánh giá...' : !summary.total ? 'Chưa có đánh giá công khai' : summary.average >= 4 ? 'Khách hàng hài lòng' : 'Cần lắng nghe thêm góp ý'}
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {loading ? 'Vui lòng chờ trong giây lát.' : `Dựa trên ${summary.total} đánh giá đang hiển thị công khai.`}
            </p>
        </div>
    );
}

function PositiveTrend({ summary, loading, onInspect }) {
    return (
        <div className="md:col-span-3 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm shadow-emerald-500/30">
                <Award size={20} />
            </div>

            <h4 className="font-bold text-slate-800 text-xs">
                Xu hướng đánh giá 5 sao
            </h4>

            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                {loading ? 'Đang tải dữ liệu...' : summary.trend}
            </p>

            <button
                type="button"
                onClick={() => onInspect('5')}
                disabled={loading}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-2"
            >
                Xem chi tiết <ArrowRight size={12} />
            </button>
        </div>
    );
}

function RatingAnalytics({ summary, loading, onInspect }) {
    return (
        <section className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 mb-5">
                <h3 className="font-bold text-slate-900 text-sm">
                    Tổng quan đánh giá
                </h3>
                <Info size={13} className="text-slate-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <RatingSummary summary={summary} loading={loading} />
                <RatingDistribution distribution={summary.distribution} loading={loading} />
                <PositiveTrend summary={summary} loading={loading} onInspect={onInspect} />
            </div>
        </section>
    );
}

function SentimentChart({ summary, loading }) {
    const positive = summary.sentiments[0].percent;
    const neutralEnd = positive + summary.sentiments[1].percent;
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner shrink-0"
                style={{
                    background:
                        loading || !summary.total ? '#e2e8f0' : `conic-gradient(#10b981 0% ${positive}%, #3b82f6 ${positive}% ${neutralEnd}%, #ef4444 ${neutralEnd}% 100%)`,
                }}
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Smile size={27} className="text-emerald-600" />
                </div>
            </div>

            <div className="space-y-2 flex-1 text-xs">
                {summary.sentiments.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center justify-between gap-2"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-slate-600 font-medium">
                                {item.label}
                            </span>
                        </div>

                        <span className="font-bold text-slate-800 whitespace-nowrap">
                            {loading ? '—' : `${item.percent}%`}{" "}
                            <span className="text-slate-400 font-normal text-[11px]">
                                ({loading ? '—' : item.count})
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SentimentAnalytics({ summary, loading, onInspect }) {
    return (
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-1.5 mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">
                        Tổng quan cảm xúc
                    </h3>
                    <Info size={13} className="text-slate-300" aria-label="Phân loại theo số sao đánh giá" />
                </div>

                <SentimentChart summary={summary} loading={loading} />
            </div>

            <div className="pt-3 border-t border-slate-100 text-right mt-4">
                <button
                    type="button"
                    onClick={() => onInspect('low')}
                    disabled={loading}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                    Xem đánh giá cần cải thiện <ArrowRight size={12} />
                </button>
            </div>
        </section>
    );
}

export default function ReviewAnalytics({ summary, loading = false, onInspect }) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <RatingAnalytics summary={summary} loading={loading} onInspect={onInspect} />
            <SentimentAnalytics summary={summary} loading={loading} onInspect={onInspect} />
        </section>
    );
}
