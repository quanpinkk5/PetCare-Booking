import React from 'react';
import {
  Search,
  ChevronDown,
  CalendarDays,
  Download,
  RotateCcw,
} from 'lucide-react';

export default function PaymentFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  onReset,
  onExport,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Nhóm bộ lọc bên trái */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Ô tìm kiếm nhỏ gọn */}
          <div className="relative w-64 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã, booking, khách..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Lọc Trạng thái */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Lọc theo trạng thái"
              className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="ĐÃ THANH TOÁN">ĐÃ THANH TOÁN</option>
              <option value="ĐANG XỬ LÝ">ĐANG XỬ LÝ</option>
              <option value="THẤT BẠI">THẤT BẠI</option>
              <option value="ĐÃ HOÀN TIỀN">ĐÃ HOÀN TIỀN</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Lọc Phương thức */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              aria-label="Lọc theo phương thức"
              className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Tất cả">Tất cả phương thức</option>
              <option value="MoMo">MoMo</option>
              <option value="VNPAY">VNPAY</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
              <option value="Tiền mặt (CASH)">Tiền mặt (CASH)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Khoảng thời gian */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>01/05/2025 - 22/05/2025</span>
          </div>

          {/* Nút Xóa lọc nếu đang có lọc */}
          {(searchQuery || statusFilter !== 'Tất cả' || methodFilter !== 'Tất cả') && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Nút Xuất báo cáo bên phải */}
        <button
          type="button"
          onClick={onExport || (() => window.print())}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-xs transition-colors hover:bg-emerald-100 shrink-0"
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </div>
    </div>
  );
}
