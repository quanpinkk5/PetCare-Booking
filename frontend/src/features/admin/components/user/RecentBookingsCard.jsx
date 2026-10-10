
import {
  CalendarDays,
  ArrowRight,
} from 'lucide-react';

const bookings = [
  {
    code: 'BK250512-0123',
    service: 'Spa thư giãn',
    business: 'Happy Paws Spa',
    date: '22/05/2025',
    status: 'Hoàn thành',
  },
  {
    code: 'BK250515-0098',
    service: 'Tắm & Sấy',
    business: 'Pet Paradise',
    date: '15/05/2025',
    status: 'Hoàn thành',
  },
  {
    code: 'BK250508-0076',
    service: 'Grooming cơ bản',
    business: 'Meow Care Center',
    date: '08/05/2025',
    status: 'Đã hủy',
  },
  {
    code: 'BK250503-0032',
    service: 'Trông giữ qua đêm',
    business: 'Poodle House',
    date: '01/05/2025',
    status: 'Hoàn thành',
  },
];

export default function RecentBookingsCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
            <CalendarDays size={14} className="text-emerald-600" />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Booking gần đây
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
                Mã booking
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Dịch vụ
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Cơ sở
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Ngày đặt
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr
                key={booking.code}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-2 text-[10px] font-medium text-slate-600 whitespace-nowrap">
                  {booking.code}
                </td>

                <td className="px-3 py-2 text-[10px] text-slate-700 whitespace-nowrap">
                  {booking.service}
                </td>

                <td className="px-3 py-2 text-[10px] text-slate-600 whitespace-nowrap">
                  {booking.business}
                </td>

                <td className="px-3 py-2 text-[10px] text-slate-500 whitespace-nowrap">
                  {booking.date}
                </td>

                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 rounded-md text-[9px] font-semibold ${
                      booking.status === 'Đã hủy'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {booking.status}
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