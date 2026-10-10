import React from 'react';

export default function BookingInfoCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-800">
          Thông tin booking
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
        {/* Left */}
        <div className="space-y-3">
          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">
              Loại booking
            </span>

            <span className="text-slate-700 font-medium">
              Grooming (Chăm sóc lông)
            </span>
          </div>

          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">
              Ngày đặt
            </span>

            <span className="text-slate-700 font-medium">
              26/08/2025 09:15
            </span>
          </div>

          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">
              Thời gian hẹn
            </span>

            <span className="text-slate-700 font-medium">
              26/08/2025 10:00 - 12:00
            </span>
          </div>

          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">
              Chi nhánh
            </span>

            <span className="text-slate-700 font-medium">
              Happy Pet Cầu Giấy
            </span>
          </div>

          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">
              Dịch vụ
            </span>

            <span className="text-slate-700 font-medium">
              Grooming - Gói cơ bản
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Tổng tiền
            </span>

            <span className="text-emerald-600 font-bold">
              200.000đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Giảm giá
            </span>

            <span className="text-slate-700 font-medium">
              0đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Phí phát sinh
            </span>

            <span className="text-slate-700 font-medium">
              0đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">
              Thành tiền
            </span>

            <span className="text-emerald-600 font-bold">
              200.000đ
            </span>
          </div>
        </div>
      </div>

      {/* Customer Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-3">
        <span className="text-slate-400 text-sm w-32 shrink-0 mt-2">
          Ghi chú khách hàng
        </span>

        <div className="flex-1 bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-2.5 text-xs text-amber-900 leading-relaxed font-medium">
          Milo hơi nhát, vui lòng nhẹ nhàng khi xử lý.
        </div>
      </div>
    </div>
  );
}