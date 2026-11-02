
import { useState } from "react";
import { X } from "lucide-react";

export default function EditExceptionModal({
  exception,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    date: String(exception.date || "").slice(0, 10),
    type: exception.type,
    startTime: exception.startTime || "",
    endTime: exception.endTime || "",
    capacity: exception.capacity ?? 1,
    reason: exception.reason || "",
  });

  const [error, setError] = useState("");

  const needsTime = form.type !== "CLOSED";
  const needsCapacity = form.type === "CUSTOM_HOURS";

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.date) {
      setError("Vui lòng chọn ngày ngoại lệ.");
      return;
    }

    if (needsTime) {
      if (!form.startTime || !form.endTime) {
        setError("Vui lòng nhập đầy đủ khung giờ.");
        return;
      }

      if (form.startTime >= form.endTime) {
        setError("Giờ kết thúc phải sau giờ bắt đầu.");
        return;
      }
    }

    if (
      needsCapacity &&
      (!Number.isInteger(Number(form.capacity)) ||
        Number(form.capacity) < 1)
    ) {
      setError("Sức chứa phải là số nguyên lớn hơn 0.");
      return;
    }

    const payload = {
      date: form.date,
      type: form.type,
      reason: form.reason.trim(),
      startTime: needsTime ? form.startTime : "",
      endTime: needsTime ? form.endTime : "",
      capacity: needsCapacity ? Number(form.capacity) : null,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Không thể cập nhật ngoại lệ.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Chỉnh sửa ngoại lệ
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Cập nhật lịch cho ngày cụ thể
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Đóng"
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Ngày ngoại lệ
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Loại ngoại lệ
            </label>
            <select
              value={form.type}
              onChange={(e) => {
                setForm((current) => ({
                  ...current,
                  type: e.target.value,
                  startTime: "",
                  endTime: "",
                  capacity: 1,
                }));
                setError("");
              }}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            >
              <option value="CLOSED">Nghỉ cả ngày</option>
              <option value="CUSTOM_HOURS">Giờ làm việc đặc biệt</option>
              <option value="BLOCK_SLOT">Khóa khung giờ</option>
            </select>
          </div>

          {needsTime && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) =>
                    updateField("startTime", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">
                  Giờ kết thúc
                </label>
                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) =>
                    updateField("endTime", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {needsCapacity && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Sức chứa
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={form.capacity}
                onChange={(e) =>
                  updateField("capacity", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Lý do / Ghi chú
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={form.reason}
              onChange={(e) =>
                updateField("reason", e.target.value)
              }
              className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-sm"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
