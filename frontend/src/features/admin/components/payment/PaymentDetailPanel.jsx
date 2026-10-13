
import {
  CreditCard,
  X,
  Printer,
} from 'lucide-react';

export default function PaymentDetailPanel({ payment, isOpen, onClose }) {
  if (!isOpen || !payment) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Modal Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10 my-auto">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Chi tiết thanh toán
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Mã giao dịch: {payment.id}
            </p>
          </div>

          <button
            type="button"
            aria-label="Đóng chi tiết thanh toán"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mã thanh toán và trạng thái */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <CreditCard className="h-4 w-4" />
              </div>

              <span className="break-all text-sm font-bold text-slate-800">
                {payment.id}
              </span>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${payment.statusBadgeBg}`}
            >
              {payment.status}
            </span>
          </div>

          {/* Thông tin giao dịch */}
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Mã booking</span>
              <span className="text-right font-semibold text-emerald-600">
                {payment.bookingCode}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Khách hàng</span>

              <div className="flex items-start gap-2 text-right">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${payment.customer.avatarColor}`}
                >
                  {payment.customer.avatarText}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {payment.customer.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {payment.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Cơ sở</span>
              <span className="text-right font-semibold text-slate-800">
                {payment.facility}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-y border-slate-100 py-3.5">
              <span className="text-slate-400 font-medium">Số tiền thanh toán</span>
              <span className="text-xl font-bold text-emerald-600">
                {payment.amount}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">
                Phương thức
              </span>

              <span
                className={`rounded px-2 py-1 text-right font-semibold ${payment.methodBadgeBg}`}
              >
                {payment.method}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">
                Mã tham chiếu cổng
              </span>
              <span className="break-all text-right font-medium text-slate-700">
                {payment.transactionNo}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">
                Nhà cung cấp
              </span>
              <span className="text-right font-semibold text-slate-700">
                {payment.provider}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Phí giao dịch</span>
              <span className="font-semibold text-slate-700">
                {payment.fee}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Ngày thanh toán</span>
              <span className="text-right font-medium text-slate-700">
                {payment.date} - {payment.time}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Ghi chú</span>
              <span className="max-w-[65%] text-right text-slate-500">
                {payment.note}
              </span>
            </div>
          </div>

          {/* In hóa đơn & Đóng */}
          <div className="border-t border-slate-100 pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-colors"
            >
              <Printer className="h-4 w-4" />
              In hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
