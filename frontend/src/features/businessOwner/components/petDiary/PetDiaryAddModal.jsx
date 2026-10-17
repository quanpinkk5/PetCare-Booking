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
  Footprints,
  Moon,
  Scissors,
} from "lucide-react";

const ACTIVITY_TYPES = [
  {
    id: "meal",
    label: "Ăn uống",
    icon: Utensils,
    iconBg: "bg-amber-100 text-amber-600",
    actionColor: "bg-amber-50 text-amber-700 border-amber-200",
    defaultTitle: "Bữa ăn theo khẩu phần",
  },
  {
    id: "med",
    label: "Uống thuốc",
    icon: Pill,
    iconBg: "bg-rose-100 text-rose-600",
    actionColor: "bg-rose-50 text-rose-700 border-rose-200",
    defaultTitle: "Uống thuốc theo chỉ định",
  },
  {
    id: "exercise",
    label: "Vận động",
    icon: Footprints,
    iconBg: "bg-blue-100 text-blue-600",
    actionColor: "bg-blue-50 text-blue-700 border-blue-200",
    defaultTitle: "Vận động sân cỏ ngoài trời",
  },
  {
    id: "grooming",
    label: "Grooming & Vệ sinh",
    icon: Scissors,
    iconBg: "bg-purple-100 text-purple-600",
    actionColor: "bg-purple-50 text-purple-700 border-purple-200",
    defaultTitle: "Tắm sấy & chải lông",
  },
  {
    id: "rest",
    label: "Nghỉ ngơi",
    icon: Moon,
    iconBg: "bg-indigo-100 text-indigo-600",
    actionColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    defaultTitle: "Nghỉ ngơi trong phòng ấm",
  },
  {
    id: "health",
    label: "Kiểm tra sức khỏe",
    icon: HeartPulse,
    iconBg: "bg-emerald-100 text-emerald-600",
    actionColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultTitle: "Đo thân nhiệt & kiểm tra thể trạng",
  },
];

export default function PetDiaryAddModal({ pet, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState(ACTIVITY_TYPES[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [note, setNote] = useState("");
  const [hasPhoto, setHasPhoto] = useState(true);

  if (!pet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.({
      petId: pet.id,
      actionType: selectedType.label,
      actionIcon: selectedType.icon,
      actionColor: selectedType.actionColor,
      actionTime: `${time} - Hôm nay`,
      note: note.trim() || selectedType.defaultTitle,
      photos: hasPhoto ? 1 : 0,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col text-xs"
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
                Thêm cập nhật nhật ký
              </h3>
              <p className="text-[11px] text-slate-500">
                Ghi nhận tình trạng cho <span className="font-semibold text-emerald-700">{pet.name}</span>
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Thông tin thú cưng tóm tắt */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <img
              src={pet.img}
              alt={pet.name}
              className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800">{pet.name} ({pet.breed})</p>
              <p className="text-[11px] text-slate-500">
                Phòng: {pet.room} • {pet.roomCode} | Chủ nuôi: {pet.owner}
              </p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${pet.statusBadge || "bg-emerald-50 text-emerald-700"}`}>
              {pet.status}
            </span>
          </div>

          {/* Chọn loại hoạt động */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">
              Loại hoạt động <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTIVITY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType.id === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/70 text-emerald-800 font-semibold shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${type.iconBg}`}>
                      <Icon size={13} />
                    </div>
                    <span className="text-[11px] truncate">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thời gian thực hiện */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Thời gian cập nhật
            </label>
            <div className="relative">
              <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:MM"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Ghi chú chi tiết */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ghi chú hoạt động & sức khỏe <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Bé ăn ngoan hết 1 bát hạt, tinh thần vui vẻ, uống đủ nước..."
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Gửi kèm ảnh */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <Camera size={16} className="text-slate-500" />
              <div>
                <p className="font-semibold text-slate-700 text-[11px]">Đính kèm ảnh minh họa</p>
                <p className="text-[10px] text-slate-400">Thông báo và ảnh sẽ gửi tới chủ nuôi</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasPhoto}
                onChange={(e) => setHasPhoto(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Footer nút hành động */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm shadow-emerald-200"
            >
              <CheckCircle2 size={14} />
              <span>Lưu cập nhật</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
