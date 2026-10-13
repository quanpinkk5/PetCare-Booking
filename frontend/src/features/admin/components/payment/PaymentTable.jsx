
import {
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function PaymentTable({
  payments,
  totalPayments,
  selectedRowId,
  onSelectPayment,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Tiêu đề bảng & Số tổng thanh toán */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">
            Danh sách thanh toán
          </h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {totalPayments.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-3 py-3.5 pl-6">Mã thanh toán</th>
              <th className="px-3 py-3.5">Mã booking</th>
              <th className="px-3 py-3.5">Khách hàng</th>
              <th className="px-3 py-3.5">Cơ sở</th>
              <th className="px-3 py-3.5">Số tiền</th>
              <th className="px-3 py-3.5">Phương thức</th>
              <th className="px-3 py-3.5">Trạng thái</th>
              <th className="px-3 py-3.5">Ngày thanh toán</th>
              <th className="px-3 py-3.5 pr-6 text-center">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {payments.length > 0 ? (
              payments.map((item) => {
                const isSelected = item.id === selectedRowId;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectPayment(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/60'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-3.5 pl-6 font-semibold text-slate-800">
                      {item.id}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-500">
                      {item.bookingCode}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.customer.avatarColor}`}
                        >
                          {item.customer.avatarText}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {item.customer.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {item.customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-600">
                      {item.facility}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 font-semibold text-slate-800">
                      {item.amount}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] ${item.methodBadgeBg}`}
                      >
                        {item.methodDotColor && (
                          <span
                            className={`h-2 w-2 rounded-full ${item.methodDotColor}`}
                          />
                        )}
                        {item.method}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${item.statusBadgeBg}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-500">
                      {item.date}
                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.time}
                      </p>
                    </td>

                    <td className="px-3 py-3.5 pr-6 text-center">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        aria-label={`Xem thanh toán ${item.id}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectPayment(item);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-xs text-slate-400"
                >
                  Không tìm thấy dữ liệu thanh toán phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang giao diện */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 text-xs text-slate-500">
        <p>
          Hiển thị{' '}
          <span className="font-semibold text-slate-700">
            {payments.length > 0 ? `1 - ${payments.length}` : '0'}
          </span>{' '}
          trong tổng số{' '}
          <span className="font-semibold text-slate-700">
            {totalPayments.toLocaleString('vi-VN')}
          </span>{' '}
          kết quả
        </p>

        <div className="flex items-center gap-3">
          <select
            defaultValue="10"
            aria-label="Số dòng mỗi trang"
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-500"
          >
            <option value="10">10 / trang</option>
            <option value="20">20 / trang</option>
            <option value="50">50 / trang</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              aria-label="Trang trước"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-semibold text-white"
            >
              1
            </button>

            {[2, 3, 4, 5].map((page) => (
              <button
                type="button"
                key={page}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-50"
              >
                {page}
              </button>
            ))}

            <span className="px-1">...</span>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200"
            >
              590
            </button>

            <button
              type="button"
              aria-label="Trang tiếp theo"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
