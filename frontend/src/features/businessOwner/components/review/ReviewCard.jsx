import { useState } from "react";
import {
    Star,
    MoreVertical,
    CircleCheck,
    Scissors,
    House,
    MapPin,
    CalendarDays,
    PawPrint,
    EyeOff,
    Eye,
    Send,
    X,
} from "lucide-react";

function RatingStars({ rating }) {
    return (
        <div
            className="flex items-center gap-0.5 text-amber-400"
            aria-label={`${rating} trên 5 sao`}
        >
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={13}
                    fill={index < rating ? "currentColor" : "none"}
                    className={index < rating ? "" : "text-slate-300"}
                />
            ))}
        </div>
    );
}

function ReviewHeader({ review }) {
    const ServiceIcon = review.serviceType === "Boarding" ? House : Scissors;

    return (
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
                <img
                    src={review.avatar}
                    alt={review.customer}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                />

                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-xs">
                            {review.customer}
                        </h4>

                        {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200/50">
                                <CircleCheck size={11} />
                                Đã mua dịch vụ
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                            <ServiceIcon size={11} />
                            {review.service}
                        </span>

                        <span className="hidden sm:inline">|</span>

                        <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {review.branch}
                        </span>

                        <span className="hidden sm:inline">|</span>

                        <span className="flex items-center gap-1">
                            <CalendarDays size={11} />
                            {review.date}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-xs">{review.pet.emoji}</span>
                        <span className="font-semibold text-slate-700 text-xs">
                            {review.pet.name}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                            {review.pet.breed}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <RatingStars rating={review.rating} />

                <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Tác vụ đánh giá"
                    title="Tác vụ đánh giá"
                >
                    <MoreVertical size={17} />
                </button>
            </div>
        </div>
    );
}

function ReviewImages({ images }) {
    if (!images?.length) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {images.map((image, index) => (
                <a
                    key={image}
                    href={image}
                    target="_blank"
                    rel="noreferrer"
                    title={`Xem ảnh ${index + 1}`}
                >
                    <img
                        src={image}
                        alt={`Ảnh thú cưng ${index + 1}`}
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-sm hover:opacity-90 transition-opacity"
                    />
                </a>
            ))}
        </div>
    );
}

function BusinessReply({ reply }) {
    if (!reply) return null;

    return (
        <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <PawPrint size={12} />
            </div>

            <div className="space-y-1 text-xs min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                        {reply.author} (Phản hồi)
                    </span>
                    <span className="text-slate-400 text-[11px]">
                        • {reply.date}
                    </span>
                </div>

                <p className="text-slate-600 leading-normal">{reply.content}</p>
            </div>
        </div>
    );
}

function ReviewReplyForm({ review, onReply }) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        const message = content.trim();
        if (!message) return;

        onReply(review.id, message);
        setContent("");
        setOpen(false);
    }

    return (
        <>
            <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-28">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
                >
                    {review.reply ? "Phản hồi thêm" : "Phản hồi"}
                </button>

                <button
                    type="button"
                    onClick={() => onReply(review.id, null, "toggle-hidden")}
                    className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-xs border border-slate-200 transition-colors"
                >
                    Ẩn đánh giá
                </button>

                <button
                    type="button"
                    onClick={() => onReply(review.id, null, "details")}
                    className="w-full py-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                >
                    Xem chi tiết
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-xl"
                    >
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Phản hồi đánh giá
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Khách hàng: {review.customer}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                                aria-label="Đóng"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <textarea
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            rows={4}
                            placeholder="Nhập nội dung phản hồi..."
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                            autoFocus
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2"
                            >
                                <Send size={14} />
                                Gửi phản hồi
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default function ReviewCard({
    review,
    onReply,
    onToggleHidden,
    onShowDetails,
}) {
    const [hidden, setHidden] = useState(false);

    function handleAction(id, content, action) {
        if (action === "toggle-hidden") {
            setHidden((previous) => !previous);
            onToggleHidden?.(id, !hidden);
            return;
        }

        if (action === "details") {
            onShowDetails?.(review);
            return;
        }

        onReply?.(id, content);
    }

    if (hidden) {
        return (
            <article className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <EyeOff size={15} />
                    Đánh giá của {review.customer} đang được ẩn trong giao diện.
                </div>

                <button
                    type="button"
                    onClick={() => setHidden(false)}
                    className="text-emerald-600 text-xs font-semibold inline-flex items-center gap-1"
                >
                    <Eye size={14} />
                    Hiện lại
                </button>
            </article>
        );
    }

    return (
        <article className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <ReviewHeader review={review} />

            <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                <div className="space-y-3 flex-1 min-w-0">
                    <p className="text-slate-700 text-xs leading-relaxed">
                        {review.content}
                    </p>

                    <ReviewImages images={review.images} />
                </div>

                <ReviewReplyForm review={review} onReply={handleAction} />
            </div>

            <BusinessReply reply={review.reply} />
        </article>
    );
}