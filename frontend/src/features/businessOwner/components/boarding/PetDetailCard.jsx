import {
  Calendar,
  Clock,
  Utensils,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  Edit3,
  Eye,
  LogOut,
} from "lucide-react";

export default function PetDetailCard({ pet, onViewDetail, onAddDiary, onCheckout }) {
  if (!pet) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
      {/* Header widget */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Thú cưng đang chọn
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          #{pet.id}
        </span>
      </div>

      {/* Avatar & Basic Info */}
      <div className="flex items-start gap-3">
        <img
          src={pet.img}
          alt={pet.name}
          className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-slate-100 shadow-2xs"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-base font-extrabold text-slate-900 leading-tight">
              {pet.name}
            </h4>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${pet.statusClass}`}
            >
              {pet.status}
            </span>
          </div>

          <p className="mt-0.5 text-[11px] text-slate-500">{pet.type}</p>

          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ShieldCheck size={13} />
            {pet.roomName}
          </p>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 4 Quick Info Boxes */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
          <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Calendar size={11} /> Check-in
          </p>
          <p className="mt-0.5 font-bold text-slate-800">
            {pet.checkinDate}
          </p>
          <p className="text-[10px] text-slate-400">{pet.checkinTime}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
          <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Calendar size={11} /> Check-out
          </p>
          <p className="mt-0.5 font-bold text-slate-800">
            {pet.checkoutDate}
          </p>
          <p className={`text-[10px] font-medium ${pet.checkoutColor}`}>
            {pet.checkoutStatus}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
          <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Clock size={11} /> Lưu trú
          </p>
          <p className="mt-0.5 font-bold text-slate-800">5 ngày</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
          <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Utensils size={11} /> Lịch ăn
          </p>
          <p className="mt-0.5 font-bold text-slate-800 text-[10px]">
            08:00 • 14:00 • 20:00
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Chủ nuôi: <span className="text-slate-800 font-bold normal-case text-xs">{pet.owner}</span>
        </p>
        <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Phone size={12} className="text-slate-400" /> {pet.phone}
        </p>
      </div>

      {/* Care Notes */}
      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-2.5 text-[11px]">
        <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-0.5">
          <FileText size={11} /> Ghi chú chăm sóc
        </p>
        <p className="italic leading-relaxed text-slate-600 text-[10px]">
          Sợ tiếng pháo. Không cho ăn đồ nhiều gia vị. Thích bóng cao su.
        </p>
      </div>

      {/* Harmonious Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onViewDetail?.(pet)}
          className="col-span-2 w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs shadow-emerald-200"
        >
          <Eye size={13} />
          <span>Xem hồ sơ chi tiết</span>
        </button>

        <button
          type="button"
          onClick={() => onAddDiary?.(pet)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
        >
          <Edit3 size={12} />
          <span>Nhật ký</span>
        </button>

        <button
          type="button"
          disabled={pet.status === "ĐÃ CHECK-OUT"}
          onClick={() => onCheckout?.(pet)}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
            pet.status === "ĐÃ CHECK-OUT"
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 cursor-pointer"
          }`}
        >
          <LogOut size={12} />
          <span>{pet.status === "ĐÃ CHECK-OUT" ? "Đã trả bé" : "Check-out"}</span>
        </button>
      </div>
    </div>
  );
}