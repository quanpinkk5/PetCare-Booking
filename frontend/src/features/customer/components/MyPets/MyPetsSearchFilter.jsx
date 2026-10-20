import { Search, Plus } from 'lucide-react';

const MyPetsSearchFilter = ({
    searchTerm = '',
    onSearchChange = () => {},
    selectedType = 'all',
    onTypeChange = () => {},
    sort = 'newest',
    onSortChange = () => {},
    onAdd = () => {},
    disabled = false,
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
                    aria-label="Tìm thú cưng theo tên hoặc giống"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700 placeholder-slate-400 transition"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <select
                    value={selectedType}
                    aria-label="Lọc theo loài"
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="text-xs sm:text-sm font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                >
                    <option value="all">Loài: Tất cả</option>
                    <option value="DOG">Loài: Chó</option>
                    <option value="CAT">Loài: Mèo</option>
                </select>

                <select
                    disabled
                    aria-label="Trạng thái"
                    className="text-xs sm:text-sm font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                >
                    <option>Đang hoạt động</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                    aria-label="Sắp xếp thú cưng"
                    className="text-xs sm:text-sm font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                >
                    <option value="newest">Sắp xếp: Mới nhất</option>
                    <option value="name">Sắp xếp: Tên A-Z</option>
                </select>

                <button type="button" onClick={onAdd} disabled={disabled} className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50">
                    <Plus size={14} />
                    <span>Thêm thú cưng</span>
                </button>
            </div>
        </div>
    );
};

export default MyPetsSearchFilter;
