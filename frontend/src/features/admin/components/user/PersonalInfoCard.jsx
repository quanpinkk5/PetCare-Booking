import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  VenusAndMars,
} from 'lucide-react';

export default function PersonalInfoCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">

        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
          <UserRound
            size={14}
            className="text-emerald-600"
          />
        </div>
        <div>
        <h3 className="text-sm font-bold text-slate-800">
          Thông tin cá nhân
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Thông tin cơ bản của người dùng
        </p>
        </div>
      </div>


      {/* Content */}
      <div className="px-4 py-3 space-y-2.5">

        {/* Họ tên */}
        <div className="grid grid-cols-[42%_58%] items-center">

          <span className="text-[10px] text-slate-500">
            Họ tên
          </span>

          <div className="flex items-center gap-1.5">

            <UserRound
              size={12}
              className="text-slate-400"
            />

            <span className="text-[10px] font-semibold text-slate-700">
              Nguyễn Minh Anh
            </span>

          </div>

        </div>


        {/* Email */}
        <div className="grid grid-cols-[42%_58%] items-center">

          <span className="text-[10px] text-slate-500">
            Email
          </span>

          <div className="flex items-center gap-1.5">

            <Mail
              size={12}
              className="text-slate-400"
            />

            <span className="text-[10px] font-semibold text-slate-700">
              minhanh98@gmail.com
            </span>

          </div>

        </div>


        {/* Số điện thoại */}
        <div className="grid grid-cols-[42%_58%] items-center">

          <span className="text-[10px] text-slate-500">
            Số điện thoại
          </span>

          <div className="flex items-center gap-1.5">

            <Phone
              size={12}
              className="text-slate-400"
            />

            <span className="text-[10px] font-semibold text-slate-700">
              0987 654 321
            </span>

          </div>

        </div>


        {/* Ngày sinh */}
        <div className="grid grid-cols-[42%_58%] items-center">

          <span className="text-[10px] text-slate-500">
            Ngày sinh
          </span>

          <div className="flex items-center gap-1.5">

            <CalendarDays
              size={12}
              className="text-slate-400"
            />

            <span className="text-[10px] font-semibold text-slate-700">
              15/04/1998
            </span>

          </div>

        </div>


        {/* Giới tính */}
        <div className="grid grid-cols-[42%_58%] items-center">

          <span className="text-[10px] text-slate-500">
            Giới tính
          </span>

          <div className="flex items-center gap-1.5">

            <VenusAndMars
              size={12}
              className="text-slate-400"
            />

            <span className="text-[10px] font-semibold text-slate-700">
              Nữ
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}