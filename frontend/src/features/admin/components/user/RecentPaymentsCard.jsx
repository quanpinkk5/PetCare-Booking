
import { useEffect, useState } from "react";
import {
  CreditCard,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { adminUserApi } from "../../services/adminUserApi";

const PAGE_SIZE = 5;

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ thanh toán",
    className: "bg-amber-50 text-amber-700",
  },
  PROCESSING: {
    label: "Đang xử lý",
    className: "bg-blue-50 text-blue-700",
  },
  PAID: {
    label: "Thành công",
    className: "bg-emerald-50 text-emerald-700",
  },
  FAILED: {
    label: "Thất bại",
    className: "bg-red-50 text-red-600",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "bg-slate-100 text-slate-600",
  },
};

const METHOD_LABELS = {
  CASH: "Tiền mặt",
  VNPAY: "VNPAY",
  MOMO: "MoMo",
  BANK_TRANSFER: "Chuyển khoản",
};

function formatCurrency(value, currency = "VND") {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  if (currency === "VND") {
    return `${amount.toLocaleString("vi-VN")} đ`;
  }

  return `${amount.toLocaleString("vi-VN")} ${currency}`;
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export default function RecentPaymentsCard({ user }) {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = user?._id;

  // Khi đổi Customer, component quay về trang đầu.
  useEffect(() => {
    setShowAll(false);
    setPage(1);
    setPayments([]);
    setPagination({
      page: 1,
      total: 0,
      totalPages: 0,
    });
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    if (!userId || user?.role !== "CUSTOMER") {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    const fetchPayments = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminUserApi.getUserPayments(
          userId,
          page,
          PAGE_SIZE
        );

        if (cancelled) return;

        const data = response?.data;

        if (!data || !Array.isArray(data.payments)) {
          throw new Error("Dữ liệu thanh toán không hợp lệ");
        }

        setPayments(data.payments);

        setPagination({
          page: data.pagination?.page ?? page,
          total: data.pagination?.total ?? 0,
          totalPages: data.pagination?.totalPages ?? 0,
        });
      } catch (err) {
        if (cancelled) return;

        setPayments([]);
        setError(
          err.message ||
            "Không thể tải lịch sử thanh toán của khách hàng"
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPayments();

    return () => {
      cancelled = true;
    };
  }, [userId, user?.role, page]);

  const handleToggleAll = () => {
    setShowAll((current) => !current);
    setPage(1);
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
            <CreditCard
              size={14}
              className="text-emerald-600"
            />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Thanh toán gần đây
          </h3>
        </div>

        {pagination.total > PAGE_SIZE && (
          <button
            type="button"
            onClick={handleToggleAll}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {showAll ? "Thu gọn" : "Xem tất cả"}
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mx-4 mt-3 p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-600"
        >
          {error}
        </div>
      )}

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
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-xs text-slate-400"
                >
                  Đang tải lịch sử thanh toán...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-xs text-slate-400"
                >
                  {error
                    ? "Không thể hiển thị lịch sử thanh toán"
                    : "Khách hàng chưa có giao dịch thanh toán nào"}
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const status =
                  STATUS_CONFIG[payment.status] ?? {
                    label:
                      payment.status || "Không xác định",
                    className:
                      "bg-slate-100 text-slate-600",
                  };

                const method =
                  METHOD_LABELS[payment.method] ??
                  payment.method ??
                  "—";

                // Giao dịch PAID ưu tiên thời điểm
                // thanh toán; các trạng thái khác
                // dùng thời điểm tạo giao dịch.
                const displayTime =
                  payment.status === "PAID"
                    ? payment.paidAt || payment.createdAt
                    : payment.createdAt;

                return (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-2 text-[10px] font-medium text-slate-600 whitespace-nowrap">
                      {payment.paymentCode || "—"}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-slate-700 whitespace-nowrap">
                      {payment.serviceName ||
                        "Không xác định"}
                    </td>

                    <td className="px-3 py-2 text-[10px] font-semibold text-slate-700 whitespace-nowrap">
                      {formatCurrency(
                        payment.amount,
                        payment.currency
                      )}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-slate-600 whitespace-nowrap">
                      {method}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-slate-500 whitespace-nowrap">
                      {formatDateTime(displayTime)}
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 rounded-md text-[9px] font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang khi chọn Xem tất cả */}
      {showAll && pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Trang {pagination.page} /{" "}
            {pagination.totalPages}
            {" · "}
            {pagination.total} giao dịch
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              disabled={isLoading || page <= 1}
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang trước"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    pagination.totalPages,
                    current + 1
                  )
                )
              }
              disabled={
                isLoading ||
                page >= pagination.totalPages
              }
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Trang sau"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
