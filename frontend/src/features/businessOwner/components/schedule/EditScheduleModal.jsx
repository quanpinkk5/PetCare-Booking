import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function EditScheduleModal({
  slot,
  saving = false,
  onClose,
  onSubmit,
  onDelete,
  onDeleteSchedule,
}) {
  // ==============================
  // 1. STATE
  // ==============================
  const [form, setForm] = useState({
    startTime: slot.startTime,
    endTime: slot.endTime,
    capacity: slot.capacity,
    status: slot.status,
  });

  const [error, setError] = useState("");

  // ==============================
  // 2. CẬP NHẬT FORM
  // ==============================
  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  // ==============================
  // 3. LƯU THAY ĐỔI KHUNG GIỜ
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const capacity = Number(form.capacity);

    if (!form.startTime || !form.endTime) {
      setError("Vui lòng nhập đầy đủ giờ bắt đầu và giờ kết thúc.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Sức chứa phải là số nguyên lớn hơn 0.");
      return;
    }

    try {
      await onSubmit({
        startTime: form.startTime,
        endTime: form.endTime,
        capacity,
        status: form.status,
      });
    } catch (err) {
      // Nhận lỗi từ Backend, bao gồm HTTP 409
      setError(err.message || "Không thể cập nhật khung giờ.");
    }
  };

  // ==============================
  // 4. XÓA MỘT KHUNG GIỜ
  // ==============================
  const handleDeleteSlotClick = async () => {
    if (saving) return;

    setError("");

    try {
      await onDelete();
    } catch (err) {
      // Ví dụ: slot đang có Booking tương lai
      setError(err.message || "Không thể xóa khung giờ.");
    }
  };

  // ==============================
  // 5. XÓA TOÀN BỘ LỊCH CỦA MỘT THỨ
  // ==============================
  const handleDeleteScheduleClick = async () => {
    if (saving) return;

    setError("");

    try {
      await onDeleteSchedule();
    } catch (err) {
      setError(err.message || "Không thể xóa lịch làm việc.");
    }
  };

  // ==============================
  // 6. GIAO DIỆN
  // ==============================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Chỉnh sửa khung giờ
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Thay đổi lịch làm việc lặp hằng tuần
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Đóng"
            className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NGÀY LÀM VIỆC */}
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-sm text-slate-600">
              Ngày làm việc:{" "}
              <strong className="text-slate-800">{slot.day}</strong>
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Các thay đổi tại đây áp dụng cho lịch lặp lại hằng tuần, không chỉ
              một ngày.
            </p>
          </div>

          {/* GIỜ BẮT ĐẦU / KẾT THÚC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Giờ bắt đầu
              </label>

              <input
                type="time"
                required
                disabled={saving}
                value={form.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Giờ kết thúc
              </label>

              <input
                type="time"
                required
                disabled={saving}
                value={form.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* SỨC CHỨA */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Sức chứa
            </label>

            <input
              type="number"
              min="1"
              step="1"
              required
              disabled={saving}
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
            />
          </div>

          {/* TRẠNG THÁI */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Trạng thái
            </label>

            <select
              value={form.status}
              disabled={saving}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              <option value="AVAILABLE">Còn chỗ</option>

              <option value="MAINTENANCE">Bảo trì</option>

              <option value="OFF">Nghỉ / Đóng</option>
            </select>
          </div>

          {/* HIỂN THỊ LỖI TỪ BACKEND */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3"
            >
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Không thể thực hiện thao tác
                </p>

                <p className="mt-1 whitespace-pre-line text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* NÚT THAO TÁC */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {/* NHÓM XÓA */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={handleDeleteSlotClick}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Xóa khung giờ
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleDeleteScheduleClick}
                className="rounded-lg border border-red-600 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Xóa lịch {slot.day}
              </button>
            </div>

            {/* NHÓM LƯU */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
