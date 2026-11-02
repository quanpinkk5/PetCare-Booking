import { Search, RotateCcw, Filter, CalendarDays } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "IN_PROGRESS", label: "Đang thực hiện" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function BookingFilterBar({
  filters,
  onFilterChange,
  onReset,
  branches = [],
  services = [],
}) {
  const updateFilter = (field, value) => {
    onFilterChange((prev) => ({
      ...prev,
      [field]: value,
      // Nếu đổi chi nhánh, bỏ dịch vụ đang chọn
      // để không giữ một dịch vụ ở chi nhánh khác.
      ...(field === "branchId" ? { branchServiceId: "" } : {}),
    }));
  };

  const availableServices = filters.branchId
    ? services.filter((item) => item.branchId === filters.branchId)
    : services;

  const inputClass =
    "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none transition focus:border-emerald-500";

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        {/* TÌM KIẾM */}
        <div className="min-w-[240px] flex-[2_1_300px]">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Tìm kiếm
          </label>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => updateFilter("keyword", e.target.value)}
              placeholder="Mã Booking, khách hàng, SĐT, thú cưng..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* TRẠNG THÁI */}
        <div className="min-w-[155px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Trạng thái
          </label>

          <div className="relative">
            <Filter
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className={`${inputClass} pl-9`}
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CHI NHÁNH */}
        <div className="min-w-[160px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Chi nhánh
          </label>

          <select
            value={filters.branchId}
            onChange={(e) => updateFilter("branchId", e.target.value)}
            className={inputClass}
          >
            <option value="">Tất cả chi nhánh</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* DỊCH VỤ */}
        <div className="min-w-[170px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Dịch vụ
          </label>

          <select
            value={filters.branchServiceId}
            onChange={(e) => updateFilter("branchServiceId", e.target.value)}
            className={inputClass}
          >
            <option value="">Tất cả dịch vụ</option>

            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* TỪ NGÀY */}
        <div className="min-w-[155px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Từ ngày
          </label>

          <div className="relative">
            <CalendarDays
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              aria-label="Từ ngày"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(e) => updateFilter("fromDate", e.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* ĐẾN NGÀY */}
        <div className="min-w-[155px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Đến ngày
          </label>

          <div className="relative">
            <CalendarDays
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              aria-label="Đến ngày"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(e) => updateFilter("toDate", e.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* ĐẶT LẠI */}
        <button
          type="button"
          onClick={onReset}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <RotateCcw size={14} />
          Đặt lại
        </button>
      </div>
    </div>
  );
}
