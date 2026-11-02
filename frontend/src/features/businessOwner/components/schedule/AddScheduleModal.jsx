import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

const DAYS = [
  { value: "MONDAY", label: "Thứ Hai" },
  { value: "TUESDAY", label: "Thứ Ba" },
  { value: "WEDNESDAY", label: "Thứ Tư" },
  { value: "THURSDAY", label: "Thứ Năm" },
  { value: "FRIDAY", label: "Thứ Sáu" },
  { value: "SATURDAY", label: "Thứ Bảy" },
  { value: "SUNDAY", label: "Chủ Nhật" },
];

const createEmptySlot = () => ({
  startTime: "",
  endTime: "",
  capacity: 1,
  status: "AVAILABLE",
});

export default function AddScheduleModal({
  onClose,
  onSubmit,
  schedules = [],
  saving = false,
}) {
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [slots, setSlots] = useState([createEmptySlot()]);
  const [error, setError] = useState("");

  const existingSchedule = schedules.find(
    (item) => item.dayOfWeek === dayOfWeek,
  );

  const existingSlots = existingSchedule?.slots || [];

  const updateSlot = (index, field, value) => {
    setSlots((current) =>
      current.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const addSlot = () => {
    setSlots((current) => [...current, createEmptySlot()]);
  };

  const removeSlot = (index) => {
    setSlots((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (slots.length === 0) {
      setError("Vui lòng thêm ít nhất một khung giờ.");
      return;
    }

    const newSlots = slots.map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: Number(slot.capacity),
      status: slot.status,
    }));

    for (const slot of newSlots) {
      if (!slot.startTime || !slot.endTime) {
        setError("Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc.");
        return;
      }

      if (slot.startTime >= slot.endTime) {
        setError("Giờ kết thúc phải sau giờ bắt đầu.");
        return;
      }

      if (!Number.isInteger(slot.capacity) || slot.capacity < 1) {
        setError("Sức chứa phải là số nguyên lớn hơn 0.");
        return;
      }
    }

    // Kiểm tra cả slot cũ và mới để tránh chồng giờ
    const allSlots = [...existingSlots, ...newSlots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    for (let i = 1; i < allSlots.length; i++) {
      if (allSlots[i].startTime < allSlots[i - 1].endTime) {
        setError(
          "Khung giờ mới bị chồng với khung giờ đã có hoặc khung giờ khác.",
        );
        return;
      }
    }

    try {
      await onSubmit({
        dayOfWeek,
        slots: newSlots,
        isActive: true,
      });
    } catch (err) {
      setError(err.message || "Không thể lưu lịch làm việc.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Thêm lịch làm việc
            </h2>
            <p className="text-xs text-slate-500">
              Thiết lập lịch lặp lại hằng tuần
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Ngày trong tuần
            </label>

            <select
              value={dayOfWeek}
              onChange={(e) => {
                setDayOfWeek(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-500"
            >
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị khung giờ đã tồn tại */}
          {existingSchedule && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="mb-2 text-xs font-semibold text-blue-700">
                Các khung giờ đã có trong ngày
              </p>

              {existingSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {existingSlots.map((slot, index) => (
                    <span
                      key={slot._id || index}
                      className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs text-blue-700"
                    >
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-blue-600">Chưa có khung giờ nào.</p>
              )}
            </div>
          )}

          {/* Chỉ nhập những khung giờ mới */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Khung giờ muốn thêm
              </h3>

              <button
                type="button"
                onClick={addSlot}
                disabled={saving}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={15} />
                Thêm khung giờ
              </button>
            </div>

            {slots.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-5"
              >
                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    Bắt đầu
                  </label>
                  <input
                    type="time"
                    required
                    value={slot.startTime}
                    onChange={(e) =>
                      updateSlot(index, "startTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    Kết thúc
                  </label>
                  <input
                    type="time"
                    required
                    value={slot.endTime}
                    onChange={(e) =>
                      updateSlot(index, "endTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={slot.capacity}
                    onChange={(e) =>
                      updateSlot(index, "capacity", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    Trạng thái
                  </label>
                  <select
                    value={slot.status}
                    onChange={(e) =>
                      updateSlot(index, "status", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                  >
                    <option value="AVAILABLE">Còn chỗ</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                    <option value="OFF">Nghỉ / Đóng</option>
                  </select>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    disabled={saving || slots.length === 1}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-30"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu lịch làm việc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
