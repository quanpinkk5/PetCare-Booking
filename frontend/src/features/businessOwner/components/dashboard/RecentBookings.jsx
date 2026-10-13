import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BOOKINGS } from "../../data/dashboardData";

export default function RecentBookings() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">
          Booking gần đây
        </h4>

        <button
          type="button"
          onClick={() => navigate("/business/bookings")}
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          Xem tất cả <ArrowRight size={12} />
        </button>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] text-slate-400">
              <th className="pb-2 font-medium">Thời gian</th>
              <th className="pb-2 font-medium">Thú cưng</th>
              <th className="pb-2 font-medium">Dịch vụ</th>
              <th className="pb-2 font-medium">Khách hàng</th>
              <th className="pb-2 text-right font-medium">Trạng thái</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {BOOKINGS.map((booking) => (
              <tr key={booking.id}>
                <td className="py-2.5 text-[11px] font-medium text-slate-600">
                  {booking.time}
                </td>

                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{booking.emoji}</span>
                    <div>
                      <p className="font-bold leading-tight text-slate-800">
                        {booking.pet}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {booking.petType}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-2.5 text-slate-600">
                  {booking.service}
                </td>

                <td className="py-2.5">
                  <p className="font-medium text-slate-800">
                    {booking.customer}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {booking.phone}
                  </p>
                </td>

                <td className="py-2.5 text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${booking.statusClass}`}
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