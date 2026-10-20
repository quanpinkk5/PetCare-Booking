import {
  Search,
  ChevronDown,
  CalendarDays,
  Download,
  RotateCcw,
  Filter,
} from "lucide-react";

export default function PaymentFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onApply,
  onReset,
  onExport,
  isExporting = false,
}) {
  const hasFilters =
    searchQuery ||
    statusFilter !== "all" ||
    methodFilter !== "all" ||
    fromDate ||
    toDate;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3.5">
          {/* TÌM KIẾM */}
          <div className="relative w-64 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onApply();
              }}
              placeholder="Tìm mã, booking, khách..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* TRẠNG THÁI */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Lọc theo trạng thái"
              className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">CHỜ THANH TOÁN</option>
              <option value="PROCESSING">ĐANG XỬ LÝ</option>
              <option value="PAID">ĐÃ THANH TOÁN</option>
              <option value="FAILED">THẤT BẠI</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* PHƯƠNG THỨC */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              aria-label="Lọc theo phương thức"
              className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="MOMO">MoMo</option>
              <option value="VNPAY">VNPAY</option>
              <option value="BANK_TRANSFER">Chuyển khoản</option>
              <option value="CASH">Tiền mặt (CASH)</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* KHOẢNG NGÀY */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              aria-label="Từ ngày"
              className="w-[112px] bg-transparent text-xs outline-none"
            />

            <span className="text-slate-400">-</span>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
              aria-label="Đến ngày"
              className="w-[112px] bg-transparent text-xs outline-none"
            />
          </div>

          {/* NÚT LỌC */}
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Filter className="h-3.5 w-3.5" />
            Lọc
          </button>

          {/* XÓA BỘ LỌC */}
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* XUẤT BÁO CÁO:
            Chưa kích hoạt cho tới bước Excel. */}
        <button
          type="button"
          onClick={onExport}
          disabled={!onExport || isExporting}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />

          {isExporting ? "Đang xuất..." : "Xuất báo cáo"}
        </button>
      </div>
    </div>
  );
}
