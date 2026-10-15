import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CHAT_LIST } from "../../data/messageData";

export default function ConversationList({ selectedId: externalSelectedId, onSelectChat }) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const [internalSelectedId, setInternalSelectedId] = useState(1);

  const selectedId = externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;

  const handleSelect = (id) => {
    setInternalSelectedId(id);
    onSelectChat?.(id);
  };

  const filteredChats = useMemo(() => {
    return CHAT_LIST.filter((chat) => {
      const searchText = `${chat.name} ${chat.lastMsg} ${chat.tags.join(" ")}`.toLowerCase();

      const matchesKeyword = searchText.includes(keyword.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && chat.unread > 0);

      return matchesKeyword && matchesFilter;
    });
  }, [keyword, filter]);

  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-3 min-h-0">
      <div className="space-y-3 border-b border-slate-100 p-3.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-2.5 text-slate-400"
            />

            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm hội thoại..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <button
            type="button"
            title="Lọc hội thoại chưa đọc"
            onClick={() =>
              setFilter((current) =>
                current === "unread" ? "all" : "unread"
              )
            }
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition cursor-pointer ${
              filter === "unread"
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-slate-100 pb-1 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`cursor-pointer px-2.5 pb-1 font-semibold transition ${
              filter === "all"
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tất cả
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`flex cursor-pointer items-center gap-1.5 px-2.5 pb-1 font-semibold transition ${
              filter === "unread"
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Chưa đọc
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              {CHAT_LIST.reduce((total, chat) => total + chat.unread, 0)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("important")}
            className={`cursor-pointer px-2.5 pb-1 font-semibold transition ${
              filter === "important"
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Quan trọng
          </button>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 divide-y divide-slate-100 overflow-y-auto">
        {filteredChats.map((chat) => {
          const isSelected = selectedId === chat.id;

          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => handleSelect(chat.id)}
              className={`flex w-full cursor-pointer items-start gap-3 p-3 text-left transition ${
                isSelected
                  ? "border-l-4 border-emerald-600 bg-emerald-50/70"
                  : "border-l-4 border-transparent hover:bg-slate-50"
              }`}
            >
              <img
                alt={chat.name}
                src={chat.img}
                className="h-10 w-10 shrink-0 rounded-full object-cover shadow-2xs"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <h5 className="truncate text-xs font-bold text-slate-900">
                    {chat.name}
                  </h5>

                  <span className="shrink-0 text-[11px] text-slate-400">
                    {chat.time}
                  </span>
                </div>

                <p className="mb-1.5 truncate text-xs text-slate-500">
                  {chat.lastMsg}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 gap-1.5">
                    {chat.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500 ${
                          isSelected ? "bg-white" : "bg-slate-100"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {chat.unread > 0 && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400">
            Không tìm thấy hội thoại phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}