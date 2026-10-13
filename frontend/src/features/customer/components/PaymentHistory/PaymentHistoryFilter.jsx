import { Search, X, Filter, RotateCcw, ArrowUpDown } from "lucide-react";

export default function PaymentHistoryFilter({
    activeStatusTab,
    onStatusTabChange,
    statusTabs,
    searchQuery,
    onSearchChange,
    selectedMethod,
    onMethodChange,
    selectedTimeRange,
    onTimeRangeChange,
    sortBy,
    onSortChange,
    onResetFilters,
    isFiltered,
}) {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
                {statusTabs.map((tab) => {
                    const isActive = activeStatusTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onStatusTabChange(tab.id)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                isActive
                                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20"
                                    : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60"
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.count !== null && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                                        isActive
                                            ? "bg-emerald-700/80 text-white"
                                            : tab.badgeColor || "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Filter controls row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search input */}
                <div className="md:col-span-5 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm theo mã GD, mã lịch hẹn, dịch vụ, thú cưng..."
                        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Method selector */}
                <div className="md:col-span-3">
                    <select
                        value={selectedMethod}
                        onChange={(e) => onMethodChange(e.target.value)}
                        aria-label="Chọn phương thức thanh toán"
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="all">Tất cả phương thức</option>
                        <option value="vnpay">VNPAY-QR</option>
                        <option value="momo">Ví MoMo</option>
                        <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                        <option value="cash">Tiền mặt tại cơ sở</option>
                    </select>
                </div>

                {/* Time range selector */}
                <div className="md:col-span-2">
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => onTimeRangeChange(e.target.value)}
                        aria-label="Chọn khoảng thời gian"
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="this_month">Tháng 8/2026</option>
                        <option value="last_month">Tháng 7/2026</option>
                        <option value="older">Trước đó</option>
                    </select>
                </div>

                {/* Sort selector */}
                <div className="md:col-span-2 flex items-center gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        aria-label="Sắp xếp kết quả"
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="amount_desc">Số tiền: Cao → Thấp</option>
                        <option value="amount_asc">Số tiền: Thấp → Cao</option>
                    </select>

                    {/* Reset Button */}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            title="Đặt lại bộ lọc"
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-300 hover:bg-slate-50 transition cursor-pointer shrink-0"
                        >
                            <RotateCcw size={15} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
