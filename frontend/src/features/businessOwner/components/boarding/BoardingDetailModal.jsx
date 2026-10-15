import {
  X,
  Calendar,
  Clock,
  Utensils,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  User,
  Heart,
  CheckCircle2,
  AlertCircle,
  BookHeart,
  LogOut,
} from "lucide-react";

export default function BoardingDetailModal({
  pet,
  onClose,
  onAddDiary,
  onCheckout,
}) {
  if (!pet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Chi tiết lưu trú: {pet.id}
              </h3>
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Pet Profile Banner */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <img
              src={pet.img}
              alt={pet.name}
              className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-sm border border-white"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-extrabold text-slate-900">{pet.name}</h4>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${pet.statusClass}`}
                >
                  {pet.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{pet.type}</p>
              <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <ShieldCheck size={13} />
                {pet.roomName}
              </p>
            </div>
          </div>

          {/* Time & Duration Info */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 bg-white">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar size={13} /> Check-in
              </p>
              <p className="font-bold text-slate-800">
                {pet.checkinDate} • {pet.checkinTime}
              </p>
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar size={13} /> Check-out dự kiến
              </p>
              <p className="font-bold text-slate-800">{pet.checkoutDate}</p>
              <p className={`text-[10px] font-medium ${pet.checkoutColor}`}>
                {pet.checkoutStatus}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock size={13} /> Thời gian lưu trú
              </p>
              <p className="font-bold text-slate-800">5 ngày</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Utensils size={13} /> Khẩu phần & Lịch ăn
              </p>
              <p className="font-bold text-slate-800">08:00 • 14:00 • 20:00</p>
            </div>
          </div>

          {/* Owner Info */}
          <div className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/60 space-y-2">
            <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <User size={14} className="text-emerald-600" /> Thông tin chủ nuôi
            </p>
            <div className="pt-1">
              <p className="text-xs font-bold text-slate-800">{pet.owner}</p>
              <div className="mt-1 flex flex-col gap-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> {pet.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> Chưa có email
                </span>
              </div>
            </div>
          </div>

          {/* Care Notes */}
          <div className="rounded-xl border border-slate-100 p-3.5 bg-amber-50/40 space-y-1.5">
            <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
              <FileText size={13} className="text-amber-600" /> Ghi chú chăm sóc & Tập tính
            </p>
            <p className="text-slate-600 italic leading-relaxed text-[11px]">
              Sợ tiếng pháo và sấm sét. Không cho ăn đồ ngọt hoặc nhiều gia vị. Thích chơi bóng cao su vào buổi chiều.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAddDiary?.(pet)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition cursor-pointer shadow-2xs"
            >
              <BookHeart size={14} />
              <span>Thêm nhật ký</span>
            </button>

            {pet.status !== "ĐÃ CHECK-OUT" ? (
              <button
                type="button"
                onClick={() => onCheckout?.(pet)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer shadow-sm shadow-rose-200"
              >
                <LogOut size={14} />
                <span>Check-out</span>
              </button>
            ) : (
              <span className="inline-block px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 rounded-xl">
                Đã check-out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
