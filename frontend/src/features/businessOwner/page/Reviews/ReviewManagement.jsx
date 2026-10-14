import { useState } from "react";
import { X, Star } from "lucide-react";

import ReviewMetricCards from "../../components/review/ReviewMetricCards";
import ReviewAnalytics from "../../components/review/ReviewAnalytics";
import ReviewList from "../../components/review/ReviewList";
import { REVIEWS_DATA } from "../../data/reviewData";

export default function ReviewManagement() {
    const [reviews, setReviews] = useState(REVIEWS_DATA);
    const [selectedReview, setSelectedReview] = useState(null);

    function handleReply(reviewId, content) {
        if (!content?.trim()) return;

        setReviews((currentReviews) =>
            currentReviews.map((review) =>
                review.id === reviewId
                    ? {
                        ...review,
                        reply: {
                            author: "Happy Pet",
                            date: new Date().toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            content: content.trim(),
                        },
                        replied: true,
                    }
                    : review
            )
        );
    }

    function handleToggleHidden(reviewId, hidden) {
        console.log("Ẩn đánh giá:", reviewId, hidden);
    }

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
                    <ReviewMetricCards />

                    <ReviewAnalytics />

                    <ReviewList
                        reviews={reviews}
                        onReply={handleReply}
                        onToggleHidden={handleToggleHidden}
                        onShowDetails={setSelectedReview}
                    />
                </div>
            </div>

            {/* Chi tiết đánh giá */}
            {selectedReview && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"
                    onClick={() => setSelectedReview(null)}
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
                                onClick={() => setSelectedReview(null)}
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
                                onClick={() => setSelectedReview(null)}
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