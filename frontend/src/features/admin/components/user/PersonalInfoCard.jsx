import {
  User,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

export default function PersonalInfoCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">
          Thông tin cá nhân
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Thông tin cơ bản của người dùng
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="text-sm text-slate-500">
            Họ và tên
          </label>

          <div className="flex items-center gap-3 mt-2">
            <User size={18} className="text-slate-400" />

            <span className="font-medium text-slate-900">
              Nguyễn Minh Anh
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500">
            Email
          </label>

          <div className="flex items-center gap-3 mt-2">
            <Mail size={18} className="text-slate-400" />

            <span className="font-medium text-slate-900">
              minhanh@gmail.com
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500">
            Số điện thoại
          </label>

          <div className="flex items-center gap-3 mt-2">
            <Phone size={18} className="text-slate-400" />

            <span className="font-medium text-slate-900">
              0987654321
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500">
            Ngày sinh
          </label>

          <div className="flex items-center gap-3 mt-2">
            <Calendar size={18} className="text-slate-400" />

            <span className="font-medium text-slate-900">
              15/08/1998
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500">
            Giới tính
          </label>

          <div className="mt-2 font-medium text-slate-900">
            Nữ
          </div>
        </div>

      </div>

    </div>
  );
}