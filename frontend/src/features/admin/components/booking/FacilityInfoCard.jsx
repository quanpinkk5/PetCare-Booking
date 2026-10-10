import React from 'react';
import {
  PawPrint,
} from 'lucide-react';

export default function FacilityInfoCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Thông tin cơ sở
        </h3>

        <button
          type="button"
          className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
        >
          Xem chi tiết
        </button>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
            <PawPrint className="w-3.5 h-3.5 fill-current" />
          </div>

          <h4 className="text-sm font-bold text-slate-800">
            Happy Pet Cầu Giấy
          </h4>
        </div>

        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">
            Chi nhánh
          </span>

          <span className="text-slate-700 font-medium">
            Cầu Giấy
          </span>
        </div>

        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">
            Địa chỉ
          </span>

          <span className="text-slate-700 font-medium">
            Số 123 Trần Duy Hưng, Cầu Giấy, Hà Nội
          </span>
        </div>

        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">
            Điện thoại
          </span>

          <span className="text-slate-700 font-medium">
            024 1234 5678
          </span>
        </div>
      </div>
    </div>
  );
}