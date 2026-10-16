import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { REVIEWS } from "../../data/dashboardData";

export default function RecentReviews() {
    const navigate = useNavigate();

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Đánh giá mới</h4>

                <button
                    type="button"
                    onClick={() => navigate("/business/reviews")}
                    className="flex cursor-pointer items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Xem tất cả <ArrowRight size={12} />
                </button>
            </div>

            <div className="space-y-3.5">
                {REVIEWS.map((review) => (
                    <div
                        key={review.id}
                        className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5"
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${review.bg} ${review.text}`}
                        >
                            {review.initial}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-bold leading-tight text-slate-800">
                                    {review.name}
                                </p>
                                <span className="shrink-0 text-[10px] text-slate-400">
                                    {review.date}
                                </span>
                            </div>

                            <div
                                className="my-1 flex items-center text-xs text-amber-400"
                                aria-label="5 sao"
                            >
                                ★★★★★
                            </div>

                            <p className="text-[11px] leading-snug text-slate-600">
                                {review.content}
                            </p>
                        </div>

                        <div className="shrink-0 text-xl">{review.emoji}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}