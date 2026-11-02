import PetDiaryAvatar from "./PetDiaryAvatar.jsx";
import {
  X,
  ShieldCheck,
  FileText,
  Edit3,
  Plus,
  BookHeart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { petDiaryApi } from "../../services/petDiaryApi.js";
import { diaryTimeline } from "../../data/petDiaryApiData.js";

export default function PetDiaryDetailModal({ pet, onClose, onUpdateDiary, onEditDiary }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);
  const selectedDiary = timeline.find((item) => item.id === selectedDiaryId);
  const canEditDiary = !loading && !error && !!selectedDiary && pet.statusCode === "IN_PROGRESS" && !!onEditDiary;
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setSelectedDiaryId(null);
    petDiaryApi.getDiaries(pet.bookingId).then((response) => {
      if (!cancelled) setTimeline(diaryTimeline(response.data.diaries));
    }).catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pet.bookingId]);
  if (!pet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
              <BookHeart size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Chi tiết nhật ký thú cưng
              </h3>
              <p className="text-[11px] text-slate-500">
                Thông tin lưu trú và dòng thời gian chăm sóc
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Hồ sơ thú cưng */}
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <PetDiaryAvatar
              alt={pet.name}
              src={pet.img}
              className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-200 shadow-sm shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    {pet.name}
                  </h4>
                  <span className={`font-bold text-xs ${pet.genderColor || "text-blue-500"}`}>
                    {pet.gender}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${pet.statusBadge || "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  {pet.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-0.5">
                {pet.breed} • {pet.age} • {pet.weight}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] font-medium mt-1 text-emerald-600">
                <ShieldCheck size={14} />
                <span>
                  {pet.room} • {pet.roomCode}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin chủ nuôi và lưu trú */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Chủ nuôi</span>
              <span className="font-semibold text-slate-800">{pet.owner}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Số điện thoại</span>
              <span className="font-semibold text-slate-800">{pet.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Check-in</span>
              <span className="font-semibold text-slate-800">{pet.checkin} {pet.checkinTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Check-out dự kiến</span>
              <span className="font-semibold text-slate-800">{pet.checkout} {pet.checkoutSub}</span>
            </div>
          </div>

          {/* Ghi chú chăm sóc */}
          {pet.careNote && (
            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
              <p className="text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText size={13} />
                Ghi chú chăm sóc đặc biệt
              </p>
              <p className="text-slate-700 leading-relaxed italic text-[11.5px]">
                {pet.careNote}
              </p>
            </div>
          )}

          {/* Timeline chăm sóc hôm nay */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-800 text-xs">
                Lịch sử chăm sóc
              </h5>
              <span className="text-[10px] text-slate-400">
                {loading ? "Đang tải..." : `${timeline.length} hoạt động`}
              </span>
            </div>

            <div className="space-y-2">
              {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
              {!loading && !error && timeline.length === 0 && <p className="p-3 text-slate-400">Chưa có nhật ký chăm sóc cho đơn lưu trú này.</p>}
              {!loading && !error && timeline.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedDiaryId === item.id;
                const toggleSelection = () => setSelectedDiaryId((previous) => previous === item.id ? null : item.id);
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Chọn ${item.type} lúc ${item.time}`}
                    onClick={toggleSelection}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleSelection();
                      }
                    }}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border shadow-2xs transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${isSelected ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-200" : "bg-white border-slate-100 hover:border-slate-200"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-400 font-semibold text-[10px] w-20 shrink-0">
                        {item.time}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {item.type}
                          {isSelected && <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700">Đang chọn</span>}
                        </p>
                        {item.desc && (
                          <p className="text-[11px] text-slate-500 whitespace-pre-line break-words max-w-sm">
                            {item.desc}
                          </p>
                        )}
                        {item.author && <p className="text-[10px] text-slate-400">{item.author}</p>}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex max-w-32 flex-wrap justify-end gap-1">
                        {item.images.map((url, index) => (
                          <img
                            key={`${url}-${index}`}
                            alt="Ảnh cập nhật"
                            src={url}
                            className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-3.5 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!canEditDiary}
              onClick={() => {
                if (canEditDiary) onEditDiary({ ...pet, ...selectedDiary.editData });
              }}
              title={selectedDiary ? `Chỉnh sửa ${selectedDiary.type} lúc ${selectedDiary.time}` : "Chọn một hoạt động trong nhật ký để chỉnh sửa"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Edit3 size={14} />
              <span>Chỉnh sửa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onUpdateDiary?.(pet);
              }}
              disabled={pet.statusCode !== "IN_PROGRESS"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm shadow-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              <span>Thêm cập nhật cho {pet.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
