import { useState } from "react";
import { Eye, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingTable({
  bookings = [],
  onViewBooking,
  onApproveBooking,
  onRejectBooking,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(bookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Header của bảng */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            Danh sách đặt lịch hẹn
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Tìm thấy <span className="font-semibold text-emerald-600">{bookings.length}</span> lịch hẹn phù hợp
          </p>
        </div>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Mã đặt lịch</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Thú cưng</th>
              <th className="py-3 px-4">Dịch vụ</th>
              <th className="py-3 px-4">Chi nhánh</th>
              <th className="py-3 px-4">Thời gian hẹn</th>
              <th className="py-3 px-4">Thanh toán</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {currentBookings.map((bk) => {
              const ServiceIcon = bk.serviceIcon;

              return (
                <tr
                  key={bk.id}
                  className={`hover:bg-slate-50/70 transition-colors ${bk.bgHighlight || ""}`}
                >
                  {/* Mã booking */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onViewBooking?.(bk)}
                      className="font-bold text-slate-800 hover:text-emerald-600 transition text-left cursor-pointer"
                    >
                      {bk.id}
                    </button>
                    <div className="text-[10px] text-slate-400 mt-0.5">{bk.time}</div>
                  </td>

                  {/* Khách hàng */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        alt={bk.customer}
                        src={bk.customerImg}
                        className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{bk.customer}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{bk.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Thú cưng */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        alt={bk.pet}
                        src={bk.petImg}
                        className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{bk.pet}</div>
                        <div className="text-[10px] text-slate-400">{bk.breed}</div>
                      </div>
                    </div>
                  </td>

                  {/* Dịch vụ */}
                  <td className="py-3.5 px-4">
                    <div className={`inline-flex items-center gap-1.5 font-medium ${bk.serviceColor}`}>
                      {ServiceIcon && <ServiceIcon size={14} className="shrink-0" />}
                      <span>{bk.service}</span>
                    </div>
                  </td>

                  {/* Chi nhánh */}
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="font-medium">{bk.branch}</div>
                    <div className="text-[10px] text-slate-400">{bk.branchSub}</div>
                  </td>

                  {/* Thời gian */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{bk.timeStr}</div>
                    <div className="text-[10px] text-slate-400">
                      {bk.date} {bk.dateSub && <span className="text-emerald-600 font-semibold">({bk.dateSub})</span>}
                    </div>
                  </td>

                  {/* Thanh toán */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${bk.paymentClass}`}
                    >
                      {bk.payment}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${bk.statusClass}`}
                    >
                      {bk.status}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-center">
                    {bk.isPendingAction ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onApproveBooking?.(bk.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition cursor-pointer"
                          title="Duyệt lịch hẹn"
                        >
                          <Check size={12} />
                          <span>Duyệt</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectBooking?.(bk.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-[11px] transition cursor-pointer"
                          title="Từ chối lịch hẹn"
                        >
                          <X size={12} />
                          <span>Từ chối</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewBooking?.(bk)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => onViewBooking?.(bk)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition text-xs font-medium cursor-pointer"
                        >
                          <Eye size={14} />
                          <span>Chi tiết</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {bookings.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                    <Eye size={20} />
                  </div>
                  <p className="font-medium text-slate-600 text-sm">Không tìm thấy lịch hẹn phù hợp</p>
                  <p className="text-xs text-slate-400 mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-slate-50/50 text-xs text-slate-500">
          <div>
            Hiển thị <span className="font-semibold text-slate-700">{startIndex + 1}</span> -{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + itemsPerPage, bookings.length)}
            </span>{" "}
            trên tổng số <span className="font-semibold text-slate-700">{bookings.length}</span> lịch hẹn
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
