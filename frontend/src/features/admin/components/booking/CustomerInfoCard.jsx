import React from 'react';
import {
  Mail,
  Phone,
} from 'lucide-react';

export default function CustomerInfoCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Thông tin khách hàng
        </h3>

        <button
          type="button"
          className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
        >
          Xem hồ sơ
        </button>
      </div>

      <div className="flex items-center gap-4">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW2q5fxMj47AsBAOcK0n5HI1h0JF3m3ECPrNxXXb1nhRfGlk9-dfB_CZJu49X5RmFVI9rAthrUZL1fOnl4TW0DUSlNgZEpHXf2Pappq9DZnGCPRMOSvbg9k4SXPT9uDQ4zI25OdqCd9kS_ltHRiYdNEw2Lv-KXYPjIcoegblg_zfgZobpG_C0vUbTik-_qQaoIjzIqji-Q7eLRc0jgypSw4Z7DCbRU4n7uFXSlUIw"
          alt="Khách hàng Nguyễn Minh Anh"
          className="w-14 h-14 rounded-full object-cover border border-slate-150 shadow-sm"
        />

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-slate-800">
              Nguyễn Minh Anh
            </span>

            <span className="bg-amber-50 text-amber-600 border border-amber-200/70 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Khách hàng thân thiết
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>minhanh98@gmail.com</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>0987 654 321</span>
          </div>
        </div>
      </div>
    </div>
  );
}