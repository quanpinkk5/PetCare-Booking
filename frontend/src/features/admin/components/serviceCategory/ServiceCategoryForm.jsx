import {
  ChevronDown,
  X,
  Scissors,
  Bath,
  Sparkles,
  HeartHandshake,
  Hotel,
  ShieldAlert,
  Ear,
  PawPrint,
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "Scissors", label: "Scissors", Icon: Scissors },
  { value: "Bath", label: "Bath", Icon: Bath },
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
  {
    value: "HeartHandshake",
    label: "HeartHandshake",
    Icon: HeartHandshake,
  },
  { value: "Hotel", label: "Hotel", Icon: Hotel },
  {
    value: "ShieldAlert",
    label: "ShieldAlert",
    Icon: ShieldAlert,
  },
  { value: "Ear", label: "Ear", Icon: Ear },
  { value: "PawPrint", label: "PawPrint", Icon: PawPrint },
];

export default function ServiceCategoryForm({
  formData,
  setFormData,
  onReset,
  onSave,
  isSaving = false,
  error = "",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.code?.trim()) {
      return;
    }

    onSave?.(formData);
  };

  const selectedIcon =
    ICON_OPTIONS.find((option) => option.value === formData.icon) ||
    ICON_OPTIONS[7];

  const SelectedIcon = selectedIcon.Icon;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          formData.id ? "Chỉnh sửa danh mục dịch vụ" : "Thêm danh mục mới"
        }
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">
            {formData.id ? "Chỉnh sửa danh mục dịch vụ" : "Thêm danh mục mới"}
          </h3>

          <button
            type="button"
            onClick={onReset}
            disabled={isSaving}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Name */}
          <div>
            <label
              htmlFor="category-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Tên danh mục <span className="text-rose-500">*</span>
            </label>

            <input
              id="category-name"
              type="text"
              required
              maxLength={100}
              disabled={isSaving}
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Nhập tên danh mục (ví dụ: Grooming, Tắm...)"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 transition-all disabled:opacity-50"
            />
          </div>

          {/* Code */}
          <div>
            <label
              htmlFor="category-code"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Mã danh mục <span className="text-rose-500">*</span>
            </label>

            <input
              id="category-code"
              type="text"
              required
              maxLength={50}
              disabled={isSaving}
              value={formData.code || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
              placeholder="Ví dụ: PET_GROOMING"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 transition-all disabled:opacity-50"
            />

            <span className="text-[11px] text-slate-400 mt-1 block">
              Mã danh mục phải duy nhất, gồm chữ cái, số và dấu gạch dưới. Có
              thể chỉnh sửa sau khi tạo.
            </span>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="category-description"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Mô tả
            </label>

            <div className="relative">
              <textarea
                id="category-description"
                rows={3}
                maxLength={255}
                disabled={isSaving}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                placeholder="Nhập mô tả chi tiết về danh mục dịch vụ..."
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 resize-none transition-all disabled:opacity-50"
              />

              <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 select-none">
                {(formData.description || "").length}/255
              </span>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label
              htmlFor="category-icon"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Icon <span className="text-rose-500">*</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <SelectedIcon className="w-5 h-5" />
              </span>

              <div className="relative flex-1">
                <select
                  id="category-icon"
                  value={formData.icon || "PawPrint"}
                  disabled={isSaving}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      icon: e.target.value,
                    })
                  }
                  className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-3 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer disabled:opacity-50"
                >
                  {ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="category-status"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Trạng thái <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <select
                id="category-status"
                value={formData.status || "ACTIVE"}
                disabled={isSaving}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer transition-all font-medium disabled:opacity-50"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tạm ẩn</option>
              </select>

              <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs"
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onReset}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Đang lưu..."
                : formData.id
                  ? "Cập nhật"
                  : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
