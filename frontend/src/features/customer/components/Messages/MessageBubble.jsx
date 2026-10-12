import { CheckCheck } from "lucide-react";

const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user";

    return (
        <div
            className={`flex ${isUser ? "flex-col items-end" : "items-end space-x-2"
                }`}
        >
            {!isUser && (
                <div
                    className={`mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-[8px] font-bold text-[#009879] ${message.hideAvatar ? "opacity-0" : ""
                        }`}
                >
                    {message.avatar || "HP"}
                </div>
            )}

            <div
                className={`max-w-[78%] px-3.5 py-2.5 text-[13px] shadow-sm ${isUser
                        ? "rounded-2xl rounded-tr-sm bg-[#d1fae5] text-slate-800"
                        : "rounded-2xl rounded-tl-sm border border-slate-200 bg-white text-slate-800"
                    }`}
            >
                <p className="whitespace-pre-wrap break-words">{message.text}</p>

                <div
                    className={`mt-1 flex items-center text-[10px] text-slate-400 ${isUser ? "justify-end space-x-1" : "justify-end"
                        }`}
                >
                    <span>{message.time}</span>
                    {isUser && message.isRead && (
                        <CheckCheck size={14} className="text-[#009879]" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;