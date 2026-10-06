import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const payments = [
  {
    code: '#PAY250220-0087',
    booking: '#BK250212-0087',
    method: 'Chuyển khoản',
    date: '20/02/2025',
    amount: '200.000đ',
  },
  {
    code: '#PAY250218-0064',
    booking: '#BK250210-0064',
    method: 'VNPay',
    date: '18/02/2025',
    amount: '150.000đ',
  },
  {
    code: '#PAY250210-0041',
    booking: '#BK250205-0041',
    method: 'MoMo',
    date: '10/02/2025',
    amount: '300.000đ',
  },
];

export default function RecentPaymentsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Thanh toán gần đây
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Các giao dịch gần nhất
          </p>
        </div>

        <CreditCard
          size={20}
          className="text-slate-400"
        />

      </div>

      <div className="divide-y divide-slate-100">

        {payments.map((payment) => (

          <div
            key={payment.code}
            className="p-5 hover:bg-slate-50"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="font-semibold text-slate-900">
                  {payment.code}
                </p>

                <p className="text-sm text-slate-700 mt-1">
                  {payment.booking}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {payment.method} · {payment.date}
                </p>

              </div>

              <div className="text-right">

                <p className="font-semibold text-slate-900">
                  {payment.amount}
                </p>

                <div className="flex items-center justify-end gap-1 mt-2 text-xs font-medium text-emerald-600">
                  <CheckCircle2 size={14} />
                  Thành công
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      <button
        className="w-full px-5 py-4 flex items-center justify-center gap-2
                   text-sm font-semibold text-slate-700
                   hover:bg-slate-50 border-t border-slate-100"
      >
        Xem tất cả
        <ArrowRight size={16} />
      </button>

    </div>
  );
}