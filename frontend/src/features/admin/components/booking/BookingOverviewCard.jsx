import React from "react";
import { Calendar, Copy, Check } from "lucide-react";

const BOOKING_STATUS = {
  PENDING: {
    label: "CHỜ XÁC NHẬN",
    className: "bg-amber-50 text-amber-700",
  },
  CONFIRMED: {
    label: "ĐÃ XÁC NHẬN",
    className: "bg-emerald-50 text-emerald-700",
  },
  IN_PROGRESS: {
    label: "ĐANG THỰC HIỆN",
    className: "bg-blue-50 text-blue-600",
  },
  COMPLETED: {
    label: "HOÀN THÀNH",
    className: "bg-teal-50 text-teal-700",
  },
  CANCELLED: {
    label: "ĐÃ HỦY",
    className: "bg-rose-50 text-rose-600",
  },
};

const PAYMENT_STATUS = {
  UNPAID: {
    label: "CHƯA THANH TOÁN",
    className: "bg-rose-50 text-rose-600",
  },
  PAID: {
    label: "ĐÃ THANH TOÁN",
    className: "bg-emerald-50 text-emerald-600",
  },
};

export default function BookingOverviewCard({
  bookingCode,
  bookingStatus,
  paymentStatus,
  onCopy,
  copied,
}) {
  const status = BOOKING_STATUS[bookingStatus] || {
    label: "KHÔNG XÁC ĐỊNH",
    className: "bg-slate-100 text-slate-600",
  };

  const payment = PAYMENT_STATUS[paymentStatus] || {
    label: "KHÔNG XÁC ĐỊNH",
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-x-14 gap-y-5">
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
                {bookingCode || "—"}
              </span>

              <button
                type="button"
                onClick={onCopy}
                disabled={!bookingCode}
                title={copied ? "Đã sao chép" : "Sao chép"}
                className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
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

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Payment Status */}
        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1.5">
            Thanh toán
          </span>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${payment.className}`}
          >
            {payment.label}
          </span>
        </div>
      </div>
    </div>
  );
}
