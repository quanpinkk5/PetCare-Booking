import { Search, ChevronDown, Calendar, RotateCcw } from "lucide-react";

export default function BookingFilterBar({ filters, onFilterChange, onReset }) {
  const updateFilter = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Tìm kiếm */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search
            size={15}
            className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            value={filters.keyword}
            onChange={(e) => updateFilter("keyword", e.target.value)}
            type="text"
            placeholder="Tìm theo mã, khách hàng, thú cưng..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Lọc trạng thái */}
        <div className="relative min-w-[140px]">
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-xs appearance-none outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer"
          >
            {[
              "Tất cả trạng thái",
              "Chờ xác nhận",
              "Đã xác nhận",
              "Đã check-in",
              "Đang phục vụ",
              "Hoàn thành",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Lọc chi nhánh */}
        <div className="relative min-w-[140px]">
          <select
            value={filters.branch}
            onChange={(e) => updateFilter("branch", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-xs appearance-none outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer"
          >
            {["Tất cả chi nhánh", "Cầu Giấy", "Hà Đông"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Lọc dịch vụ */}
        <div className="relative min-w-[150px]">
          <select
            value={filters.service}
            onChange={(e) => updateFilter("service", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-xs appearance-none outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer"
          >
            {[
              "Tất cả dịch vụ",
              "Cắt tỉa lông cao cấp",
              "Tắm & Spa thảo dược",
              "Khách sạn lưu trú",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Khoảng ngày */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          <span>22/05/2025</span>
        </div>
      </div>

      {/* Nút Đặt lại */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
      >
        <RotateCcw size={13} className="text-slate-400" />
        <span>Đặt lại</span>
      </button>
    </div>
  );
}
