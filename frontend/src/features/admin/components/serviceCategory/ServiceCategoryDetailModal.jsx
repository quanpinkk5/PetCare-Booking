import { X, Building2, Clock, User, FileText, Code2, Tag, SquarePen } from 'lucide-react';

export default function ServiceCategoryDetailModal({ category, onClose, onEdit }) {
  if (!category) return null;

  const IconComponent = category.icon;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                category.iconBg || 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {IconComponent ? (
                <IconComponent className="w-5 h-5" />
              ) : (
                <Tag className="w-5 h-5" />
              )}
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
          {/* Status Badge */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-500">Trạng thái:</span>
            {category.status === 'Hoạt động' ? (
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
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {category.description || 'Không có mô tả.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Branch count */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                <span>Số cơ sở sử dụng</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">
                {category.branchCount ?? 0} cơ sở
              </p>
            </div>

            {/* Code */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Code2 className="w-3.5 h-3.5" />
                <span>Mã danh mục</span>
              </div>
              <p className="font-bold text-slate-800 text-sm font-mono">
                {category.code}
              </p>
            </div>

            {/* Last updated */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Cập nhật gần nhất</span>
              </div>
              <p className="font-semibold text-slate-700">
                {category.updatedAt || 'N/A'}
              </p>
            </div>

            {/* Updated by */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Người cập nhật</span>
              </div>
              <p className="font-semibold text-slate-700">
                {category.updatedBy || 'Admin'}
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
