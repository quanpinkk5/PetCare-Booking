import { Search, Filter, RotateCcw, X, CalendarDays } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Chờ Check-in" },
  { value: "IN_PROGRESS", label: "Đang lưu trú" },
  { value: "COMPLETED", label: "Đã Check-out" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function BoardingFilters({
  searchTerm = "",
  setSearchTerm,

  statusFilter = "all",
  setStatusFilter,

  fromDate = "",
  setFromDate,

  toDate = "",
  setToDate,

  onReset,
}) {
  const invalidDateRange = Boolean(fromDate && toDate && fromDate > toDate);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    (statusFilter !== "all" && statusFilter !== "") ||
    Boolean(fromDate) ||
    Boolean(toDate);

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }

    setSearchTerm?.("");
    setStatusFilter?.("all");
    setFromDate?.("");
    setToDate?.("");
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      {/* HEADER */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Filter size={16} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">Bộ lọc lưu trú</h3>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Tìm kiếm theo thông tin đặt lịch, trạng thái và ngày Check-in
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={13} />
          Đặt lại bộ lọc
        </button>
      </div>

      {/* BỘ LỌC */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        {/* TÌM KIẾM */}
        <div className="min-w-0 md:col-span-2 lg:col-span-1">
          <label
            htmlFor="boarding-search"
            className="mb-1.5 block text-[11px] font-semibold text-slate-600"
          >
            Tìm kiếm đơn lưu trú
          </label>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="boarding-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              placeholder="Mã Booking, tên thú cưng, tên hoặc SĐT khách hàng..."
              autoComplete="off"
              className="h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm?.("")}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* TRẠNG THÁI */}
        <div className="min-w-0">
          <label
            htmlFor="boarding-status"
            className="mb-1.5 block text-[11px] font-semibold text-slate-600"
          >
            Trạng thái lưu trú
          </label>

          <select
            id="boarding-status"
            value={statusFilter || "all"}
            onChange={(e) => setStatusFilter?.(e.target.value)}
            className="h-10 w-full min-w-0 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* TỪ NGÀY */}
        <div className="min-w-0">
          <label
            htmlFor="boarding-from-date"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600"
          >
            <CalendarDays size={13} className="text-emerald-600" />
            Từ ngày
          </label>

          <input
            id="boarding-from-date"
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate?.(e.target.value)}
            className={`h-10 w-full min-w-0 rounded-xl border bg-white px-3 text-xs text-slate-700 outline-none transition focus:ring-2 ${
              invalidDateRange
                ? "border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
            }`}
          />
        </div>

        {/* ĐẾN NGÀY */}
        <div className="min-w-0">
          <label
            htmlFor="boarding-to-date"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600"
          >
            <CalendarDays size={13} className="text-emerald-600" />
            Đến ngày
          </label>

          <input
            id="boarding-to-date"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate?.(e.target.value)}
            className={`h-10 w-full min-w-0 rounded-xl border bg-white px-3 text-xs text-slate-700 outline-none transition focus:ring-2 ${
              invalidDateRange
                ? "border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            }`}
          />
        </div>
      </div>

      {/* THÔNG BÁO NGÀY KHÔNG HỢP LỆ */}
      {invalidDateRange && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
        >
          Ngày bắt đầu không được lớn hơn ngày kết thúc.
        </div>
      )}

      {/* BỘ LỌC ĐANG ÁP DỤNG */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-400">
            Đang lọc:
          </span>

          {searchTerm.trim() && (
            <button
              type="button"
              onClick={() => setSearchTerm?.("")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              <Search size={11} />
              <span className="max-w-[220px] truncate">
                {searchTerm.trim()}
              </span>
              <X size={12} />
            </button>
          )}

          {statusFilter !== "all" && statusFilter !== "" && (
            <button
              type="button"
              onClick={() => setStatusFilter?.("all")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              <Filter size={11} />
              {STATUS_OPTIONS.find((option) => option.value === statusFilter)
                ?.label || statusFilter}
              <X size={12} />
            </button>
          )}

          {fromDate && (
            <button
              type="button"
              onClick={() => setFromDate?.("")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <CalendarDays size={11} />
              Từ: {fromDate}
              <X size={12} />
            </button>
          )}

          {toDate && (
            <button
              type="button"
              onClick={() => setToDate?.("")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <CalendarDays size={11} />
              Đến: {toDate}
              <X size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
