import {
  ShieldCheck,
  UserRound,
  CircleCheck,
  Clock3,
  Monitor,
} from 'lucide-react';

export default function AccountStatusCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      {/* =========================================
          HEADER
      ========================================= */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">

        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
          <ShieldCheck
            size={15}
            className="text-emerald-600"
          />
        </div>

        <h3 className="text-sm font-bold text-slate-800">
          Trạng thái tài khoản
        </h3>

      </div>


      {/* =========================================
          CONTENT
      ========================================= */}
      <div className="px-5 py-4">

        <div className="grid grid-cols-2 gap-x-10 gap-y-4">

          {/* =====================================
              VAI TRÒ
          ===================================== */}
          <div>

            <p className="text-[10px] text-slate-400 mb-1.5">
              Vai trò
            </p>

            <div className="flex items-center gap-2">

              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                <UserRound
                  size={12}
                  className="text-blue-500"
                />
              </div>

              <span className="text-xs font-semibold text-slate-700">
                Khách hàng
              </span>

            </div>

          </div>


          {/* =====================================
              TRẠNG THÁI
          ===================================== */}
          <div>

            <p className="text-[10px] text-slate-400 mb-1.5">
              Trạng thái
            </p>

            <div className="flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-emerald-600">
                Hoạt động
              </span>

            </div>

          </div>


          {/* =====================================
              PHIÊN ĐĂNG NHẬP GẦN NHẤT
          ===================================== */}
          <div>

            <p className="text-[10px] text-slate-400 mb-1.5">
              Phiên đăng nhập gần nhất
            </p>

            <div className="flex items-center gap-2">

              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock3
                  size={12}
                  className="text-slate-500"
                />
              </div>

              <span className="text-xs font-semibold text-slate-700">
                22/05/2025 · 14:25
              </span>

            </div>

          </div>


          {/* =====================================
              SỐ PHIÊN HOẠT ĐỘNG
          ===================================== */}
          <div>

            <p className="text-[10px] text-slate-400 mb-1.5">
              Số phiên hoạt động
            </p>

            <div className="flex items-center gap-2">

              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                <Monitor
                  size={12}
                  className="text-purple-500"
                />
              </div>

              <span className="text-xs font-semibold text-slate-700">
                32 phiên
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}