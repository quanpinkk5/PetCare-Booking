import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { X, Star } from "lucide-react";

import ReviewMetricCards from "../../components/review/ReviewMetricCards";
import ReviewAnalytics from "../../components/review/ReviewAnalytics";
import ReviewList from "../../components/review/ReviewList";
import { ownerReviewApi } from "../../services/reviewApi";
import { ownerReviewData, summarizeOwnerReviews } from "../../services/reviewView";

function OwnerReviewManagement({ ownerId }) {
    const [reviews, setReviews] = useState([]);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [reload, setReload] = useState(0);
    const [activeFilter, setActiveFilter] = useState("all");
    const actionLock = useRef(false);
    const listRef = useRef(null);
    const selectedReview = reviews.find((review) => review.id === selectedReviewId);
    const summary = summarizeOwnerReviews(reviews);

    useEffect(() => {
        if (!ownerId) return;
        const controller = new AbortController();
        ownerReviewApi.list(controller.signal).then((response) => {
            if (!controller.signal.aborted) {
                setReviews(response.data.map((review) => ownerReviewData(review, response.business)));
                setHasLoaded(true);
            }
        }).catch((err) => {
            if (!controller.signal.aborted) setError(err.message || "Không thể tải đánh giá");
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [ownerId, reload]);

    async function saveReview(action) {
        if (actionLock.current) return false;
        actionLock.current = true;
        setSaving(true);
        setError("");
        try {
            const response = await action();
            const saved = ownerReviewData(response.data, response.business);
            setReviews((current) => current.map((review) => review.id === saved.id ? saved : review));
            return true;
        } catch (err) {
            setError(err.message || "Không thể cập nhật đánh giá");
            return false;
        } finally {
            actionLock.current = false;
            setSaving(false);
        }
    }
    const handleReply = (id, content) => saveReview(() => ownerReviewApi.reply(id, content));
    const handleToggleHidden = (id, hidden) => saveReview(() => ownerReviewApi.hide(id, hidden));
    const inspect = (filter) => {
        setActiveFilter(filter);
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <style>{`
        .review-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .review-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }

        .review-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }

        .review-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

            <div className="min-h-full bg-[#f8fafc] text-slate-700 font-sans antialiased text-[13px] leading-relaxed">
                <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6">
                    <ReviewMetricCards metrics={summary.metrics} unavailable={loading || !hasLoaded} />

                    <ReviewAnalytics summary={summary} loading={loading || !hasLoaded} onInspect={inspect} />

                    {error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                        <span>{error}</span>
                        <button type="button" disabled={loading || saving} onClick={() => { setLoading(true); setError(""); setReload((value) => value + 1); }} className="shrink-0 font-semibold">Tải lại</button>
                    </div>}
                    <div ref={listRef}>
                    <ReviewList
                        loading={loading}
                        saving={saving}
                        error={error}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        reviews={reviews}
                        onReply={handleReply}
                        onToggleHidden={handleToggleHidden}
                        onShowDetails={(review) => setSelectedReviewId(review.id)}
                    />
                    </div>
                </div>
            </div>

            {/* Chi tiết đánh giá */}
            {selectedReview && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"
                    onClick={() => setSelectedReviewId(null)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="review-detail-title"
                        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-5 max-h-[85vh] overflow-y-auto review-scrollbar"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h2
                                    id="review-detail-title"
                                    className="font-bold text-slate-900 text-base"
                                >
                                    Chi tiết đánh giá
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    {selectedReview.customer}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedReviewId(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                                aria-label="Đóng chi tiết"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400 mb-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={16}
                                    fill={
                                        index < selectedReview.rating
                                            ? "currentColor"
                                            : "none"
                                    }
                                    className={
                                        index < selectedReview.rating
                                            ? ""
                                            : "text-slate-300"
                                    }
                                />
                            ))}

                            <span className="text-xs text-slate-500 ml-2">
                                {selectedReview.rating}/5
                            </span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <p>
                                <span className="text-slate-400">Dịch vụ: </span>
                                {selectedReview.service}
                            </p>

                            <p>
                                <span className="text-slate-400">Chi nhánh: </span>
                                {selectedReview.branch}
                            </p>

                            <p>
                                <span className="text-slate-400">Thú cưng: </span>
                                {selectedReview.pet.name} · {selectedReview.pet.breed}
                            </p>

                            <p className="text-slate-700 leading-relaxed pt-2">
                                {selectedReview.content}
                            </p>
                        </div>

                        {selectedReview.reply && (
                            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                <p className="font-bold text-emerald-800 text-xs mb-1">
                                    Phản hồi từ {selectedReview.reply.author}
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {selectedReview.reply.content}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end mt-5">
                            <button
                                type="button"
                                onClick={() => setSelectedReviewId(null)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                            >
                                Đóng
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
export default function ReviewManagement() {
    const { user } = useAuth();
    const ownerId = String(user?._id || user?.id || "");
    return <OwnerReviewManagement key={ownerId} ownerId={ownerId} />;
}
