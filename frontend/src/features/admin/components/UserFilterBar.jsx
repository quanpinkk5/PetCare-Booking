import {
  Search,
  ChevronDown,
  Calendar,
  Download,
} from 'lucide-react';

export default function UserFilterBar() {
  return (
    <section className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">

      <div className="flex flex-wrap items-center gap-3 flex-1">

        {/* Search Filter */}
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <input
            type="text"
            className="w-full pr-10 pl-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
            placeholder="Tìm tên, email, số điện thoại..."
          />

          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Role */}
        <div className="relative min-w-[140px]">
          <select className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer">
            <option>Vai trò: Tất cả</option>
            <option>Khách hàng</option>
            <option>Chủ cơ sở</option>
            <option>Quản trị viên</option>
          </select>

          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative min-w-[150px]">
          <select className="w-full text-xs py-2 pl-3 pr-8 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-600 appearance-none font-medium cursor-pointer">
            <option>Trạng thái: Tất cả</option>
            <option>Hoạt động</option>
            <option>Đã khóa</option>
          </select>

          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Time */}
        <button className="flex items-center gap-2 text-xs py-2 px-3.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-medium">
          <span>Thời gian: Tất cả</span>

          <Calendar className="w-4 h-4 text-slate-400" />
        </button>

      </div>

      {/* Export */}
      <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all">
        <Download className="w-4 h-4" />

        <span>Xuất dữ liệu</span>
      </button>

    </section>
  );
}