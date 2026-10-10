import React from 'react';

export default function PaymentInfoCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-5">
        Thông tin thanh toán
      </h3>

      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
        {/* Left */}
        <div className="space-y-3">
          <div className="flex">
            <span className="text-slate-400 w-44 shrink-0">
              Phương thức thanh toán
            </span>

            <span className="text-slate-800 font-medium">
              Ví MoMo
            </span>
          </div>

          <div className="flex">
            <span className="text-slate-400 w-44 shrink-0">
              Mã giao dịch
            </span>

            <span className="text-slate-800 font-medium">
              MOMO-0826-9K3F7L
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Thời gian thanh toán
            </span>

            <span className="text-slate-800 font-medium">
              26/08/2025 09:22
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Trạng thái thanh toán
            </span>

            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
              ĐÃ THANH TOÁN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}