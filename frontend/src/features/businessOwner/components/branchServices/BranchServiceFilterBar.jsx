import { useState } from 'react';
import {
    Plus,
    Search,
    RotateCcw,
} from 'lucide-react';

export default function BranchServiceFilterBar({
    onAddService,
    onFilterChange,
}) {
    const [branch, setBranch] = useState('Tất cả chi nhánh');
    const [category, setCategory] = useState('Tất cả danh mục');
    const [status, setStatus] = useState('Tất cả trạng thái');
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
        setBranch('Tất cả chi nhánh');
        setCategory('Tất cả danh mục');
        setStatus('Tất cả trạng thái');
        setKeyword('');

        onFilterChange?.({
            branch: 'Tất cả chi nhánh',
            category: 'Tất cả danh mục',
            status: 'Tất cả trạng thái',
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
                            onChange={(e) => {
                                const value = e.target.value;
                                setBranch(value);
                                updateFilters({ branch: value });
                            }}
                            className="w-full sm:w-44 text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer transition-colors"
                        >
                            <option>Tất cả chi nhánh</option>
                            <option>Happy Pet - Cầu Giấy</option>
                            <option>Happy Pet - Hà Đông</option>
                            <option>Happy Pet - Thanh Xuân</option>
                            <option>Happy Pet - Nam Từ Liêm</option>
                        </select>
                    </div>

                    {/* Lọc theo Danh mục */}
                    <div className="w-full sm:w-auto">
                        <select
                            value={category}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCategory(value);
                                updateFilters({ category: value });
                            }}
                            className="w-full sm:w-40 text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer transition-colors"
                        >
                            <option>Tất cả danh mục</option>
                            <option>Cắt tỉa lông</option>
                            <option>Tắm & Vệ sinh</option>
                            <option>Lưu trú</option>
                            <option>Dắt dạo</option>
                            <option>Spa thư giãn</option>
                        </select>
                    </div>

                    {/* Lọc theo Trạng thái */}
                    <div className="w-full sm:w-auto">
                        <select
                            value={status}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStatus(value);
                                updateFilters({ status: value });
                            }}
                            className="w-full sm:w-36 text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer transition-colors"
                        >
                            <option>Tất cả trạng thái</option>
                            <option>Đang hoạt động</option>
                            <option>Tạm dừng</option>
                        </select>
                    </div>

                    {/* Nút Đặt lại bộ lọc */}
                    {(branch !== 'Tất cả chi nhánh' ||
                        category !== 'Tất cả danh mục' ||
                        status !== 'Tất cả trạng thái' ||
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
                    className="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap ml-auto"
                >
                    <Plus size={15} />
                    <span>Thêm dịch vụ vào chi nhánh</span>
                </button>
            </div>
        </div>
    );
}