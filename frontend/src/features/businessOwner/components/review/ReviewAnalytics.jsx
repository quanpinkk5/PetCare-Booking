import {
    Star,
    Info,
    Award,
    ArrowRight,
    Smile,
} from "lucide-react";

import {
    RATING_DISTRIBUTION,
    SENTIMENT_DISTRIBUTION,
} from "../../data/reviewData";

function RatingDistribution() {
    return (
        <div className="md:col-span-5 space-y-2 text-xs">
            {RATING_DISTRIBUTION.map((row) => (
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
                        {row.count} ({row.percent.toFixed(1)}%)
                    </span>
                </div>
            ))}
        </div>
    );
}

function RatingSummary() {
    return (
        <div className="md:col-span-4 md:pr-3 md:border-r border-slate-100 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900">4.8</span>
                <span className="text-slate-400 font-semibold text-base">/ 5</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400 my-2 text-base">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" strokeWidth={1.5} />
                ))}
            </div>

            <p className="font-bold text-slate-800 text-xs mt-1">
                Tuyệt vời!
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Khách hàng rất hài lòng với dịch vụ của bạn.
            </p>
        </div>
    );
}

function PositiveTrend() {
    return (
        <div className="md:col-span-3 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm shadow-emerald-500/30">
                <Award size={20} />
            </div>

            <h4 className="font-bold text-slate-800 text-xs">
                Xu hướng tích cực
            </h4>

            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Số đánh giá 5 sao tăng 12% so với tháng trước.
            </p>

            <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-2"
            >
                Xem chi tiết <ArrowRight size={12} />
            </button>
        </div>
    );
}

function RatingAnalytics() {
    return (
        <section className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 mb-5">
                <h3 className="font-bold text-slate-900 text-sm">
                    Tổng quan đánh giá
                </h3>
                <Info size={13} className="text-slate-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <RatingSummary />
                <RatingDistribution />
                <PositiveTrend />
            </div>
        </section>
    );
}

function SentimentChart() {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner shrink-0"
                style={{
                    background:
                        "conic-gradient(#10b981 0% 92%, #3b82f6 92% 98%, #ef4444 98% 100%)",
                }}
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Smile size={27} className="text-emerald-600" />
                </div>
            </div>

            <div className="space-y-2 flex-1 text-xs">
                {SENTIMENT_DISTRIBUTION.map((item) => (
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
                            {item.percent}%{" "}
                            <span className="text-slate-400 font-normal text-[11px]">
                                ({item.count})
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SentimentAnalytics() {
    return (
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-1.5 mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">
                        Tổng quan cảm xúc
                    </h3>
                    <Info size={13} className="text-slate-300" />
                </div>

                <SentimentChart />
            </div>

            <div className="pt-3 border-t border-slate-100 text-right mt-4">
                <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                    Xem phân tích chi tiết <ArrowRight size={12} />
                </button>
            </div>
        </section>
    );
}

export default function ReviewAnalytics() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <RatingAnalytics />
            <SentimentAnalytics />
        </section>
    );
}