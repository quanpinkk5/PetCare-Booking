import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Info, MoreHorizontal, Phone, FileText } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { BOOKING_INFO } from "../../data/messagesData";

const ChatWindow = ({ chat, messages = [], onSendMessage }) => {
    const navigate = useNavigate();
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!chat) {
        return (
            <section className="col-span-12 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm lg:col-span-6 min-h-[500px] text-slate-400">
                <p>Hãy chọn một cuộc trò chuyện để bắt đầu.</p>
            </section>
        );
    }

    const currentBooking = chat.bookingInfo || BOOKING_INFO;

    return (
        <section className="col-span-12 flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-6">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="flex min-w-0 items-center space-x-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-center text-[10px] font-bold text-[#009879]">
                        {chat.avatarText || chat.name?.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                            {chat.name}
                        </h3>
                        <div className="mt-0.5 flex items-center space-x-1.5">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            <span className="text-[11px] text-slate-500">
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center space-x-2">
                    <button type="button" aria-label="Gọi điện" onClick={() => alert("Đang kết nối cuộc gọi thoại...")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                        <Phone size={16} />
                    </button>
                    <button type="button" aria-label="Thông tin" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                        <Info size={16} />
                    </button>
                    <button type="button" aria-label="Tùy chọn" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#ccfbf1] bg-[#f0fbf7] px-5 py-2.5 text-xs">
                <div className="flex min-w-0 items-center space-x-2 truncate font-medium text-slate-700">
                    <FileText size={16} className="shrink-0 text-[#009879]" />
                    <span className="shrink-0 font-bold text-slate-800">
                        {currentBooking.id}
                    </span>
                    <span>•</span>
                    <span className="truncate">{currentBooking.service}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden shrink-0 sm:inline">
                        {currentBooking.dateTime}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(`/my-bookings/${currentBooking.id}`)}
                    className="ml-2 shrink-0 rounded-md border border-[#009879] px-2.5 py-1 text-[11px] font-semibold text-[#009879] hover:bg-[#009879] hover:text-white transition-colors cursor-pointer"
                >
                    Xem chi tiết
                </button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-slate-50/30 px-5 py-4">
                <div className="my-2 flex justify-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
                        Hôm nay
                    </span>
                </div>

                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                <div ref={messageEndRef} />
            </div>

            <MessageInput onSend={onSendMessage} />
        </section>
    );
};

export default ChatWindow;