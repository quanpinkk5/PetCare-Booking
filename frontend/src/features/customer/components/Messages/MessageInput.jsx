import { useState } from "react";
import { Image as ImageIcon, Paperclip, Send } from "lucide-react";

const MessageInput = ({ onSend }) => {
    const [text, setText] = useState("");

    const submitMessage = () => {
        const value = text.trim();

        if (!value) return;

        onSend(value);
        setText("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitMessage();
        }
    };

    return (
        <div className="border-t border-slate-100 bg-white p-3">
            <div className="flex items-center space-x-2">
                <button
                    type="button"
                    aria-label="Đính kèm tệp"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                    <Paperclip size={20} />
                </button>

                <button
                    type="button"
                    aria-label="Đính kèm ảnh"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                    <ImageIcon size={20} />
                </button>

                <div className="flex-1">
                    <input
                        type="text"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs placeholder-slate-400 focus:border-[#009879] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#009879]"
                    />
                </div>

                <button
                    type="button"
                    onClick={submitMessage}
                    disabled={!text.trim()}
                    aria-label="Gửi tin nhắn"
                    className="shrink-0 rounded-xl bg-[#009879] p-2.5 text-white hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send size={16} />
                </button>
            </div>

            <div className="mt-1 pr-1 text-right text-[10px] text-slate-400">
                Nhấn Enter để gửi tin nhắn
            </div>
        </div>
    );
};

export default MessageInput;