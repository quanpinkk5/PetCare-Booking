import { useMemo, useState } from "react";
import { Archive, Search, SlidersHorizontal } from "lucide-react";
import { CHAT_LIST } from "../../data/messagesData";

const ConversationItem = ({ chat, selected, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(chat)}
            className={`flex w-full items-start space-x-3 rounded-xl border p-2.5 text-left transition ${selected
                    ? "border-[#a7f3d0] bg-[#e6f7f2]"
                    : "border-transparent hover:bg-slate-50"
                }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-center text-[10px] font-bold leading-tight ${chat.colorClasses}`}
            >
                {chat.avatarIcon ? (
                    <chat.avatarIcon className="h-5 w-5" />
                ) : (
                    <span className="whitespace-pre-line">{chat.avatarText}</span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate text-[13px] font-bold text-slate-700">
                        {chat.name}
                    </h4>
                    <span className="shrink-0 text-[11px] text-slate-400">
                        {chat.time}
                    </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate pr-2 text-[12px] text-slate-600">
                        {chat.lastMessage}
                    </p>

                    {chat.unread > 0 && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#009879] text-[10px] font-bold text-white">
                            {chat.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

const ChatSidebar = ({ selectedChatId, onSelectChat }) => {
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredChats = useMemo(() => {
        return CHAT_LIST.filter((chat) => {
            const matchesKeyword = chat.name
                .toLowerCase()
                .includes(keyword.toLowerCase());

            const matchesFilter =
                filter === "all" ||
                (filter === "unread" && chat.unread > 0) ||
                (filter === "booked" && chat.id === 1);

            return matchesKeyword && matchesFilter;
        });
    }, [keyword, filter]);

    const filters = [
        { id: "all", label: "Tất cả" },
        { id: "unread", label: "Chưa đọc" },
        { id: "booked", label: "Đã đặt" },
    ];

    return (
        <section className="col-span-12 flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:col-span-3">
            <div className="mb-3 flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm cuộc trò chuyện..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[13px] placeholder-slate-400 focus:border-[#009879] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#009879]"
                    />
                </div>

                <button
                    type="button"
                    title="Bộ lọc"
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                >
                    <SlidersHorizontal size={16} />
                </button>
            </div>

            <div className="mb-3 flex items-center space-x-1.5 text-xs font-semibold">
                {filters.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setFilter(item.id)}
                        className={`rounded-lg px-3.5 py-1.5 transition ${filter === item.id
                                ? "bg-[#009879] text-white"
                                : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto">
                {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                        <ConversationItem
                            key={chat.id}
                            chat={chat}
                            selected={selectedChatId === chat.id}
                            onSelect={onSelectChat}
                        />
                    ))
                ) : (
                    <p className="py-8 text-center text-xs text-slate-400">
                        Không tìm thấy cuộc trò chuyện.
                    </p>
                )}
            </div>

            <div className="mt-2 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    className="flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-[#009879] hover:text-[#009879]"
                >
                    <Archive size={16} />
                    <span>Cuộc trò chuyện đã lưu trữ</span>
                </button>
            </div>
        </section>
    );
};

export default ChatSidebar;