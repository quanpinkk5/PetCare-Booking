import {
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

const bookings = [
  {
    code: '#BK250212-0087',
    service: 'Premium Grooming',
    business: 'Pet Paradise Spa',
    date: '20/02/2025',
    status: 'Hoạt động',
    price: '200.000đ',
  },
  {
    code: '#BK250210-0064',
    service: 'Bathing',
    business: 'Happy Paws Hotel',
    date: '18/02/2025',
    status: 'Hoạt động',
    price: '150.000đ',
  },
  {
    code: '#BK250205-0041',
    service: 'Spa',
    business: 'Pet Paradise Spa',
    date: '10/02/2025',
    status: 'Hoạt động',
    price: '300.000đ',
  },
  {
    code: '#BK250201-0018',
    service: 'Nail Care',
    business: 'Happy Paws Hotel',
    date: '05/02/2025',
    status: 'Đã hủy',
    price: '100.000đ',
  },
];

export default function RecentBookingsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Booking gần đây
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Các lịch đặt gần nhất
          </p>
        </div>

        <CalendarCheck
          size={20}
          className="text-slate-400"
        />

      </div>

      <div className="divide-y divide-slate-100">

        {bookings.map((booking) => (

          <div
            key={booking.code}
            className="p-5 hover:bg-slate-50"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="font-semibold text-slate-900">
                  {booking.code}
                </p>

                <p className="text-sm text-slate-700 mt-1">
                  {booking.service}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {booking.business} · {booking.date}
                </p>

              </div>

              <div className="text-right">

                <p className="font-semibold text-slate-900">
                  {booking.price}
                </p>

                <span
                  className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Đã hủy'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {booking.status}
                </span>

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