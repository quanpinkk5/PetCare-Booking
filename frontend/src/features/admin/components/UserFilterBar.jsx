import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  Download,
  Filter,
  RotateCcw,
} from 'lucide-react';

export default function UserFilterBar({ onFilter, onReset }) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');

  const handleFilter = () => {
    if (onFilter) {
      onFilter({
        search: search.trim(),
        role,
        status,
      });
    }
  };

  const handleReset = () => {
    setSearch('');
    setRole('all');
    setStatus('all');
    if (onReset) {
      onReset();
    }
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
              if (e.key === 'Enter') {
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
            <option value="Khách hàng">Khách hàng</option>
            <option value="Chủ cơ sở">Chủ cơ sở</option>
            <option value="Quản trị viên">Quản trị viên</option>
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
            <option value="Hoạt động">Hoạt động</option>
            <option value="Đã khóa">Đã khóa</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Time */}
        <button
          type="button"
          className="flex items-center gap-2 text-xs py-2 px-3.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-medium cursor-pointer"
        >
          <span>Thời gian: Tất cả</span>
          <Calendar className="w-4 h-4 text-slate-400" />
        </button>

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

      {/* Export */}
      <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all cursor-pointer">
        <Download className="w-4 h-4" />
        <span>Xuất dữ liệu</span>
      </button>
    </section>
  );
}