import React from 'react';
import {
  Calendar,
  Copy,
  Check,
} from 'lucide-react';

export default function BookingOverviewCard({
  bookingCode,
  onCopy,
  copied,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-14">
        {/* Booking Code */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Mã booking
            </span>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-800">
                {bookingCode}
              </span>

              <button
                type="button"
                onClick={onCopy}
                title="Sao chép"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1.5">
            Trạng thái booking
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
            ĐANG THỰC HIỆN
          </span>
        </div>

        {/* Payment Status */}
        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1.5">
            Thanh toán
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
            ĐÃ THANH TOÁN
          </span>
        </div>
      </div>
    </div>
  );
}