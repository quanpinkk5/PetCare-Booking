import { BellOff, SearchX, RotateCcw, SlidersHorizontal } from "lucide-react";

export default function NotificationEmptyState({
  isFiltered,
  onResetFilters,
  onResetDemo,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 sm:p-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100">
        {isFiltered ? <SearchX size={32} /> : <BellOff size={32} />}
      </div>

      <h3 className="text-base font-bold text-slate-800">
        {isFiltered
          ? "Không tìm thấy thông báo nào phù hợp"
          : "Hộp thư thông báo của cơ sở đang trống"}
      </h3>

      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
        {isFiltered
          ? "Hãy thử thay đổi từ khóa tìm kiếm, kiểm tra lại bộ lọc danh mục, chi nhánh hoặc mức độ ưu tiên."
          : "Hiện tại không có thông báo hoặc cảnh báo mới nào. Tất cả hoạt động của cơ sở đang diễn ra êm đẹp!"}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {isFiltered ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Xóa tất cả bộ lọc</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Tải dữ liệu thông báo mẫu</span>
          </button>
        )}
      </div>
    </div>
  );
}
