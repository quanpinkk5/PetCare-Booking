import {
    Search,
    Calendar,
    SlidersHorizontal,
    ChevronDown,
} from "lucide-react";

const BookingFilterBar = ({
    activeTab,
    setActiveTab,
    tabs,
    searchQuery = "",
    setSearchQuery = () => {},
    timeFilter = "all",
    setTimeFilter = () => {},
    statusFilter = "all",
    setStatusFilter = () => {},
}) => {
    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">

                <div className="sm:col-span-6 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                        <Search size={16} />
                    </span>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo mã booking, thú cưng, cơ sở..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400"
                    />
                </div>

                <div className="sm:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                        <Calendar size={16} />
                    </span>

                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 appearance-none text-slate-600 outline-none cursor-pointer"
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                    </select>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
                        <ChevronDown size={14} />
                    </span>
                </div>

                <div className="sm:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                        <SlidersHorizontal size={16} />
                    </span>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setActiveTab(e.target.value);
                        }}
                        className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 appearance-none text-slate-600 outline-none cursor-pointer"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="in-progress">Đang thực hiện</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
                        <ChevronDown size={14} />
                    </span>
                </div>

            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pt-2 pb-1 text-xs sm:text-sm font-semibold whitespace-nowrap custom-scrollbar">

                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setStatusFilter(tab.id);
                        }}
                        className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === tab.id
                                ? "text-teal-600 border-b-2 border-teal-600 font-bold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        <span>{tab.label}</span>

                        {tab.count !== null && (
                            <span
                                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${tab.badgeColor}`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}

            </div>
        </div>
    );
};

export default BookingFilterBar;