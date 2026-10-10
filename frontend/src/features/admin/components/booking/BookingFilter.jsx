import React from 'react';
import {
  Search,
  ChevronDown,
  Clock,
  Calendar,
  Filter,
  FilterX,
  FileSpreadsheet,
} from 'lucide-react';

export default function BookingFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  bookingTypeFilter,
  setBookingTypeFilter,
  onFilter,
  onReset,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã booking, khách hàng, thú cưng..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl text-xs py-2 pl-3.5 pr-8 text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option>Tất cả trạng thái</option>
            <option>Chờ xác nhận</option>
            <option>Đã xác nhận</option>
            <option>Đang thực hiện</option>
            <option>Hoàn thành</option>
            <option>Đã hủy</option>
          </select>

          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Booking Type Filter */}
        <div className="relative">
          <select
            value={bookingTypeFilter}
            onChange={(e) => setBookingTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl text-xs py-2 pl-3.5 pr-8 text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option>Tất cả loại booking</option>
            <option>APPOINTMENT</option>
            <option>BOARDING</option>
          </select>

          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 bg-white hover:border-slate-300 cursor-pointer">
          <Clock className="w-4 h-4 text-slate-400" />

          <span>01/05/2025 - 22/05/2025</span>

          <Calendar className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Nút Lọc */}
        <button
          type="button"
          onClick={onFilter}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc</span>
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium"
        >
          <FilterX className="w-3.5 h-3.5" />
          <span>Xóa bộ lọc</span>
        </button>
      </div>

      {/* Export */}
      <button
        type="button"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Xuất báo cáo</span>
      </button>
    </div>
  );
}