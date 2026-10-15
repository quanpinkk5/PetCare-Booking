// src/features/admin/components/BusinessTable.jsx

import { Link } from 'react-router-dom';
import {
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export default function BusinessTable({
  data = [],
  onApprove,
  onReject,
  onUnblock,
  totalCount,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã duyệt':
        return 'bg-emerald-50 text-emerald-600';

      case 'Chờ duyệt':
        return 'bg-amber-50 text-amber-600';

      case 'Tạm khóa':
      case 'Từ chối':
        return 'bg-rose-50 text-rose-500';

      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">

              <th className="py-3.5 px-5">
                Cơ sở
              </th>

              <th className="py-3.5 px-4">
                Chủ sở hữu
              </th>

              <th className="py-3.5 px-4 text-center">
                Số chi nhánh
              </th>

              <th className="py-3.5 px-4">
                Khu vực
              </th>

              <th className="py-3.5 px-4">
                Trạng thái
              </th>

              <th className="py-3.5 px-4">
                Đánh giá
              </th>

              <th className="py-3.5 px-4">
                Ngày đăng ký
              </th>

              <th className="py-3.5 px-5 text-right">
                Thao tác
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">

            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition"
                >

                  {/* Cơ sở */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border font-bold ${item.iconBg}`}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <Link
                          to={`/admin/facilities/${item.id}`}
                          className="font-semibold text-slate-800 text-sm hover:text-emerald-600 transition-colors"
                        >
                          {item.name}
                        </Link>

                        <div className="text-[11px] text-slate-400">
                          {item.email}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {item.phone}
                        </div>
                      </div>

                    </div>
                  </td>


                  {/* Chủ sở hữu */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">

                      <img
                        src={item.ownerAvatar}
                        alt={item.owner}
                        className="w-7 h-7 rounded-full object-cover"
                      />

                      <span className="font-medium text-slate-700">
                        {item.owner}
                      </span>

                    </div>
                  </td>


                  {/* Số chi nhánh */}
                  <td className="py-4 px-4 text-center font-medium text-slate-700">
                    {item.branches}
                  </td>


                  {/* Khu vực */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-slate-600">

                      <MapPin className="w-3.5 h-3.5 text-slate-400" />

                      <span>
                        {item.location}
                      </span>

                    </div>
                  </td>


                  {/* Trạng thái */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>


                  {/* Đánh giá */}
                  <td className="py-4 px-4">

                    <div className="flex items-center gap-1 font-semibold text-slate-700">

                      <span>
                        {item.rating}
                      </span>

                      <span className="text-amber-400 text-sm">
                        {item.stars}
                      </span>

                    </div>

                    <div className="text-[11px] text-slate-400">
                      ({item.ratingCount} đánh giá)
                    </div>

                  </td>


                  {/* Ngày đăng ký */}
                  <td className="py-4 px-4">

                    <div className="text-slate-700 font-medium">
                      {item.registerDate}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {item.registerTime}
                    </div>

                  </td>


                  {/* Thao tác */}
                  <td className="py-4 px-5 text-right">

                    <div className="flex items-center justify-end gap-2">

                      {item.actionType === 'approval' ? (
                        <>
                          <Link
                            to={`/admin/facilities/${item.id}`}
                            className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-lg text-xs font-medium transition cursor-pointer inline-flex items-center"
                          >
                            Xem chi tiết
                          </Link>

                          <button
                            onClick={() => onApprove && onApprove(item.id)}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                          >
                            Duyệt
                          </button>

                          <button
                            onClick={() => onReject && onReject(item.id)}
                            className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium transition cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </>
                      ) : item.actionType === 'unblock' ? (
                        <>
                          <Link
                            to={`/admin/facilities/${item.id}`}
                            className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-lg text-xs font-medium transition cursor-pointer inline-flex items-center"
                          >
                            Xem chi tiết
                          </Link>

                          <button
                            onClick={() => onUnblock && onUnblock(item.id)}
                            className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition cursor-pointer"
                          >
                            Mở khóa
                          </button>
                        </>
                      ) : (
                        <Link
                          to={`/admin/facilities/${item.id}`}
                          className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-medium transition cursor-pointer inline-flex items-center"
                        >
                          Xem chi tiết
                        </Link>
                      )}

                      <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-slate-400 text-sm"
                >
                  Không tìm thấy cơ sở nào phù hợp.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">

        <div className="text-slate-500">
          Hiển thị{' '}
          <span className="font-semibold text-slate-800">
            {data.length > 0 ? `1 - ${data.length}` : '0'}
          </span>{' '}
          trong tổng số{' '}
          <span className="font-semibold text-slate-800">
            {totalCount || data.length}
          </span>{' '}
          cơ sở
        </div>


        <div className="flex items-center gap-3">

          <div className="relative">

            <select className="text-xs bg-white border border-slate-200 rounded-lg py-1.5 pl-3 pr-7 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none">
              <option>10 / trang</option>
              <option>20 / trang</option>
              <option>50 / trang</option>
            </select>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />

          </div>


          <div className="flex items-center gap-1">

            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-semibold flex items-center justify-center">
              1
            </button>

            <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition">
              2
            </button>

            <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition">
              3
            </button>

            <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition">
              4
            </button>

            <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition">
              5
            </button>

            <span className="px-1 text-slate-400">
              ...
            </span>

            <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition">
              125
            </button>

            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

    </section>
  );
}