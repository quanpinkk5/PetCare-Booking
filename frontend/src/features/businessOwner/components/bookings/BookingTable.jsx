import { useEffect, useState } from "react";
import {
  Eye,
  Check,
  X,
  Play,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  UserRound,
  PawPrint,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-800",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-indigo-100 text-indigo-800",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-blue-100 text-blue-800",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-emerald-100 text-emerald-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-rose-100 text-rose-800",
  },
};

const PAYMENT_CONFIG = {
  UNPAID: {
    label: "Chưa thanh toán",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getStatusCode = (booking) => {
  if (booking.statusCode) return booking.statusCode;

  const labels = {
    "Chờ xác nhận": "PENDING",
    "Chờ duyệt": "PENDING",
    "Đã xác nhận": "CONFIRMED",
    "Đang thực hiện": "IN_PROGRESS",
    "Hoàn thành": "COMPLETED",
    "Đã hủy": "CANCELLED",
    "Từ chối": "CANCELLED",
  };

  return (
    labels[booking.status] ||
    (STATUS_CONFIG[booking.status] ? booking.status : "PENDING")
  );
};

const getBookingType = (booking) =>
  booking.bookingType || booking.raw?.bookingType || "";

const getBookingTime = (booking) => {
  if (getBookingType(booking) === "BOARDING") {
    return "Lưu trú";
  }

  if (booking.timeStr) return booking.timeStr;

  if (booking.startTime && booking.endTime) {
    return `${booking.startTime} - ${booking.endTime}`;
  }

  return booking.time || "—";
};

const getBookingDate = (booking) => {
  if (getBookingType(booking) === "BOARDING") {
    const checkIn = formatDate(booking.checkInDate || booking.raw?.checkInDate);

    const checkOut = formatDate(
      booking.checkOutDate || booking.raw?.checkOutDate,
    );

    return `${checkIn} - ${checkOut}`;
  }

  if (booking.date) return booking.date;

  return formatDate(booking.bookingDate);
};

// ==========================================
// AVATAR KHÁCH HÀNG / THÚ CƯNG
// ==========================================

function Avatar({ src, alt, kind = "customer" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-100 text-slate-500">
        {kind === "pet" ? <PawPrint size={15} /> : <UserRound size={15} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-8 w-8 shrink-0 rounded-full border border-slate-100 object-cover"
    />
  );
}

// ==========================================
// BOOKING TABLE
// ==========================================

export default function BookingTable({
  bookings = [],
  onViewBooking,
  onApproveBooking,
  onRejectBooking,
  onProgressBooking,
  saving = false,

  // Phân trang Backend
  serverPagination = false,
  pagination = {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  },
  onPageChange,
  loading = false,
}) {
  // Giữ tương thích phân trang Frontend cũ
  const [currentPage, setCurrentPage] = useState(1);

  const localTotalPages = Math.max(
    1,
    Math.ceil(bookings.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, localTotalPages));
  }, [localTotalPages]);

  const safePage = Math.min(currentPage, localTotalPages);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

  const currentBookings = serverPagination
    ? bookings
    : bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ==========================================
  // THÔNG TIN PHÂN TRANG
  // ==========================================

  const backendPage = Number(pagination?.page) || 1;

  const backendLimit = Number(pagination?.limit) || ITEMS_PER_PAGE;

  const backendTotal = Number(pagination?.total) || 0;

  const backendTotalPages = Number(pagination?.totalPages) || 0;

  const displayPage = serverPagination ? backendPage : safePage;

  const displayLimit = serverPagination ? backendLimit : ITEMS_PER_PAGE;

  const displayTotal = serverPagination ? backendTotal : bookings.length;

  const displayTotalPages = serverPagination
    ? backendTotalPages
    : localTotalPages;

  const startItem =
    displayTotal === 0 ? 0 : (displayPage - 1) * displayLimit + 1;

  const endItem = Math.min(displayPage * displayLimit, displayTotal);

  const changePage = (nextPage) => {
    if (
      loading ||
      nextPage < 1 ||
      nextPage > displayTotalPages ||
      nextPage === displayPage
    ) {
      return;
    }

    if (serverPagination) {
      onPageChange?.(nextPage);
    } else {
      setCurrentPage(nextPage);
    }
  };

  const visiblePages = Array.from(
    { length: displayTotalPages },
    (_, index) => index + 1,
  ).filter(
    (number) =>
      number === 1 ||
      number === displayTotalPages ||
      Math.abs(number - displayPage) <= 1,
  );

  const getActionId = (booking) => booking._id || booking.id;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Danh sách đặt lịch hẹn
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Tìm thấy{" "}
            <span className="font-semibold text-emerald-600">
              {displayTotal}
            </span>{" "}
            Booking phù hợp
          </p>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse whitespace-nowrap text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Mã đặt lịch</th>

              <th className="px-4 py-3">Khách hàng</th>

              <th className="px-4 py-3">Thú cưng</th>

              <th className="px-4 py-3">Dịch vụ</th>

              <th className="px-4 py-3">Chi nhánh</th>

              <th className="px-4 py-3">Thời gian hẹn</th>

              <th className="px-4 py-3">Thanh toán</th>

              <th className="px-4 py-3">Trạng thái</th>

              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {currentBookings.map((bk) => {
              const bookingType = getBookingType(bk);

              const isAppointment = bookingType === "APPOINTMENT";

              const isBoarding = bookingType === "BOARDING";

              const statusCode = getStatusCode(bk);

              const statusInfo =
                STATUS_CONFIG[statusCode] || STATUS_CONFIG.PENDING;

              const paymentInfo = PAYMENT_CONFIG[bk.paymentStatus];

              const ServiceIcon = bk.serviceIcon;

              const bookingId = getActionId(bk);

              // PENDING: cả hai loại Booking
              const canApproveOrReject = statusCode === "PENDING";

              // Chỉ APPOINTMENT được xử lý
              // Bắt đầu/Hoàn thành ở đây
              const canStart = isAppointment && statusCode === "CONFIRMED";

              const canComplete = isAppointment && statusCode === "IN_PROGRESS";

              const hasActionButtons =
                canApproveOrReject ||
                (canStart && !!onProgressBooking) ||
                (canComplete && !!onProgressBooking);

              const customerName =
                bk.customer ||
                bk.customerId?.fullName ||
                bk.customerId?.name ||
                "Khách hàng";

              const phone = bk.phone || bk.customerId?.phone || "—";

              const petName = bk.pet || bk.petId?.name || "—";

              const breed = bk.breed || bk.petId?.breed || "";

              const serviceName =
                bk.service || bk.branchServiceId?.serviceId?.name || "Dịch vụ";

              const branchName =
                bk.branch || bk.branchServiceId?.branchId?.name || "Chi nhánh";

              return (
                <tr
                  key={bk._id || bk.id}
                  className={`transition-colors hover:bg-slate-50/70 ${
                    bk.bgHighlight || ""
                  }`}
                >
                  {/* MÃ BOOKING */}
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onViewBooking?.(bk)}
                      className="cursor-pointer text-left font-bold text-slate-800 transition hover:text-emerald-600"
                    >
                      {bk.id || bk.bookingCode || bk._id}
                    </button>

                    <div className="mt-0.5 text-[10px] text-slate-400">
                      {isBoarding
                        ? "Dịch vụ lưu trú"
                        : isAppointment
                          ? "Lịch hẹn theo giờ"
                          : "Dịch vụ"}
                    </div>
                  </td>

                  {/* KHÁCH HÀNG */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={bk.customerImg} alt={customerName} />

                      <div>
                        <div className="font-semibold text-slate-800">
                          {customerName}
                        </div>

                        <div className="font-mono text-[10px] text-slate-400">
                          {phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* THÚ CƯNG */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={bk.petImg} alt={petName} kind="pet" />

                      <div>
                        <div className="font-semibold text-slate-800">
                          {petName}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {breed}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DỊCH VỤ */}
                  <td className="px-4 py-3.5">
                    <div
                      className={`inline-flex items-center gap-1.5 font-medium ${
                        bk.serviceColor || "text-slate-700"
                      }`}
                    >
                      {ServiceIcon && (
                        <ServiceIcon size={14} className="shrink-0" />
                      )}

                      <span>{serviceName}</span>
                    </div>
                  </td>

                  {/* CHI NHÁNH */}
                  <td className="px-4 py-3.5 text-slate-700">
                    <div className="font-medium">{branchName}</div>

                    {bk.branchSub && bk.branchSub !== branchName && (
                      <div className="text-[10px] text-slate-400">
                        {bk.branchSub}
                      </div>
                    )}
                  </td>

                  {/* THỜI GIAN */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-800">
                      {getBookingTime(bk)}
                    </div>

                    <div className="text-[10px] text-slate-400">
                      {getBookingDate(bk)}

                      {bk.dateSub && (
                        <span className="font-semibold text-emerald-600">
                          {" "}
                          ({bk.dateSub})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* THANH TOÁN */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        paymentInfo?.className ||
                        bk.paymentClass ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {paymentInfo?.label || bk.payment || "Chưa rõ"}
                    </span>
                  </td>

                  {/* TRẠNG THÁI */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        statusInfo.className
                      }`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* THAO TÁC */}
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* DUYỆT / TỪ CHỐI */}
                      {canApproveOrReject && (
                        <>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => onApproveBooking?.(bookingId)}
                            className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Duyệt Booking"
                          >
                            <Check size={12} />
                            <span>Duyệt</span>
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => onRejectBooking?.(bookingId)}
                            className="flex cursor-pointer items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Từ chối Booking"
                          >
                            <X size={12} />
                            <span>Từ chối</span>
                          </button>
                        </>
                      )}

                      {/* APPOINTMENT: BẮT ĐẦU */}
                      {canStart && onProgressBooking && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            onProgressBooking(bookingId, "IN_PROGRESS")
                          }
                          className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Bắt đầu thực hiện dịch vụ"
                        >
                          <Play size={12} />
                          <span>Bắt đầu</span>
                        </button>
                      )}

                      {/* APPOINTMENT: HOÀN THÀNH */}
                      {canComplete && onProgressBooking && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            onProgressBooking(bookingId, "COMPLETED")
                          }
                          className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Hoàn thành dịch vụ"
                        >
                          <CheckCheck size={12} />
                          <span>Hoàn thành</span>
                        </button>
                      )}

                      {/* XEM CHI TIẾT */}
                      <button
                        type="button"
                        onClick={() => onViewBooking?.(bk)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        title="Xem chi tiết Booking"
                      >
                        <Eye size={14} />

                        {!hasActionButtons && <span>Chi tiết</span>}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* KHÔNG CÓ DỮ LIỆU */}
            {currentBookings.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Eye size={20} />
                  </div>

                  <p className="text-sm font-medium text-slate-600">
                    Không tìm thấy lịch đặt phù hợp
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================
          PHÂN TRANG NẰM NGAY DƯỚI BẢNG
          DÙNG BACKEND KHI serverPagination=true
      ===================================== */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:flex-row">
        {/* THÔNG TIN SỐ LƯỢNG */}
        <span>
          {displayTotal === 0 ? (
            "Không có Booking nào"
          ) : (
            <>
              Hiển thị{" "}
              <strong className="text-slate-800">
                {startItem} - {endItem}
              </strong>{" "}
              trên tổng số{" "}
              <strong className="text-slate-800">{displayTotal}</strong> Booking
            </>
          )}
        </span>

        {/* NÚT PHÂN TRANG */}
        {displayTotalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {/* TRANG TRƯỚC */}
            <button
              type="button"
              aria-label="Trang trước"
              disabled={loading || displayPage <= 1}
              onClick={() => changePage(displayPage - 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {/* SỐ TRANG */}
            {visiblePages.map((pageNumber, index) => {
              const previousPage = visiblePages[index - 1];

              return (
                <div key={pageNumber} className="flex items-center gap-1.5">
                  {previousPage && pageNumber - previousPage > 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => changePage(pageNumber)}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      pageNumber === displayPage
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                </div>
              );
            })}

            {/* TRANG SAU */}
            <button
              type="button"
              aria-label="Trang sau"
              disabled={loading || displayPage >= displayTotalPages}
              onClick={() => changePage(displayPage + 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
