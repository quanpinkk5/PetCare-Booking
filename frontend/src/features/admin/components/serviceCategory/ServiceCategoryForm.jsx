import { PawPrint, ChevronDown, X } from 'lucide-react';

export default function ServiceCategoryForm({
  formData,
  setFormData,
  onReset,
  onSave,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.code?.trim()) {
      alert('Vui lòng nhập đầy đủ Tên danh mục và Mã danh mục!');
      return;
    }
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">
            {formData.id ? 'Chỉnh sửa danh mục dịch vụ' : 'Thêm danh mục mới'}
          </h3>

          <button
            type="button"
            onClick={onReset}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Nhập tên danh mục (ví dụ: Grooming, Tắm...)"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mã danh mục <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={formData.code || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value,
                })
              }
              placeholder="Nhập mã danh mục (viết liền, không dấu)"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 transition-all"
            />

            <span className="text-[11px] text-slate-400 mt-1 block">
              Mã danh mục là duy nhất và không thể thay đổi.
            </span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mô tả
            </label>

            <div className="relative">
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                maxLength={255}
                placeholder="Nhập mô tả chi tiết về danh mục dịch vụ..."
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 resize-none transition-all"
              />

              <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 select-none">
                {(formData.description || '').length}/255
              </span>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Icon <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-700 hover:border-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <PawPrint className="w-3.5 h-3.5" />
                  </span>
                  <span>PawPrint (Mặc định)</span>
                </span>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trạng thái <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <select
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer transition-all font-medium"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ẩn</option>
              </select>

              <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-200 transition-colors cursor-pointer"
            >
              {formData.id ? 'Cập nhật' : 'Lưu danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}