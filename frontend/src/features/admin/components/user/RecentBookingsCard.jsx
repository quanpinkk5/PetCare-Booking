
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { adminUserApi } from "../../services/adminUserApi";

const PAGE_SIZE = 5;

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-50 text-amber-700",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-blue-50 text-blue-700",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-purple-50 text-purple-700",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-600",
  },
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export default function RecentBookingsCard({ user }) {
  const [bookings, setBookings] = useState([]);
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

  // Khi chuyển sang Customer khác, quay về trang đầu.
  useEffect(() => {
    setShowAll(false);
    setPage(1);
    setBookings([]);
    setPagination({
      page: 1,
      total: 0,
      totalPages: 0,
    });
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    if (!userId || user?.role !== "CUSTOMER") {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminUserApi.getUserBookings(
          userId,
          page,
          PAGE_SIZE
        );

        if (cancelled) return;

        const data = response?.data;

        if (!data || !Array.isArray(data.bookings)) {
          throw new Error("Dữ liệu booking không hợp lệ");
        }

        setBookings(data.bookings);
        setPagination({
          page: data.pagination?.page ?? page,
          total: data.pagination?.total ?? 0,
          totalPages: data.pagination?.totalPages ?? 0,
        });
      } catch (err) {
        if (cancelled) return;

        setBookings([]);
        setError(
          err.message || "Không thể tải booking của khách hàng"
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [userId, user?.role, page]);

  const handleToggleAll = () => {
    if (showAll) {
      setShowAll(false);
      setPage(1);
    } else {
      setShowAll(true);
      setPage(1);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
            <CalendarDays
              size={14}
              className="text-emerald-600"
            />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Booking gần đây
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
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-xs text-slate-400"
                >
                  Đang tải danh sách booking...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-xs text-slate-400"
                >
                  {error
                    ? "Không thể hiển thị danh sách booking"
                    : "Khách hàng chưa có booking nào"}
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const status =
                  STATUS_CONFIG[booking.status] ?? {
                    label: booking.status || "Không xác định",
                    className:
                      "bg-slate-100 text-slate-600",
                  };

                return (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-2 text-[10px] font-medium text-slate-600 whitespace-nowrap">
                      {booking.bookingCode || "—"}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-slate-700 whitespace-nowrap">
                      {booking.serviceName || "Không xác định"}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-slate-600 whitespace-nowrap">
                      {booking.businessName || "Không xác định"}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-slate-500 whitespace-nowrap">
                      {formatDate(booking.createdAt)}
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
            Trang {pagination.page} / {pagination.totalPages}
            {" · "}
            {pagination.total} booking
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
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
