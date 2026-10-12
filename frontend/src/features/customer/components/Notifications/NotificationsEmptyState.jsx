import { Link } from "react-router-dom";
import { BellOff, RotateCcw, CalendarPlus } from "lucide-react";

const NotificationsEmptyState = ({ isFiltered, onResetFilters }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-14 text-center">
      {/* Decorative Icon Circle */}
      <div className="relative mx-auto w-20 h-20 mb-5">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
          <BellOff size={36} />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center text-xs">
          🐾
        </div>
      </div>

      {/* Headings */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
        {isFiltered ? "Không tìm thấy thông báo phù hợp" : "Chưa có thông báo mới nào"}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        {isFiltered
          ? "Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các tiêu chí lọc để xem thêm thông báo."
          : "Bạn đã cập nhật toàn bộ thông tin! Các cập nhật về lịch hẹn, sức khỏe thú cưng và ưu đãi mới sẽ xuất hiện tại đây ngay khi có."}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered ? (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Đặt lại bộ lọc</span>
          </button>
        ) : (
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <CalendarPlus size={16} />
            <span>Đặt lịch chăm sóc ngay</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotificationsEmptyState;
