import {
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';

export default function AdminHeader({ title = 'Tổng quan hệ thống' }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        {/* Tổng quan hệ thống */}
        {title}
      </h2>

      {/* Search Bar */}
      <div className="w-full max-w-md mx-8 relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>

        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder-slate-400"
          placeholder="Tìm kiếm người dùng, cơ sở, booking..."
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <div className="relative cursor-pointer p-2 text-slate-500 hover:text-slate-700">
          <Bell className="w-6 h-6" />

          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
            8
          </span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer pl-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCadlxVLl8uJIza0oqA9OSo66mP94zD-x-RzZpLlEkmfwkBW6V3TeUkyzStxvTLpGaxA-1pHq9eRyIuL6HB22PJ1e8j-WiN5VT0I2NLJuIKl-yHwOD307nSHps0hDTtkkcky4yX-1oh47zsHG6EH0wl_sZvPaft7w-r1UeqrNQfSq_QkFfU6596cy6OxvObTqxaE7w951vUIRg2Z-7oIykQxcT2HcTBkPpxjyEkiAhRsx0OJZ0ifLyb"
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />

          <div className="text-left leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">
              Admin
            </div>

            <div className="text-xs text-slate-400">
              Quản trị viên
            </div>
          </div>

          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}