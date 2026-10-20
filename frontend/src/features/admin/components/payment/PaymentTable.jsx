import { Eye, ChevronLeft, ChevronRight, UserRound } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "CHỜ THANH TOÁN",
    className: "bg-slate-100 text-slate-700",
  },
  PROCESSING: {
    label: "ĐANG XỬ LÝ",
    className: "bg-amber-100 text-amber-700",
  },
  PAID: {
    label: "ĐÃ THANH TOÁN",
    className: "bg-emerald-100 text-emerald-700",
  },
  FAILED: {
    label: "THẤT BẠI",
    className: "bg-rose-100 text-rose-700",
  },
};

const METHOD_CONFIG = {
  MOMO: {
    label: "MoMo",
    className: "bg-pink-50 text-pink-600",
    dotColor: "bg-pink-500",
  },
  VNPAY: {
    label: "VNPAY",
    className: "bg-blue-50 text-blue-600",
    dotColor: "bg-blue-500",
  },
  BANK_TRANSFER: {
    label: "Chuyển khoản",
    className: "bg-slate-100 text-slate-700",
    dotColor: "",
  },
  CASH: {
    label: "CASH",
    className: "bg-emerald-50 text-emerald-600 font-bold",
    dotColor: "",
  },
};

const formatMoney = (value) =>
  `${Number(value ?? 0).toLocaleString("vi-VN")} đ`;

const formatDateParts = (value) => {
  if (!value) return { date: "—", time: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: date.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    time: date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    }),
  };
};

export default function PaymentTable({
  payments = [],
  totalPayments = 0,
  pagination = {
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading = false,
  selectedRowId,
  onSelectPayment,
  onPageChange,
  onPageSizeChange,
}) {
  const currentPage = pagination.page || 1;
  const pageSize = pagination.limit || 10;
  const totalPages = pagination.totalPages || 0;

  const startIndex = totalPayments > 0 ? (currentPage - 1) * pageSize + 1 : 0;

  const endIndex =
    totalPayments > 0 ? Math.min(currentPage * pageSize, totalPayments) : 0;

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

    return Array.from({ length: 5 }, (_, index) => start + index);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* TIÊU ĐỀ */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">
            Danh sách thanh toán
          </h3>

          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {Number(totalPayments).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      {/* BẢNG */}
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
              <th className="px-3 py-3.5 pr-6 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-xs text-slate-400"
                >
                  Đang tải danh sách thanh toán...
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((item) => {
                const isSelected = item._id === selectedRowId;

                const status = STATUS_CONFIG[item.status] || {
                  label: item.status || "—",
                  className: "bg-slate-100 text-slate-600",
                };

                const method = METHOD_CONFIG[item.method] || {
                  label: item.method || "—",
                  className: "bg-slate-100 text-slate-600",
                  dotColor: "",
                };

                const customerName =
                  item.customer?.fullName || "Không có thông tin";

                // Cột ngày thanh toán chỉ hiển thị
                // khi giao dịch thực sự đã PAID.
                const paymentDate =
                  item.status === "PAID"
                    ? formatDateParts(item.paidAt)
                    : { date: "—", time: "" };

                return (
                  <tr
                    key={item._id}
                    onClick={() => onSelectPayment?.(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-emerald-50/60" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-3.5 pl-6 font-semibold text-slate-800">
                      {item.paymentCode}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-500">
                      {item.booking?.bookingCode || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        {item.customer?.avatar ? (
                          <img
                            src={item.customer.avatar}
                            alt={customerName}
                            className="h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <UserRound className="h-3.5 w-3.5" />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-800">
                            {customerName}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {item.customer?.phone || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-600">
                      {item.business?.name || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 font-semibold text-slate-800">
                      {formatMoney(item.amount)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] ${method.className}`}
                      >
                        {method.dotColor && (
                          <span
                            className={`h-2 w-2 rounded-full ${method.dotColor}`}
                          />
                        )}

                        {method.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-500">
                      {paymentDate.date}

                      {paymentDate.time && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          {paymentDate.time}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3.5 pr-6 text-center">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        aria-label={`Xem thanh toán ${item.paymentCode}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectPayment?.(item);
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

      {/* PHÂN TRANG */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 text-xs text-slate-500">
        <p>
          Hiển thị{" "}
          <span className="font-semibold text-slate-700">
            {startIndex} - {endIndex}
          </span>{" "}
          trong tổng số{" "}
          <span className="font-semibold text-slate-700">
            {Number(totalPayments).toLocaleString("vi-VN")}
          </span>{" "}
          kết quả
        </p>

        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(event.target.value)}
            disabled={isLoading}
            aria-label="Số dòng mỗi trang"
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-500 disabled:opacity-50"
          >
            <option value="10">10 / trang</option>
            <option value="20">20 / trang</option>
            <option value="50">50 / trang</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isLoading || currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              aria-label="Trang trước"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getVisiblePages().map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                disabled={isLoading}
                onClick={() => onPageChange?.(pageNumber)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                  currentPage === pageNumber
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={
                isLoading || totalPages === 0 || currentPage >= totalPages
              }
              onClick={() => onPageChange?.(currentPage + 1)}
              aria-label="Trang tiếp theo"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
