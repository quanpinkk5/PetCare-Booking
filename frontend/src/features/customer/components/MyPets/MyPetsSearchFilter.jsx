import { Search, Plus } from 'lucide-react';

const MyPetsSearchFilter = ({
    searchTerm = '',
    onSearchChange = () => {},
    selectedType = 'all',
    onTypeChange = () => {},
}) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Search size={14} />
                </span>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Tìm theo tên hoặc giống thú cưng..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700 placeholder-slate-400 transition"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <select
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="text-xs sm:text-sm font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                >
                    <option value="all">Loài: Tất cả</option>
                    <option value="Chó">Loài: Chó</option>
                    <option value="Mèo">Loài: Mèo</option>
                </select>

                <select
                    className="text-xs sm:text-sm font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                >
                    <option>Trạng thái: Tất cả</option>
                    <option>Đang hoạt động</option>
                </select>

                <select
                    className="text-xs sm:text-sm font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                >
                    <option>Sắp xếp: Mới nhất</option>
                    <option>Sắp xếp: Tên A-Z</option>
                </select>

                <button className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer">
                    <Plus size={14} />
                    <span>Thêm thú cưng</span>
                </button>
            </div>
        </div>
    );
};

export default MyPetsSearchFilter;