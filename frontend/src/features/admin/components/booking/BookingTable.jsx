import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function BookingTable({ bookings }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4 font-semibold">
                Mã booking
              </th>

              <th className="py-3.5 px-4 font-semibold">
                Khách hàng
              </th>

              <th className="py-3.5 px-4 font-semibold">
                Cơ sở / Chi nhánh
              </th>

              <th className="py-3.5 px-4 font-semibold">
                Thanh toán
              </th>

              <th className="py-3.5 px-4 font-semibold">
                Trạng thái
              </th>

              <th className="py-3.5 px-4 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {bookings.length > 0 ? (
              bookings.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Booking Code */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {item.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.customer.avatar}
                        alt={item.customer.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />

                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">
                          {item.customer.name}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {item.customer.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Facility */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">
                      {item.facility.name}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {item.facility.address}
                    </p>
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.paymentStatus === 'Đã thanh toán' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        Đã thanh toán
                      </span>
                    )}

                    {item.paymentStatus === 'Chưa thanh toán' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600">
                        Chưa thanh toán
                      </span>
                    )}

                    {item.paymentStatus === 'Hoàn tiền' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        Hoàn tiền
                      </span>
                    )}
                  </td>

                  {/* Booking Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.bookingStatus === 'Chờ xác nhận' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                        Chờ xác nhận
                      </span>
                    )}

                    {item.bookingStatus === 'Đã xác nhận' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        Đã xác nhận
                      </span>
                    )}

                    {item.bookingStatus === 'Đang thực hiện' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/50">
                        Đang thực hiện
                      </span>
                    )}

                    {item.bookingStatus === 'Hoàn thành' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/50">
                        Hoàn thành
                      </span>
                    )}

                    {item.bookingStatus === 'Đã hủy' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-200/50">
                        Đã hủy
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <Link
                        to={`/admin/bookings/${item.id}`}
                        className="p-1 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors inline-flex items-center justify-center"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  Không tìm thấy booking phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          Hiển thị{' '}
          <span className="font-semibold text-slate-700">
            1 - {bookings.length}
          </span>{' '}
          trong tổng số{' '}
          <span className="font-semibold text-slate-700">
            3.892
          </span>{' '}
          booking
        </p>

        <div className="flex items-center gap-4">
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg text-xs py-1.5 pl-2.5 pr-7 text-slate-600 focus:outline-none focus:border-emerald-500">
              <option>10 / trang</option>
              <option>20 / trang</option>
              <option>50 / trang</option>
            </select>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-1 font-medium">
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-semibold"
            >
              1
            </button>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              2
            </button>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              3
            </button>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              4
            </button>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              5
            </button>

            <span className="px-1 text-slate-400">...</span>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              390
            </button>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}