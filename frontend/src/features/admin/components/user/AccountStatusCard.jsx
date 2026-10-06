import {
  ShieldHalf,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function AccountStatusCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100">

        <h3 className="text-lg font-bold text-slate-900">
          Trạng thái tài khoản
        </h3>

      </div>

      <div className="p-6 space-y-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <ShieldHalf
              size={18}
              className="text-slate-400"
            />

            <span className="text-sm text-slate-500">
              Vai trò
            </span>

          </div>

          <span className="font-semibold text-slate-900">
            Customer
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={18}
              className="text-emerald-500"
            />

            <span className="text-sm text-slate-500">
              Trạng thái
            </span>

          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            Hoạt động
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Clock
              size={18}
              className="text-slate-400"
            />

            <span className="text-sm text-slate-500">
              Đăng nhập cuối
            </span>

          </div>

          <span className="font-medium text-slate-900">
            Hôm nay, 14:32
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-500">
            Số phiên đăng nhập
          </span>

          <span className="font-semibold text-slate-900">
            32
          </span>

        </div>

      </div>

    </div>
  );
}