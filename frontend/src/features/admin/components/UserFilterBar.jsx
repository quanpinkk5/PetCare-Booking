import { useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  Download,
  Filter,
  RotateCcw,
  UserPlus,
} from "lucide-react";

export default function UserFilterBar({
  onFilter,
  onReset,
  onCreateOwner,
  onExport,
  isExporting = false,
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    if (timeRange === "custom" && startDate && endDate && startDate > endDate) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    onFilter?.({
      search: search.trim(),
      role,
      status,
      timeRange,
      startDate: timeRange === "custom" ? startDate : "",
      endDate: timeRange === "custom" ? endDate : "",
    });
  };

  const handleReset = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setTimeRange("all");
    setStartDate("");
    setEndDate("");
    onReset?.();
  };

  return (
    <section className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Filter */}
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilter();
              }
            }}
            className="w-full pr-10 pl-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
            placeholder="Tìm tên, email, số điện thoại..."
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Role */}
        <div className="relative min-w-[140px]">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer"
          >
            <option value="all">Vai trò: Tất cả</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="BUSINESS_OWNER">Chủ cơ sở</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative min-w-[150px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Time */}

        {/* Time Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[165px]">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none cursor-pointer"
            >
              <option value="all">Thời gian: Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày gần đây</option>
              <option value="30days">30 ngày gần đây</option>
              <option value="custom">Chọn khoảng ngày...</option>
            </select>

            <Calendar
              size={16}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {timeRange === "custom" && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-600">
                Từ
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-600">
                Đến
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                />
              </label>
            </div>
          )}
        </div>

        {/* Nút Lọc và Reset cạnh bộ lọc thời gian */}
        <button
          type="button"
          onClick={handleFilter}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer"
          title="Áp dụng bộ lọc"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
      <button
        type="button"
        onClick={onCreateOwner}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
      >
        <UserPlus size={17} />
        Thêm chủ cơ sở
      </button>
      {/* Export */}
      {/* Export */}
      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}

        <span>{isExporting ? "Đang xuất..." : "Xuất dữ liệu"}</span>
      </button>
    </section>
  );
}
