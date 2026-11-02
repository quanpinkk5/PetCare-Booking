import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Play,
  CheckCheck,
  PawPrint,
  Wallet,
  History,
  Info,
} from "lucide-react";

import { bookingApi } from "../../services/bookingApi.js";

// ==========================================
// CẤU HÌNH TRẠNG THÁI
// ==========================================

const STATUS_MAP = {
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

const PAYMENT_MAP = {
  UNPAID: {
    label: "Chưa thanh toán",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

// ==========================================
// CÁC HÀM FORMAT
// ==========================================

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

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0);

// ==========================================
// AVATAR
// ==========================================

function InfoAvatar({ src, kind = "customer", alt = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-100 text-slate-500">
        {kind === "pet" ? <PawPrint size={19} /> : <User size={19} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-full border border-slate-100 object-cover"
    />
  );
}

// ==========================================
// BOOKING DETAIL MODAL
// ==========================================

export default function BookingDetailModal({ booking, onClose, onChanged }) {
  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRejectForm, setShowRejectForm] = useState(false);

  const [rejectReason, setRejectReason] = useState("");

  const bookingId = booking?._id || booking?.raw?._id;

  // ==========================================
  // 1. TẢI CHI TIẾT BOOKING
  // ==========================================

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError("Không tìm thấy ID Booking.");
      return;
    }

    let cancelled = false;

    const loadDetail = async () => {
      setLoading(true);
      setError("");
      setDetail(null);
      setShowRejectForm(false);
      setRejectReason("");

      try {
        const response = await bookingApi.getBookingById(bookingId);

        if (!cancelled) {
          setDetail(response?.data?.booking || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Không thể tải chi tiết Booking.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  // ==========================================
  // 2. DỮ LIỆU HIỂN THỊ
  // ==========================================

  if (!booking) return null;

  const data = detail || booking.raw || booking;

  const statusCode =
    detail?.status ||
    booking.statusCode ||
    (STATUS_MAP[booking.status] ? booking.status : "PENDING");

  const statusInfo = STATUS_MAP[statusCode] || STATUS_MAP.PENDING;

  const paymentCode =
    detail?.paymentStatus || booking.paymentStatus || "UNPAID";

  const paymentInfo = PAYMENT_MAP[paymentCode] || PAYMENT_MAP.UNPAID;

  const bookingCode = data.bookingCode || booking.id || "—";

  // ==========================================
  // 3. XÁC ĐỊNH LOẠI BOOKING
  // ==========================================

  const bookingType =
    detail?.bookingType || booking?.raw?.bookingType || booking?.bookingType;

  const isBoarding = bookingType === "BOARDING";

  const isAppointment = bookingType === "APPOINTMENT";

  // Chỉ cho APPOINTMENT xử lý tiến độ
  // trong Booking Management.
  const canStart =
    isAppointment && statusCode === "CONFIRMED" && !loading && !!detail;

  const canComplete =
    isAppointment && statusCode === "IN_PROGRESS" && !loading && !!detail;

  // Cả hai loại đều có thể duyệt / từ chối
  const canApproveOrReject = statusCode === "PENDING" && !loading && !!detail;

  // ==========================================
  // 4. THÔNG TIN KHÁCH HÀNG
  // ==========================================

  const customerName =
    detail?.customerId?.fullName ||
    detail?.customerId?.name ||
    booking.customer ||
    "Khách hàng";

  const customerPhone = detail?.customerId?.phone || booking.phone || "—";

  const customerEmail = detail?.customerId?.email || "";

  // ==========================================
  // 5. THÔNG TIN THÚ CƯNG
  // ==========================================

  const petName = detail?.petId?.name || booking.pet || "—";

  const petBreed = detail?.petId?.breed || booking.breed || "";

  // ==========================================
  // 6. THÔNG TIN DỊCH VỤ
  // ==========================================

  const serviceName =
    detail?.branchServiceId?.serviceId?.name || booking.service || "Dịch vụ";

  const branchName =
    detail?.branchServiceId?.branchId?.name ||
    booking.branch ||
    booking.branchSub ||
    "Chi nhánh";

  const bookingDate = isBoarding
    ? formatDate(data.checkInDate)
    : formatDate(data.bookingDate);

  const bookingTime = isBoarding
    ? `${formatDate(data.checkInDate)} - ${formatDate(data.checkOutDate)}`
    : `${data.startTime || "—"} - ${data.endTime || "—"}`;

  // ==========================================
  // 7. LỊCH SỬ TRẠNG THÁI
  // ==========================================

  const history = Array.isArray(detail?.statusHistory)
    ? [...detail.statusHistory].reverse()
    : [];

  // ==========================================
  // 8. REFRESH SAU THAO TÁC
  // ==========================================

  const refreshDetail = async () => {
    const response = await bookingApi.getBookingById(bookingId);

    setDetail(response?.data?.booking || null);
  };

  // ==========================================
  // 9. DUYỆT / TỪ CHỐI /
  //    BẮT ĐẦU / HOÀN THÀNH
  // ==========================================

  const handleAction = async (nextStatus, note = "") => {
    if (saving || !detail) return;

    // Không cho BOARDING gọi API progress
    if (isBoarding && ["IN_PROGRESS", "COMPLETED"].includes(nextStatus)) {
      setError("Đơn lưu trú phải được Check-in/Check-out tại Quản lý lưu trú.");
      return;
    }

    if (nextStatus === "CANCELLED" && !note.trim()) {
      setError("Vui lòng nhập lý do từ chối.");
      return;
    }

    const actionNames = {
      CONFIRMED: "duyệt",
      CANCELLED: "từ chối",
      IN_PROGRESS: "bắt đầu",
      COMPLETED: "hoàn thành",
    };

    const actionName = actionNames[nextStatus] || "cập nhật";

    if (nextStatus !== "CANCELLED") {
      const confirmed = window.confirm(
        `Bạn có chắc muốn ${actionName} Booking ${bookingCode}?`,
      );

      if (!confirmed) return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    let updated = false;

    try {
      if (nextStatus === "CONFIRMED" || nextStatus === "CANCELLED") {
        await bookingApi.updateBookingStatus(bookingId, nextStatus, note);
      } else {
        await bookingApi.updateBookingProgress(bookingId, nextStatus, note);
      }

      updated = true;

      setShowRejectForm(false);
      setRejectReason("");

      setSuccess(
        nextStatus === "CONFIRMED"
          ? "Duyệt Booking thành công."
          : nextStatus === "CANCELLED"
            ? "Từ chối Booking thành công."
            : nextStatus === "IN_PROGRESS"
              ? "Bắt đầu dịch vụ thành công."
              : "Hoàn thành dịch vụ thành công.",
      );

      await refreshDetail();
    } catch (err) {
      setError(
        updated
          ? "Đã cập nhật trạng thái nhưng chưa tải lại được chi tiết. Vui lòng mở lại Booking."
          : err.message || "Không thể cập nhật trạng thái Booking.",
      );
    } finally {
      if (updated) {
        onChanged?.();
      }

      setSaving(false);
    }
  };

  // ==========================================
  // 10. GIAO DIỆN
  // ==========================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      onClick={() => {
        if (!saving) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết Booking ${bookingCode}`}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700">
              BK
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-800">
                Chi tiết đặt lịch: {bookingCode}
              </h3>

              <p className="text-[11px] text-slate-500">
                Đặt lúc: {formatDateTime(data.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-6 text-xs">
          {loading && (
            <div className="rounded-lg bg-slate-50 p-3 text-center text-slate-500">
              Đang tải thông tin Booking...
            </div>
          )}

          {/* THÔNG BÁO LỖI */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700"
            >
              <AlertCircle size={17} className="shrink-0" />

              <span className="text-xs leading-5">{error}</span>
            </div>
          )}

          {/* THÔNG BÁO THÀNH CÔNG */}
          {success && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
              <CheckCircle size={17} className="shrink-0" />

              <span className="text-xs">{success}</span>
            </div>
          )}

          {/* TRẠNG THÁI & THANH TOÁN */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div>
              <span className="mb-1 block text-[10px] font-medium text-slate-400">
                Trạng thái đặt lịch
              </span>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}
              >
                {statusInfo.label}
              </span>
            </div>

            <div>
              <span className="mb-1 block text-[10px] font-medium text-slate-400">
                Tình trạng thanh toán
              </span>

              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentInfo.className}`}
              >
                {paymentInfo.label}
              </span>
            </div>
          </div>

          {/* KHÁCH HÀNG & THÚ CƯNG */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* KHÁCH HÀNG */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <User size={14} className="text-emerald-600" />
                Thông tin khách hàng
              </span>

              <div className="flex items-center gap-3 pt-1">
                <InfoAvatar src={booking.customerImg} alt={customerName} />

                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800">
                    {customerName}
                  </h4>

                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                    <Phone size={12} className="text-slate-400" />
                    {customerPhone}
                  </p>
                </div>
              </div>

              {customerEmail && (
                <p className="break-all text-[10px] text-slate-400">
                  {customerEmail}
                </p>
              )}
            </div>

            {/* THÚ CƯNG */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <PawPrint size={14} className="text-emerald-600" />
                Thú cưng phục vụ
              </span>

              <div className="flex items-center gap-3 pt-1">
                <InfoAvatar src={booking.petImg} alt={petName} kind="pet" />

                <div>
                  <h4 className="font-semibold text-slate-800">{petName}</h4>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {petBreed || "Chưa cập nhật giống"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DỊCH VỤ & THỜI GIAN */}
          <div className="space-y-2.5 rounded-xl border border-slate-100 bg-white p-3.5">
            <h4 className="text-[11px] font-bold text-slate-800">
              Thông tin dịch vụ & Thời gian
            </h4>

            <div className="grid grid-cols-2 gap-3 pt-1 text-slate-600">
              <div>
                <span className="block text-[10px] text-slate-400">
                  Loại Booking
                </span>

                <span className="mt-0.5 block font-semibold text-slate-800">
                  {isBoarding
                    ? "Lưu trú thú cưng"
                    : isAppointment
                      ? "Dịch vụ theo giờ"
                      : "Chưa xác định"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400">
                  Dịch vụ đã chọn
                </span>

                <span className="mt-0.5 block font-semibold text-slate-800">
                  {serviceName}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400">
                  Chi nhánh
                </span>

                <span className="mt-0.5 flex items-center gap-1 font-medium text-slate-800">
                  <MapPin size={12} className="shrink-0 text-emerald-600" />
                  {branchName}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400">
                  {isBoarding ? "Ngày nhận dự kiến" : "Ngày hẹn"}
                </span>

                <span className="mt-0.5 flex items-center gap-1 font-medium text-slate-800">
                  <Calendar size={12} className="shrink-0 text-blue-500" />
                  {bookingDate}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400">
                  {isBoarding ? "Khoảng thời gian lưu trú" : "Khung giờ"}
                </span>

                <span className="mt-0.5 flex items-center gap-1 font-medium text-slate-800">
                  <Clock size={12} className="shrink-0 text-amber-500" />
                  {bookingTime}
                </span>
              </div>

              {isBoarding && (
                <div>
                  <span className="block text-[10px] text-slate-400">
                    Số ngày lưu trú
                  </span>

                  <span className="mt-0.5 block font-semibold text-slate-800">
                    {data.numberOfDays != null
                      ? `${data.numberOfDays} ngày`
                      : "—"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* THÔNG BÁO RIÊNG CHO BOARDING */}
          {isBoarding &&
            !loading &&
            ["CONFIRMED", "IN_PROGRESS"].includes(statusCode) && (
              <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3.5 text-blue-700">
                <Info size={17} className="mt-0.5 shrink-0" />

                <div className="space-y-1">
                  <p className="text-xs font-bold">Quản lý lưu trú</p>

                  <p className="text-[11px] leading-relaxed">
                    {statusCode === "CONFIRMED"
                      ? "Đơn lưu trú đã được xác nhận. Vui lòng vào mục Quản lý lưu trú để Check-in khi thú cưng đến cơ sở."
                      : "Thú cưng đang trong quá trình lưu trú. Vui lòng vào mục Quản lý lưu trú để Check-out khi bàn giao cho chủ nuôi."}
                  </p>
                </div>
              </div>
            )}

          {/* GIÁ & GHI CHÚ */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-3.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
              <Wallet size={14} className="text-emerald-600" />
              Thanh toán & Ghi chú
            </h4>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Đơn giá</span>

              <strong className="text-slate-800">
                {formatMoney(data.unitPrice)}
              </strong>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="font-semibold text-slate-600">Tổng tiền</span>

              <strong className="text-sm text-emerald-700">
                {formatMoney(data.totalPrice)}
              </strong>
            </div>

            {data.customerNote && (
              <div className="border-t border-slate-100 pt-2">
                <span className="text-[10px] text-slate-400">
                  Ghi chú của khách hàng
                </span>

                <p className="mt-1 whitespace-pre-line text-slate-700">
                  {data.customerNote}
                </p>
              </div>
            )}
          </div>

          {/* LỊCH SỬ TRẠNG THÁI */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-3.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
              <History size={14} className="text-emerald-600" />
              Lịch sử xử lý Booking
            </h4>

            {history.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                Chưa có lịch sử thay đổi trạng thái.
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="border-l-2 border-emerald-200 pl-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-700">
                        {STATUS_MAP[item.status]?.label || item.status}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(item.changedAt)}
                      </span>
                    </div>

                    {item.note && (
                      <p className="mt-1 whitespace-pre-line text-[11px] text-slate-500">
                        {item.note}
                      </p>
                    )}

                    {(item.changedBy?.fullName || item.changedBy?.name) && (
                      <p className="mt-1 text-[10px] text-slate-400">
                        Thực hiện bởi:{" "}
                        {item.changedBy.fullName || item.changedBy.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORM NHẬP LÝ DO TỪ CHỐI */}
          {showRejectForm && canApproveOrReject && (
            <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <h4 className="text-xs font-bold text-rose-700">
                Lý do từ chối Booking
              </h4>

              <textarea
                rows={3}
                maxLength={500}
                value={rejectReason}
                disabled={saving}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  setError("");
                }}
                placeholder="Nhập lý do từ chối để khách hàng được biết..."
                className="w-full resize-none rounded-lg border border-rose-200 bg-white p-2 text-xs outline-none focus:border-rose-400"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  disabled={saving || !rejectReason.trim()}
                  onClick={() => handleAction("CANCELLED", rejectReason.trim())}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3.5">
          <div className="text-[11px] text-slate-400">
            Mã tham chiếu:{" "}
            <span className="font-mono text-slate-600">{bookingCode}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* DUYỆT / TỪ CHỐI */}
            {canApproveOrReject && (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setError("");
                    setShowRejectForm(true);
                  }}
                  className="rounded-xl border border-rose-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  Từ chối
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleAction("CONFIRMED")}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle size={13} />
                    Xác nhận duyệt
                  </span>
                </button>
              </>
            )}

            {/* CHỈ APPOINTMENT: BẮT ĐẦU */}
            {canStart && (
              <button
                type="button"
                disabled={saving}
                onClick={() => handleAction("IN_PROGRESS")}
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1">
                  <Play size={13} />
                  Bắt đầu dịch vụ
                </span>
              </button>
            )}

            {/* CHỈ APPOINTMENT: HOÀN THÀNH */}
            {canComplete && (
              <button
                type="button"
                disabled={saving}
                onClick={() => handleAction("COMPLETED")}
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1">
                  <CheckCheck size={13} />
                  Hoàn thành
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
