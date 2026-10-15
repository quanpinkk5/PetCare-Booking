
import {
  CreditCard,
  ArrowRight,
} from 'lucide-react';

const payments = [
  {
    code: 'TXN250522-0011',
    service: 'Spa thư giãn',
    amount: '800.000 đ',
    method: 'VNPAY',
    time: '22/05/2025 14:40',
    status: 'Thành công',
  },
  {
    code: 'TXN250515-0008',
    service: 'Tắm & Sấy',
    amount: '450.000 đ',
    method: 'MoMo',
    time: '15/05/2025 16:30',
    status: 'Thành công',
  },
  {
    code: 'TXN250508-0006',
    service: 'Grooming cơ bản',
    amount: '650.000 đ',
    method: 'VNPAY',
    time: '08/05/2025 11:15',
    status: 'Thành công',
  },
];

export default function RecentPaymentsCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
            <CreditCard size={14} className="text-emerald-600" />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Thanh toán gần đây
          </h3>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Xem tất cả
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Mã giao dịch
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Dịch vụ
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Số tiền
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Phương thức
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Thời gian
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr
                key={payment.code}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-2 text-[10px] font-medium text-slate-600 whitespace-nowrap">
                  {payment.code}
                </td>

                <td className="px-3 py-2 text-[10px] text-slate-700 whitespace-nowrap">
                  {payment.service}
                </td>

                <td className="px-3 py-2 text-[10px] font-semibold text-slate-700 whitespace-nowrap">
                  {payment.amount}
                </td>

                <td className="px-3 py-2 text-[10px] text-slate-600 whitespace-nowrap">
                  {payment.method}
                </td>

                <td className="px-3 py-2 text-[10px] text-slate-500 whitespace-nowrap">
                  {payment.time}
                </td>

                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-semibold">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}