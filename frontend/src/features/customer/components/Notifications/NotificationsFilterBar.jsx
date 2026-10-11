import {
  Search,
  X,
  Filter,
  CheckCheck,
  Trash2,
  CalendarCheck,
  HeartPulse,
  CreditCard,
  Tag,
  Star,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

const CATEGORY_ICONS = {
  booking: CalendarCheck,
  pet_care: HeartPulse,
  payment: CreditCard,
  promotion: Tag,
  review: Star,
  system: ShieldCheck,
};

const NotificationsFilterBar = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categories,
  categoryCounts,
  readFilter,
  onReadFilterChange,
  sortBy,
  onSortByChange,
  onMarkAllAsRead,
  onClearReadNotifications,
  unreadCount,
  isFiltered,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top row: Search input + Read filter pills + Sort dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tiêu đề, thú cưng (Milo, Mimi), mã lịch hẹn, voucher..."
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Read state filter segmented control */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-medium text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => onReadFilterChange("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              readFilter === "all"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => onReadFilterChange("unread")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              readFilter === "unread"
                ? "bg-white text-emerald-700 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onReadFilterChange("read")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              readFilter === "read"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            Đã đọc
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="newest">Mới nhất trước</option>
            <option value="oldest">Cũ nhất trước</option>
            <option value="priority">Ưu tiên quan trọng</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = CATEGORY_ICONS[cat.id];
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/20"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
              }`}
            >
              {Icon && <Icon size={14} className={isActive ? "text-white" : "text-slate-500"} />}
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                  isActive
                    ? "bg-emerald-700/60 text-white"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Sub-bar: Filter Status & Batch Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span>
            {isFiltered ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Filter size={13} />
                Đang áp dụng bộ lọc tùy chỉnh
                <button
                  onClick={onResetFilters}
                  className="text-emerald-600 hover:text-emerald-800 underline ml-1 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  Đặt lại
                </button>
              </span>
            ) : (
              <span>Hiển thị tất cả danh mục thông báo</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-medium cursor-pointer transition-colors"
            >
              <CheckCheck size={14} />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          )}

          <button
            onClick={onClearReadNotifications}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
            <span>Dọn dẹp đã đọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsFilterBar;
