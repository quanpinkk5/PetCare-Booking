import { useState } from "react";
import {
  X,
  BookHeart,
  Utensils,
  Pill,
  Activity,
  HeartPulse,
  Sparkles,
  Camera,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PawPrint,
} from "lucide-react";

// ========================================
// 1. GIỮ CỐ ĐỊNH 5 LOẠI HOẠT ĐỘNG
// ========================================

const ACTIVITY_TYPES = [
  {
    id: "meal",
    label: "Ăn uống",
    icon: Utensils,
    iconBg: "bg-amber-100 text-amber-600",
    defaultTitle: "Bữa ăn theo khẩu phần",
  },
  {
    id: "med",
    label: "Uống thuốc",
    icon: Pill,
    iconBg: "bg-rose-100 text-rose-600",
    defaultTitle: "Uống thuốc theo chỉ định",
  },
  {
    id: "exercise",
    label: "Vận động",
    icon: Activity,
    iconBg: "bg-blue-100 text-blue-600",
    defaultTitle: "Vận động sân cỏ ngoài trời",
  },
  {
    id: "hygiene",
    label: "Vệ sinh & Tắm",
    icon: Sparkles,
    iconBg: "bg-purple-100 text-purple-600",
    defaultTitle: "Chải lông & vệ sinh sạch sẽ",
  },
  {
    id: "health",
    label: "Kiểm tra sức khỏe",
    icon: HeartPulse,
    iconBg: "bg-emerald-100 text-emerald-600",
    defaultTitle: "Kiểm tra thân nhiệt & thể trạng",
  },
];

// ========================================
// 2. LẤY NGÀY GIỜ LOCAL
//    DÙNG CHO INPUT datetime-local
// ========================================

const getLocalDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");

  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ========================================
// 3. MODAL THÊM NHẬT KÝ
// ========================================

export default function AddDiaryModal({ pet, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState(ACTIVITY_TYPES[0]);

  const [activityDateTime, setActivityDateTime] = useState(getLocalDateTime);

  const [title, setTitle] = useState(ACTIVITY_TYPES[0].defaultTitle);

  const [desc, setDesc] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!pet) return null;

  // ======================================
  // 4. CHỌN LOẠI HOẠT ĐỘNG
  // ======================================

  const handleTypeSelect = (type) => {
    if (saving) return;

    setSelectedType(type);
    setTitle(type.defaultTitle);
    setError("");
  };

  // ======================================
  // 5. ĐÓNG MODAL
  // ======================================

  const handleClose = () => {
    if (saving) return;
    onClose?.();
  };

  // ======================================
  // 6. VALIDATE + GỌI HÀM LƯU
  // ======================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");

    if (!pet.bookingId) {
      setError("Không tìm thấy Booking ID của đơn lưu trú.");
      return;
    }

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề hoạt động.");
      return;
    }

    if (!activityDateTime) {
      setError("Vui lòng chọn ngày và giờ hoạt động.");
      return;
    }

    const parsedDate = new Date(activityDateTime);

    if (Number.isNaN(parsedDate.getTime())) {
      setError("Ngày giờ hoạt động không hợp lệ.");
      return;
    }

    if (parsedDate.getTime() > Date.now()) {
      setError("Thời gian hoạt động không được ở tương lai.");
      return;
    }

    // Model PetDiary hiện không có trường title.
    // Ghép title và ghi chú vào description.
    const description = [title.trim(), desc.trim()].filter(Boolean).join("\n");

    if (description.length > 3000) {
      setError("Tổng nội dung nhật ký không được vượt quá 3000 ký tự.");
      return;
    }

    const payload = {
      activityType: selectedType.id,
      description,
      activityTime: parsedDate.toISOString(),

      // Chưa có API upload ảnh:
      // Không gửi ảnh đại diện thú cưng.
      images: [],
    };

    setSaving(true);

    try {
      // BoardingPage sẽ gọi API tại đây.
      // Nếu API lỗi, Promise reject và modal
      // vẫn mở để người dùng sửa / thử lại.
      await onSave?.(payload);
    } catch (err) {
      setError(err?.message || "Không thể lưu nhật ký chăm sóc.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // 7. GIAO DIỆN
  // ======================================

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
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookHeart size={18} />
            </span>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Thêm nhật ký chăm sóc
              </h3>

              <p className="text-[11px] text-slate-500">
                Thú cưng:{" "}
                <span className="font-semibold text-emerald-700">
                  {pet.name}
                </span>{" "}
                ({pet.type})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Đóng"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto p-6 text-xs"
        >
          {/* THÔNG TIN THÚ CƯNG */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            {pet.img ? (
              <img
                src={pet.img}
                alt={pet.name}
                className="h-10 w-10 shrink-0 rounded-xl border border-white object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <PawPrint size={20} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-800">{pet.name}</p>

              <p className="text-[11px] text-slate-500">
                Phòng: {pet.roomName}
                {" • "}
                Chủ nuôi: {pet.owner}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                pet.statusClass || "bg-blue-100 text-blue-700"
              }`}
            >
              {pet.status}
            </span>
          </div>

          {/* LOẠI HOẠT ĐỘNG */}
          <div>
            <label className="mb-2 block text-[11px] font-bold text-slate-700">
              Loại hoạt động <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ACTIVITY_TYPES.map((type) => {
                const Icon = type.icon;

                const isSelected = selectedType.id === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    disabled={saving}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${type.iconBg}`}
                    >
                      <Icon size={13} />
                    </div>

                    <span className="truncate text-[11px]">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* THỜI GIAN + TIÊU ĐỀ */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="diary-activity-time"
                className="mb-1 block text-[11px] font-bold text-slate-700"
              >
                Ngày và giờ <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <Clock
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="diary-activity-time"
                  type="datetime-local"
                  value={activityDateTime}
                  max={getLocalDateTime()}
                  onChange={(e) => setActivityDateTime(e.target.value)}
                  disabled={saving}
                  required
                  className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-7 pr-1 text-[11px] outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="diary-title"
                className="mb-1 block text-[11px] font-bold text-slate-700"
              >
                Tiêu đề hoạt động <span className="text-rose-500">*</span>
              </label>

              <input
                id="diary-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                required
                maxLength={200}
                placeholder="Nhập tiêu đề nhật ký..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* GHI CHÚ */}
          <div>
            <label
              htmlFor="diary-description"
              className="mb-1 block text-[11px] font-bold text-slate-700"
            >
              Ghi chú chi tiết / Tình trạng
            </label>

            <textarea
              id="diary-description"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              disabled={saving}
              maxLength={2800}
              placeholder="Ghi chú thêm: lượng thức ăn, biểu hiện tâm lý, vận động tốt hay không..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            />
          </div>

          {/* ẢNH: CHỜ API UPLOAD */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] font-semibold text-slate-700">
                  Đính kèm ảnh thú cưng
                </p>

                <p className="text-[10px] text-slate-400">
                  Chưa hỗ trợ tải ảnh lên ở phiên bản này
                </p>
              </div>
            </div>

            <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500">
              Sắp có
            </span>
          </div>

          {/* LỖI LƯU NHẬT KÝ */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />

              <span>{error}</span>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle2 size={14} />
              )}

              <span>{saving ? "Đang lưu..." : "Lưu nhật ký"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
