import React from "react";

const PAYMENT_METHOD_LABELS = {
  CASH: "Tiền mặt",
  VNPAY: "VNPay",
  MOMO: "Ví MoMo",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};

const PAYMENT_STATUS_LABELS = {
  UNPAID: {
    label: "CHƯA THANH TOÁN",
    className: "bg-rose-50 text-rose-600",
  },
  PAID: {
    label: "ĐÃ THANH TOÁN",
    className: "bg-emerald-50 text-emerald-600",
  },
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

export default function PaymentInfoCard({ booking }) {
  if (!booking) return null;

  const payment = booking.payment;

  const paymentStatus = PAYMENT_STATUS_LABELS[booking.paymentStatus] || {
    label: "KHÔNG XÁC ĐỊNH",
    className: "bg-slate-100 text-slate-600",
  };

  const paymentMethod = payment
    ? PAYMENT_METHOD_LABELS[payment.method] || payment.method || "—"
    : "—";

  const transactionCode = payment
    ? payment.transactionId || payment.paymentCode || "—"
    : "—";

  const paymentTime =
    booking.paymentStatus === "PAID" ? formatDateTime(payment?.paidAt) : "—";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-5">
        Thông tin thanh toán
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
        {/* LEFT COLUMN */}
        <div className="space-y-3">
          <div className="flex">
            <span className="text-slate-400 w-44 shrink-0">
              Phương thức thanh toán
            </span>

            <span className="text-slate-800 font-medium break-words">
              {paymentMethod}
            </span>
          </div>

          <div className="flex">
            <span className="text-slate-400 w-44 shrink-0">Mã giao dịch</span>

            <span className="text-slate-800 font-medium break-all">
              {transactionCode}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-3">
            <span className="text-slate-400">Thời gian thanh toán</span>

            <span className="text-slate-800 font-medium text-right">
              {paymentTime}
            </span>
          </div>

          <div className="flex justify-between items-center gap-3">
            <span className="text-slate-400">Trạng thái thanh toán</span>

            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${paymentStatus.className}`}
            >
              {paymentStatus.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
