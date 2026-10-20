import React from "react";
import { Link } from "react-router-dom";

import { Eye, ChevronLeft, ChevronRight, UserRound } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-50 text-amber-700 border-amber-200/50",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-sky-50 text-sky-700 border-sky-200/50",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-teal-50 text-teal-700 border-teal-200/50",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-rose-50 text-rose-600 border-rose-200/50",
  },
};

const PAYMENT_CONFIG = {
  PAID: {
    label: "Đã thanh toán",
    className: "bg-emerald-50 text-emerald-700",
  },
  UNPAID: {
    label: "Chưa thanh toán",
    className: "bg-rose-50 text-rose-600",
  },
};

function StatusBadge({ config, fallback }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border border-transparent ${
        config?.className || "bg-slate-100 text-slate-600"
      }`}
    >
      {config?.label || fallback || "Không xác định"}
    </span>
  );
}

export default function BookingTable({
  bookings = [],
  pagination = {},
  isLoading = false,
  hasError = false,
  onPageChange,
  onPageSizeChange,
}) {
  const page = pagination.page || 1;
  const limit = pagination.limit || 10;
  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 0;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  const end = total === 0 ? 0 : Math.min(page * limit, total);

  // Hiển thị tối đa 5 trang quanh trang hiện tại
  const firstVisiblePage = Math.max(
    1,
    Math.min(page - 2, Math.max(1, totalPages - 4)),
  );

  const visiblePages = Array.from(
    {
      length: Math.min(5, Math.max(0, totalPages - firstVisiblePage + 1)),
    },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Mã booking</th>

              <th className="py-3.5 px-4 font-semibold">Khách hàng</th>

              <th className="py-3.5 px-4 font-semibold">Cơ sở / Chi nhánh</th>

              <th className="py-3.5 px-4 font-semibold">Thanh toán</th>

              <th className="py-3.5 px-4 font-semibold">Trạng thái</th>

              <th className="py-3.5 px-4 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  Đang tải danh sách booking...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((item) => {
                const customer = item.customer;
                const branch = item.branch;

                const statusConfig = STATUS_CONFIG[item.status];

                const paymentConfig = PAYMENT_CONFIG[item.paymentStatus];

                const customerName = customer?.fullName || "Không có thông tin";

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* BOOKING CODE */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {item.bookingCode}
                    </td>

                    {/* CUSTOMER */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {customer?.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customerName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <UserRound className="w-4 h-4" />
                          </span>
                        )}

                        <div>
                          <p className="font-semibold text-slate-800 leading-tight">
                            {customerName}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {customer?.phone || "Chưa có SĐT"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* BRANCH */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">
                        {branch?.name || "Không có thông tin"}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {typeof branch?.address === "string"
                          ? branch.address || "Chưa có địa chỉ"
                          : "Chưa có địa chỉ"}
                      </p>
                    </td>

                    {/* PAYMENT */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge
                        config={paymentConfig}
                        fallback={item.paymentStatus}
                      />
                    </td>

                    {/* BOOKING STATUS */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge
                        config={statusConfig}
                        fallback={item.status}
                      />
                    </td>

                    {/* ACTION */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 text-slate-400">
                        <Link
                          to={`/admin/bookings/${item._id}`}
                          className="p-1 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors inline-flex items-center justify-center"
                          title="Xem chi tiết"
                          aria-label={`Xem booking ${item.bookingCode}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  {hasError
                    ? "Không thể tải danh sách booking."
                    : "Không tìm thấy booking phù hợp."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          Hiển thị{" "}
          <span className="font-semibold text-slate-700">
            {start} - {end}
          </span>{" "}
          trong tổng số{" "}
          <span className="font-semibold text-slate-700">
            {total.toLocaleString("vi-VN")}
          </span>{" "}
          booking
        </p>

        <div className="flex items-center gap-4">
          {/* PAGE SIZE */}
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(event) =>
                onPageSizeChange?.(Number(event.target.value))
              }
              disabled={isLoading}
              className="bg-white border border-slate-200 rounded-lg text-xs py-1.5 pl-2.5 pr-7 text-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              <option value={10}>10 / trang</option>

              <option value={20}>20 / trang</option>
            </select>
          </div>

          {/* PAGE NAVIGATION */}
          <div className="flex items-center gap-1 font-medium">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={isLoading || page <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {firstVisiblePage > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onPageChange?.(1)}
                  disabled={isLoading}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                >
                  1
                </button>

                {firstVisiblePage > 2 && (
                  <span className="px-1 text-slate-400">...</span>
                )}
              </>
            )}

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange?.(pageNumber)}
                disabled={isLoading || pageNumber === page}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`w-7 h-7 flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-default ${
                  pageNumber === page
                    ? "bg-emerald-600 text-white"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {visiblePages.length > 0 &&
              visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}

                  <button
                    type="button"
                    onClick={() => onPageChange?.(totalPages)}
                    disabled={isLoading}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                  >
                    {totalPages}
                  </button>
                </>
              )}

            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={isLoading || page >= totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
