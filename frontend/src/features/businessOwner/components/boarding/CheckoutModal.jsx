import { useState } from "react";
import {
  X,
  LogOut,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  User,
  Phone,
} from "lucide-react";

export default function CheckoutModal({ pet, onClose, onConfirm }) {
  const [returnItems, setReturnItems] = useState(true);
  const [healthStatus, setHealthStatus] = useState("Khỏe mạnh, tinh thần tốt");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pet) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm?.(pet, { returnItems, healthStatus, notes });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

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
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-bold text-xs">
              <LogOut size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Xác nhận Check-out lưu trú
              </h3>
              <p className="text-[11px] text-slate-500">
                Mã: {pet.id} • Phòng: <span className="font-semibold text-emerald-700">{pet.roomName}</span>
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Pet & Owner Overview */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <img
              src={pet.img}
              alt={pet.name}
              className="h-14 w-14 shrink-0 rounded-xl object-cover border border-white shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-extrabold text-slate-900">{pet.name}</h4>
              <p className="text-[11px] text-slate-500">{pet.type}</p>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <User size={12} className="text-slate-400" /> {pet.owner}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Phone size={12} className="text-slate-400" /> {pet.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Stay & Billing Details */}
          <div className="rounded-xl border border-slate-100 bg-white p-3.5 space-y-2.5">
            <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              Chi tiết kỳ lưu trú
            </h5>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block">Ngày Check-in:</span>
                <span className="font-bold text-slate-800">{pet.checkinDate} ({pet.checkinTime})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Thời gian Check-out:</span>
                <span className="font-bold text-emerald-600">Hôm nay (Hoàn tất)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Thời gian lưu trú:</span>
                <span className="font-bold text-slate-800">5 ngày</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phí lưu trú dự kiến:</span>
                <span className="font-bold text-emerald-700">1.250.000 đ</span>
              </div>
            </div>
          </div>

          {/* Handover checklist */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              Biên bản bàn giao cho chủ nuôi
            </h5>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={returnItems}
                onChange={(e) => setReturnItems(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-slate-800 text-xs">
                  Đã bàn giao đầy đủ vật dụng cá nhân
                </span>
                <p className="text-[10px] text-slate-400">
                  Balo, sổ tiêm chủng, vòng cổ và đồ chơi gửi kèm lúc check-in.
                </p>
              </div>
            </label>

            <div>
              <label className="block font-semibold text-slate-700 text-[11px] mb-1">
                Tình trạng sức khỏe & thể chất khi bàn giao
              </label>
              <input
                type="text"
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                placeholder="VD: Khỏe mạnh, ăn uống bình thường"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 text-[11px] mb-1">
                Ghi chú thêm khi trả bé
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Lời dặn thêm cho chủ nuôi..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px]">
            <AlertTriangle size={15} className="shrink-0 text-amber-600" />
            <span>Phòng <strong className="font-semibold">{pet.roomName}</strong> sẽ được chuyển sang trạng thái sẵn sàng để dọn dẹp sau khi check-out.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-3.5 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer shadow-sm shadow-rose-200 disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            <span>{isSubmitting ? "Đang xử lý..." : "Xác nhận Check-out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
