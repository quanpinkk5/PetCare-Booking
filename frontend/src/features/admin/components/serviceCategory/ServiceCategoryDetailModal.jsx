import {
  X,
  Layers,
  Clock,
  CalendarDays,
  FileText,
  Code2,
  Tag,
  SquarePen,
  Scissors,
  Bath,
  Sparkles,
  HeartHandshake,
  Hotel,
  ShieldAlert,
  Ear,
  PawPrint,
} from "lucide-react";

const ICON_MAP = {
  Scissors,
  Bath,
  Sparkles,
  HeartHandshake,
  Hotel,
  ShieldAlert,
  Ear,
  PawPrint,
};

const ICON_BG_MAP = {
  Scissors: "bg-emerald-50 text-emerald-600",
  Bath: "bg-sky-50 text-sky-600",
  Sparkles: "bg-purple-50 text-purple-600",
  HeartHandshake: "bg-amber-50 text-amber-600",
  Hotel: "bg-blue-50 text-blue-600",
  ShieldAlert: "bg-rose-50 text-rose-600",
  Ear: "bg-teal-50 text-teal-600",
  PawPrint: "bg-orange-50 text-orange-600",
};

const formatDateTime = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ServiceCategoryDetailModal({
  category,
  onClose,
  onEdit,
}) {
  if (!category) return null;

  const IconComponent = ICON_MAP[category.icon] || Tag;

  const iconBg = ICON_BG_MAP[category.icon] || "bg-emerald-50 text-emerald-600";

  const isActive = category.status === "ACTIVE";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chi tiết danh mục dịch vụ"
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
            >
              <IconComponent className="w-5 h-5" />
            </span>

            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {category.name}
              </h3>

              <span className="text-xs font-mono text-slate-400">
                Mã: {category.code}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          {/* Status */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Trạng thái:</span>

            {isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Hoạt động
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Tạm ẩn
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5 py-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-500">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Mô tả chi tiết:</span>
            </div>

            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {category.description || "Không có mô tả."}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Service Count */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Layers className="w-3.5 h-3.5" />
                <span>Số dịch vụ sử dụng</span>
              </div>

              <p className="font-bold text-slate-800 text-sm">
                {category.serviceCount ?? 0} dịch vụ
              </p>
            </div>

            {/* Code */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Code2 className="w-3.5 h-3.5" />
                <span>Mã danh mục</span>
              </div>

              <p className="font-bold text-slate-800 text-sm font-mono break-all">
                {category.code}
              </p>
            </div>

            {/* Last Updated */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Cập nhật gần nhất</span>
              </div>

              <p className="font-semibold text-slate-700">
                {formatDateTime(category.updatedAt)}
              </p>
            </div>

            {/* Created At */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Ngày tạo</span>
              </div>

              <p className="font-semibold text-slate-700">
                {formatDateTime(category.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(category);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-200 transition-colors cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
