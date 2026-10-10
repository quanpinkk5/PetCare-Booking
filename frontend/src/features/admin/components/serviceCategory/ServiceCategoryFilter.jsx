import { useState } from 'react';
import { Search, ChevronDown, Filter, RotateCcw, Plus } from 'lucide-react';

export default function ServiceCategoryFilter({ onFilter, onReset, onAddNew }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Trạng thái: Tất cả');

  const handleFilter = () => {
    if (onFilter) {
      onFilter({ searchQuery, statusFilter });
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('Trạng thái: Tất cả');
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFilter();
            }}
            placeholder="Tìm kiếm theo tên hoặc mã danh mục..."
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Status Select */}
        <div className="relative min-w-[160px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-3 pr-8 py-2.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-medium"
          >
            <option value="Trạng thái: Tất cả">Trạng thái: Tất cả</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Tạm ẩn">Tạm ẩn</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Nút Lọc */}
        <button
          type="button"
          onClick={handleFilter}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc</span>
        </button>

        {/* Nút Xóa bộ lọc */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa bộ lọc</span>
        </button>
      </div>

      {/* Nút Thêm danh mục mới */}
      <button
        type="button"
        onClick={onAddNew}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm danh mục mới</span>
      </button>
    </div>
  );
}
