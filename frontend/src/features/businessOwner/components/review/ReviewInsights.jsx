import { useState } from "react";
import {
    ThumbsUp,
    TriangleAlert,
    Check,
    ArrowRight,
    Send,
    CheckCircle2,
} from "lucide-react";

import {
    REVIEW_STRENGTHS,
    REVIEW_IMPROVEMENTS,
    QUICK_REPLY_TEMPLATES,
} from "../../data/reviewData";

function InsightSection({ title, items, type }) {
    const positive = type === "positive";

    return (
        <div className="space-y-2.5">
            <div
                className={`flex items-center gap-2 font-bold text-xs ${positive ? "text-emerald-700" : "text-amber-700"
                    }`}
            >
                <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${positive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-500"
                        }`}
                >
                    {positive ? <ThumbsUp size={12} /> : <TriangleAlert size={12} />}
                </div>

                <span>{title}</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 pl-1">
                {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                        <Check
                            size={12}
                            className={`mt-0.5 shrink-0 ${positive ? "text-emerald-500" : "text-amber-500"
                                }`}
                        />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 pt-1"
            >
                Xem thêm <ArrowRight size={11} />
            </button>
        </div>
    );
}

function CustomerInsights() {
    return (
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
            <h3 className="font-bold text-slate-900 text-sm">
                Khách hàng nói gì về bạn?
            </h3>

            <InsightSection
                title="Điểm mạnh nổi bật"
                items={REVIEW_STRENGTHS}
                type="positive"
            />

            <hr className="border-slate-100" />

            <InsightSection
                title="Điểm cần cải thiện"
                items={REVIEW_IMPROVEMENTS}
                type="improvement"
            />
        </section>
    );
}

function QuickReply() {
    const [message, setMessage] = useState("");
    const [sentMessage, setSentMessage] = useState("");

    function handleSend(event) {
        event.preventDefault();

        const trimmed = message.trim();
        if (!trimmed) return;

        setSentMessage(trimmed);
        setMessage("");
    }

    return (
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-3.5">
            <div>
                <h3 className="font-bold text-slate-900 text-sm">Phản hồi nhanh</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                    Soạn nội dung phản hồi mẫu.
                </p>
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="min-w-0 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="Nhập tin nhắn mẫu..."
                />

                <button
                    type="submit"
                    className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    aria-label="Lưu phản hồi nhanh"
                >
                    <Send size={13} />
                </button>
            </form>

            {sentMessage && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span>
                        Đã tạo nội dung mẫu: <strong>{sentMessage}</strong>
                    </span>
                </div>
            )}

            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                {QUICK_REPLY_TEMPLATES.map((template) => (
                    <button
                        key={template}
                        type="button"
                        onClick={() => setMessage(template)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                        {template}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default function ReviewInsights() {
    return (
        <aside className="space-y-6 min-w-0">
            <CustomerInsights />
            <QuickReply />
        </aside>
    );
}