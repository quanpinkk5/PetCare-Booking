import {
  X,
  ShieldCheck,
  Calendar,
  Clock,
  Utensils,
  FileText,
  Edit3,
  ArrowRight,
  BookHeart,
} from "lucide-react";
import { TIMELINE_DATA } from "../../data/petDiaryData";

export default function PetDiaryDetailModal({ pet, onClose, onUpdateDiary }) {
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
            <img
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
                {pet.breed} • {pet.age} • {pet.weight || "10 kg"}
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
                Lịch sử chăm sóc hôm nay
              </h5>
              <span className="text-[10px] text-slate-400">
                {TIMELINE_DATA.length} hoạt động
              </span>
            </div>

            <div className="space-y-2">
              {TIMELINE_DATA.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs hover:border-slate-200 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-400 font-semibold text-[10px] w-10 shrink-0">
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
                        </p>
                        {item.desc && (
                          <p className="text-[11px] text-slate-500 truncate max-w-sm">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.img && (
                      <img
                        alt="Ảnh cập nhật"
                        src={item.img}
                        className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onUpdateDiary?.(pet);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm shadow-emerald-200"
          >
            <Edit3 size={14} />
            <span>Thêm cập nhật cho {pet.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
