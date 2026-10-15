import {
  Edit3,
  Send,
  Lock,
  CalendarDays,
} from 'lucide-react';

export default function UserProfileBanner() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        {/* LEFT - USER */}
        <div className="flex items-center gap-4">

          {/* Avatar */}
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
            alt="Nguyễn Minh Anh"
            className="w-14 h-14 rounded-full object-cover"
          />


          {/* User information */}
          <div>

            <h1 className="text-base font-bold text-slate-900">
              Nguyễn Minh Anh
            </h1>

            <p className="text-[11px] text-slate-400 mt-0.5">
              @minhanh_98
            </p>

            <div className="flex items-center gap-2 mt-1.5">

              <span className="px-2 py-0.5 rounded-full
                             bg-blue-50 text-blue-600
                             text-[10px] font-semibold">
                Khách hàng
              </span>

              <span className="px-2 py-0.5 rounded-full
                             bg-emerald-50 text-emerald-600
                             text-[10px] font-semibold">
                ● Hoạt động
              </span>

            </div>

          </div>

        </div>


        {/* CENTER - JOIN DATE */}
        <div className="flex items-center gap-2 xl:mr-auto xl:ml-16">

          <CalendarDays
            size={16}
            className="text-slate-500"
          />

          <div>

            <p className="text-[10px] text-slate-500">
              Ngày tham gia:
            </p>

            <p className="text-[11px] font-semibold text-slate-700">
              12/02/2025
            </p>

          </div>

        </div>


        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-2">

          <button
            className="h-9 px-4 rounded-lg border border-emerald-300
                       text-emerald-600 bg-white
                       text-xs font-semibold
                       flex items-center gap-2
                       hover:bg-emerald-50"
          >
            <Edit3 size={14} />
            Chỉnh sửa
          </button>

          <button
            className="h-9 px-4 rounded-lg border border-slate-300
                       text-slate-600 bg-white
                       text-xs font-semibold
                       flex items-center gap-2
                       hover:bg-slate-50"
          >
            <Send size={14} />
            Gửi thông báo
          </button>

          <button
            className="h-9 px-4 rounded-lg border border-red-300
                       text-red-500 bg-white
                       text-xs font-semibold
                       flex items-center gap-2
                       hover:bg-red-50"
          >
            <Lock size={14} />
            Khóa tài khoản
          </button>

        </div>

      </div>

    </div>
  );
}