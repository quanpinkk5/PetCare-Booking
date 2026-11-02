import { useState } from "react";
import {
  X,
  LogOut,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  PawPrint,
  Loader2,
} from "lucide-react";

// ========================================
// FORMAT TIỀN TỆ
// ========================================

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Chưa cập nhật";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Chưa cập nhật";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// ========================================
// CHECKOUT MODAL
// ========================================

export default function CheckoutModal({ pet, onClose, onConfirm }) {
  const [returnItems, setReturnItems] = useState(true);

  const [healthStatus, setHealthStatus] = useState("");

  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [imageError, setImageError] = useState(false);

  if (!pet) return null;

  const numberOfDays = pet.numberOfDays ?? pet.raw?.numberOfDays;

  const totalPrice = pet.totalPrice ?? pet.raw?.totalPrice;

  const roomName = pet.roomName || "Chưa cập nhật phòng";

  const handleClose = () => {
    if (isSubmitting) return;

    onClose?.();
  };

  // ======================================
  // XÁC NHẬN CHECK-OUT
  // ======================================

  const handleConfirm = async () => {
    if (isSubmitting) return;

    setError("");

    if (pet.statusCode !== "IN_PROGRESS") {
      setError(
        "Chỉ có thể Check-out đơn lưu trú đang trong trạng thái Đang lưu trú.",
      );
      return;
    }

    if (!healthStatus.trim()) {
      setError("Vui lòng nhập tình trạng sức khỏe của thú cưng khi bàn giao.");
      return;
    }

    if (!returnItems) {
      setError(
        "Vui lòng xác nhận đã bàn giao đầy đủ vật dụng cá nhân trước khi Check-out.",
      );
      return;
    }

    if (typeof onConfirm !== "function") {
      setError("Chức năng Check-out chưa được kết nối.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onConfirm(pet, {
        returnItems,
        healthStatus: healthStatus.trim(),
        notes: notes.trim(),
      });

      // Không tự đóng ở đây.
      // BoardingPage sẽ đóng modal khi API thành công.
    } catch (err) {
      setError(err?.message || "Check-out thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <LogOut size={18} />
            </span>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Xác nhận Check-out lưu trú
              </h3>

              <p className="text-[11px] text-slate-500">
                Mã: {pet.id}
                {" • "}
                Phòng:{" "}
                <span className="font-semibold text-emerald-700">
                  {roomName}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Đóng"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4 overflow-y-auto p-6 text-xs">
          {/* THÔNG TIN THÚ CƯNG */}
          <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            {pet.img && !imageError ? (
              <img
                src={pet.img}
                alt={pet.name}
                onError={() => setImageError(true)}
                className="h-14 w-14 shrink-0 rounded-xl border border-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white bg-emerald-100 text-emerald-700">
                <PawPrint size={25} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                {pet.name}
              </h4>

              <p className="text-[11px] text-slate-500">{pet.type}</p>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <User size={12} className="text-slate-400" />
                  {pet.owner}
                </span>

                <span className="flex items-center gap-1 font-medium">
                  <Phone size={12} className="text-slate-400" />
                  {pet.phone}
                </span>
              </div>
            </div>
          </div>

          {/* CHI TIẾT LƯU TRÚ */}
          <div className="space-y-2.5 rounded-xl border border-slate-100 bg-white p-3.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Chi tiết kỳ lưu trú
            </h5>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="block text-slate-400">Ngày Check-in:</span>

                <span className="font-bold text-slate-800">
                  {pet.checkinDate || "—"}
                  {pet.checkinTime ? ` (${pet.checkinTime})` : ""}
                </span>
              </div>

              <div>
                <span className="block text-slate-400">
                  Ngày Check-out dự kiến:
                </span>

                <span className="font-bold text-slate-800">
                  {pet.checkoutDate || "—"}
                </span>
              </div>

              <div>
                <span className="block text-slate-400">
                  Thời gian lưu trú dự kiến:
                </span>

                <span className="font-bold text-slate-800">
                  {numberOfDays != null
                    ? `${numberOfDays} ngày`
                    : "Chưa cập nhật"}
                </span>
              </div>

              <div>
                <span className="block text-slate-400">Tổng phí lưu trú:</span>

                <span className="font-bold text-emerald-700">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* BIÊN BẢN BÀN GIAO */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Biên bản bàn giao cho chủ nuôi
            </h5>

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={returnItems}
                onChange={(e) => setReturnItems(e.target.checked)}
                disabled={isSubmitting}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />

              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Đã bàn giao đầy đủ vật dụng cá nhân
                </span>

                <p className="text-[10px] text-slate-400">
                  Xác nhận các vật dụng thực tế được gửi kèm khi Check-in đã trả
                  cho chủ nuôi.
                </p>
              </div>
            </label>

            <div>
              <label
                htmlFor="checkout-health"
                className="mb-1 block text-[11px] font-semibold text-slate-700"
              >
                Tình trạng sức khỏe & thể chất khi bàn giao
                <span className="text-rose-500"> *</span>
              </label>

              <input
                id="checkout-health"
                type="text"
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                disabled={isSubmitting}
                maxLength={300}
                placeholder="VD: Khỏe mạnh, ăn uống bình thường"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-notes"
                className="mb-1 block text-[11px] font-semibold text-slate-700"
              >
                Ghi chú thêm khi trả bé
              </label>

              <textarea
                id="checkout-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                maxLength={1000}
                placeholder="Lời dặn thêm cho chủ nuôi..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* THÔNG TIN XỬ LÝ */}
          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-[11px] text-blue-800">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />

            <span>
              Sau khi xác nhận, đơn lưu trú sẽ chuyển sang trạng thái Đã
              Check-out. Thông tin bàn giao được ghi nhận trong lịch sử trạng
              thái của Booking.
            </span>
          </div>

          {/* LỖI */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />

              <span>{error}</span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}

            <span>{isSubmitting ? "Đang xử lý..." : "Xác nhận Check-out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
