import { useState } from 'react';
import {
    Plus,
    Search,
    RotateCcw,
} from 'lucide-react';

export default function BranchServiceFilterBar({
    onAddService,
    onFilterChange,
    branches = [],
    categories = [],
    disabled = false,
}) {
    const [branch, setBranch] = useState('all');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [keyword, setKeyword] = useState('');

    const updateFilters = (next) => {
        onFilterChange?.({
            branch: next.branch ?? branch,
            category: next.category ?? category,
            status: next.status ?? status,
            keyword: next.keyword ?? keyword,
        });
    };

    const resetFilters = () => {
        setBranch('all');
        setCategory('all');
        setStatus('all');
        setKeyword('');

        onFilterChange?.({
            branch: 'all',
            category: 'all',
            status: 'all',
            keyword: '',
        });
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Khu vực tìm kiếm và bộ lọc */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                    {/* Tìm kiếm */}
                    <div className="relative w-full sm:w-60">
                        <Search
                            size={14}
                            className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={keyword}
                            aria-label="Tìm kiếm dịch vụ chi nhánh"
                            onChange={(e) => {
                                const value = e.target.value;
                                setKeyword(value);
                                updateFilters({ keyword: value });
                            }}
                            placeholder="Tìm kiếm dịch vụ..."
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                    </div>

                    {/* Lọc theo Chi nhánh */}
                    <div className="w-full sm:w-auto">
                        <select
                            value={branch}
                            aria-label="Lọc chi nhánh"
                            onChange={(e) => {
                                const value = e.target.value;
                                setBranch(value);
                                updateFilters({ branch: value });
                            }}
                            className="w-full sm:w-44 text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer transition-colors"
                        >
                            <option value="all">Tất cả chi nhánh</option>
                            {branches.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                        </select>
                    </div>

                    {/* Lọc theo Danh mục */}
                    <div className="w-full sm:w-auto">
                        <select
                            value={category}
                            aria-label="Lọc danh mục"
                            onChange={(e) => {
                                const value = e.target.value;
                                setCategory(value);
                                updateFilters({ category: value });
                            }}
                            className="w-full sm:w-40 text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer transition-colors"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                        </select>
                    </div>

                    {/* Lọc theo Trạng thái */}
                    <div className="w-full sm:w-auto">
                        <select
                            value={status}
                            aria-label="Lọc trạng thái"
                            onChange={(e) => {
                                const value = e.target.value;
                                setStatus(value);
                                updateFilters({ status: value });
                            }}
                            className="w-full sm:w-36 text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer transition-colors"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="INACTIVE">Tạm dừng</option>
                        </select>
                    </div>

                    {/* Nút Đặt lại bộ lọc */}
                    {(branch !== 'all' ||
                        category !== 'all' ||
                        status !== 'all' ||
                        keyword !== '') && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            title="Đặt lại bộ lọc"
                            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                            <RotateCcw size={13} />
                            <span>Đặt lại</span>
                        </button>
                    )}
                </div>

                {/* Nút Thêm dịch vụ */}
                <button
                    type="button"
                    onClick={onAddService}
                    disabled={disabled}
                    className="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap ml-auto disabled:opacity-50"
                >
                    <Plus size={15} />
                    <span>Thêm dịch vụ vào chi nhánh</span>
                </button>
            </div>
        </div>
    );
}
