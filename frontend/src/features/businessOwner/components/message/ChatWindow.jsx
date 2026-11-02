import { useState, useEffect, useRef } from "react";
import {
    MoreHorizontal,
    CalendarCheck,
    CheckCheck,
    Paperclip,
    Smile,
    Send,
} from "lucide-react";

export default function ChatWindow({
    customer,
    messages = [],
    onSendMessage,
    loading = false,
    sending = false,
    important = false,
    onToggleImportant,
}) {
    const [messageText, setMessageText] = useState("");
    const [showBooking, setShowBooking] = useState(false);
    const messageEndRef = useRef(null);
    const latestMessageId = messages.at(-1)?.id;

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [latestMessageId]);

    const handleSendMessage = async (event) => {
        event.preventDefault();

        const text = messageText.trim();
        if (!text || sending || loading || !customer) return;
        if (await onSendMessage(text)) setMessageText((current) => current.trim() === text ? "" : current);
    };

    return (
        <div className="col-span-12 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-6 min-h-0">
            {/* Chat header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                    {customer?.avatar ? (
                        <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="h-10 w-10 shrink-0 rounded-full border border-slate-100 object-cover shadow-2xs"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-xs font-bold text-emerald-700">
                            —
                        </div>
                    )}

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900 leading-tight">
                            {customer?.name || "Chọn một hội thoại"}
                        </h3>

                        <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-300" />
                            <span className="text-xs font-medium text-slate-500">
                                {customer?.type || "Chưa chọn khách hàng"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        aria-label={important ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"}
                        title={important ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"}
                        disabled={!customer}
                        onClick={onToggleImportant}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                        <MoreHorizontal size={15} />
                    </button>
                </div>
            </div>

            {/* Booking information banner */}
            {customer?.booking && (
                <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/60 px-5 py-2.5 text-xs">
                    <div className="flex min-w-0 items-center gap-2 font-medium text-slate-700">
                        <CalendarCheck size={16} className="shrink-0 text-emerald-600" />

                        <span className="shrink-0 font-bold text-slate-800">
                            {customer.booking.id}
                        </span>

                        <span>•</span>

                        <span className="truncate">{customer.booking.service}</span>

                        <span className="hidden xl:inline">•</span>

                        <span className="hidden xl:inline shrink-0 text-slate-600">
                            {customer.booking.date} {customer.booking.time}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowBooking(true)}
                        className="shrink-0 rounded-lg border border-emerald-600 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                    >
                        Xem chi tiết
                    </button>
                </div>
            )}

            {/* Message history */}
            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-slate-50/40 px-5 py-4">
                <div className="my-2 flex justify-center">
                    <span className="rounded-full bg-slate-200/60 px-3 py-1 text-xs font-medium text-slate-500">
                        {loading ? "Đang tải tin nhắn..." : !customer ? "Chọn hội thoại để xem tin nhắn" : messages.length ? "Lịch sử hội thoại" : "Chưa có tin nhắn"}
                    </span>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${
                            msg.sender === "customer"
                                ? "items-start max-w-[80%]"
                                : "items-end max-w-[85%] ml-auto"
                        }`}
                    >
                        <div
                            className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs break-words ${
                                msg.sender === "customer"
                                    ? "rounded-tl-xs border border-slate-200 bg-white text-slate-800"
                                    : "rounded-tr-xs border border-emerald-200 bg-emerald-50 text-slate-900"
                            }`}
                        >
                            <p>{msg.text}</p>

                            {msg.images && (
                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    {msg.images.map((image, index) => (
                                        <div
                                            key={image}
                                            className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-100"
                                        >
                                            <img
                                                alt={`Ảnh đính kèm ${index + 1}`}
                                                src={image}
                                                className="h-full w-full object-cover"
                                            />

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            className={`mt-1 flex items-center gap-1 text-[11px] text-slate-400 ${
                                msg.sender === "customer" ? "ml-1" : "mr-1"
                            }`}
                        >
                            <span>{msg.time}</span>

                            {msg.sender === "shop" && msg.isRead && (
                                <CheckCheck size={13} className="text-emerald-600" />
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Message composer */}
            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-slate-100 bg-white p-3.5"
            >
                <button
                    type="button"
                    aria-label="Đính kèm tệp"
                    title="Chưa hỗ trợ tải tệp đính kèm"
                    disabled
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                    <Paperclip size={18} />
                </button>

                <button
                    type="button"
                    aria-label="Biểu tượng cảm xúc"
                    disabled={!customer || loading || sending}
                    onClick={() => setMessageText((prev) => prev + " 🐶")}
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                    <Smile size={18} />
                </button>

                <input
                    type="text"
                    maxLength={10000}
                    disabled={!customer || loading || sending}
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder="Nhập tin nhắn phản hồi cho khách hàng..."
                    className="flex-1 min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
                />

                <button
                    type="submit"
                    disabled={!messageText.trim() || !customer || loading || sending}
                    aria-label="Gửi tin nhắn"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                    <Send size={14} className="-ml-0.5 mt-0.5" />
                </button>
            </form>
            {showBooking && customer?.booking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setShowBooking(false)}>
                    <div role="dialog" aria-modal="true" aria-label="Thông tin lịch hẹn" className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
                        <h3 className="text-sm font-bold">Thông tin lịch hẹn {customer.booking.id}</h3>
                        <p>{customer.name} {customer.phone}</p>
                        <p>{customer.booking.service}</p>
                        <p>{customer.booking.date} {customer.booking.time}</p>
                        <button type="button" onClick={() => setShowBooking(false)} className="rounded-lg border border-slate-200 px-3 py-2">Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
}
