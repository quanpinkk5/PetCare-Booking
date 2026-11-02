import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Utensils,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  BookHeart,
  LogOut,
  LogIn,
  PawPrint,
  MapPin,
  Wallet,
} from "lucide-react";

import { boardingApi } from "../../services/boardingApi.js";

// ========================================
// CẤU HÌNH TRẠNG THÁI LƯU TRÚ
// ========================================

const STATUS_CONFIG = {
  PENDING: {
    label: "CHỜ XÁC NHẬN",
    className: "bg-amber-100 text-amber-700",
  },
  CONFIRMED: {
    label: "CHỜ CHECK-IN",
    className: "bg-indigo-100 text-indigo-700",
  },
  IN_PROGRESS: {
    label: "ĐANG LƯU TRÚ",
    className: "bg-blue-100 text-blue-700",
  },
  COMPLETED: {
    label: "ĐÃ CHECK-OUT",
    className: "bg-slate-100 text-slate-600",
  },
  CANCELLED: {
    label: "ĐÃ HỦY",
    className: "bg-rose-100 text-rose-700",
  },
};

const PAYMENT_CONFIG = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

// ========================================
// FORMAT NGÀY / GIỜ / TIỀN
// ========================================

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

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

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(date);
};

const formatMoney = (value) => {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0);
};

// ========================================
// ẢNH THÚ CƯNG
// ========================================

function PetAvatar({ src, name }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (!src || imageError) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
        <PawPrint size={32} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Thú cưng"}
      onError={() => setImageError(true)}
      className="h-20 w-20 shrink-0 rounded-2xl border border-white object-cover shadow-sm"
    />
  );
}

// ========================================
// COMPONENT CHÍNH
// ========================================

export default function BoardingDetailModal({
  pet,
  onClose,
  onCheckIn,
  onAddDiary,
  onCheckout,
}) {
  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const bookingId = pet?.bookingId || pet?._id || pet?.raw?._id;

  // ========================================
  // 1. LẤY CHI TIẾT TỪ BACKEND
  // ========================================

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError("Không tìm thấy ID đơn lưu trú.");
      return;
    }

    let cancelled = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      setDetail(null);

      try {
        const response = await boardingApi.getBoardingById(bookingId);

        if (!cancelled) {
          setDetail(response?.data?.booking || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Không thể tải chi tiết lưu trú.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (!pet) return null;

  // ========================================
  // 2. THÔNG TIN BOOKING
  // ========================================

  const data = detail || pet.raw || {};

  const statusCode =
    detail?.status || pet.statusCode || data.status || "PENDING";

  const statusInfo = STATUS_CONFIG[statusCode] || STATUS_CONFIG.PENDING;

  const bookingCode = data.bookingCode || pet.id || "—";

  const isConfirmed = statusCode === "CONFIRMED";

  const isInProgress = statusCode === "IN_PROGRESS";

  const isCompleted = statusCode === "COMPLETED";

  // Chỉ cho thao tác khi API chi tiết
  // đã tải thành công.
  const canCheckIn = !loading && !!detail && isConfirmed;

  const canAddDiary = !loading && !!detail && isInProgress;

  const canCheckOut = !loading && !!detail && isInProgress;

  // ========================================
  // 3. THÔNG TIN THÚ CƯNG
  // ========================================

  const petData =
    data.petId && typeof data.petId === "object" ? data.petId : {};

  const petName = petData.name || pet.name || "Thú cưng";

  const petType =
    [petData.species, petData.breed].filter(Boolean).join(" • ") ||
    pet.type ||
    "Chưa cập nhật";

  const petImage =
    petData.imageUrl || petData.avatar || petData.image || pet.img || "";

  // ========================================
  // 4. THÔNG TIN CHỦ NUÔI
  // ========================================

  const customer =
    data.customerId && typeof data.customerId === "object"
      ? data.customerId
      : {};

  const ownerName =
    customer.fullName || customer.name || pet.owner || "Khách hàng";

  const ownerPhone = customer.phone || pet.phone || "—";

  const ownerEmail = customer.email || pet.email || "";

  // ========================================
  // 5. DỊCH VỤ / CHI NHÁNH
  // ========================================

  const branchService =
    data.branchServiceId && typeof data.branchServiceId === "object"
      ? data.branchServiceId
      : {};

  const serviceName = branchService.serviceId?.name || "Dịch vụ lưu trú";

  const branchName = branchService.branchId?.name || "Chưa cập nhật chi nhánh";

  // ========================================
  // 6. THÔNG TIN LƯU TRÚ
  // ========================================

  const boardingDetails =
    data.boardingDetails &&
    typeof data.boardingDetails === "object" &&
    !Array.isArray(data.boardingDetails)
      ? data.boardingDetails
      : {};

  const roomName =
    boardingDetails.roomName ||
    boardingDetails.room ||
    pet.roomName ||
    "Chưa cập nhật phòng";

  const numberOfDays = data.numberOfDays ?? pet.numberOfDays;

  const actualCheckInAt =
    boardingDetails.actualCheckInAt || pet.actualCheckInAt;

  const actualCheckOutAt =
    boardingDetails.actualCheckOutAt || pet.actualCheckOutAt;

  const checkInDate = formatDate(data.checkInDate || pet.raw?.checkInDate);

  const checkOutDate = formatDate(data.checkOutDate || pet.raw?.checkOutDate);

  // Lịch ăn chỉ hiển thị khi DB có dữ liệu.
  const feedingSchedule = boardingDetails.feedingSchedule;

  const feedingText = Array.isArray(feedingSchedule)
    ? feedingSchedule.join(" • ")
    : typeof feedingSchedule === "string"
      ? feedingSchedule
      : "Chưa cập nhật";

  // Ghi chú thật từ Booking.
  const customerNote = data.customerNote || pet.customerNote || "";

  const careNote = boardingDetails.careNote || boardingDetails.careNotes || "";

  const paymentStatus = PAYMENT_CONFIG[data.paymentStatus] || "Chưa rõ";

  // ========================================
  // 7. GIAO DIỆN
  // ========================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết lưu trú ${bookingCode}`}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700">
              <ShieldCheck size={18} />
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-800">
                Chi tiết lưu trú: {bookingCode}
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Thông tin đặt dịch vụ lưu trú
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6 text-xs">
          {/* LOADING */}
          {loading && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center text-slate-500">
              Đang tải chi tiết lưu trú...
            </div>
          )}

          {/* LỖI API */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700"
            >
              <AlertCircle size={16} className="shrink-0" />

              <span className="leading-5">{error}</span>
            </div>
          )}

          {/* THÔNG TIN THÚ CƯNG */}
          <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <PetAvatar src={petImage} name={petName} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-extrabold text-slate-900">
                  {petName}
                </h4>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-slate-500">{petType}</p>

              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <ShieldCheck size={13} />
                {roomName}
              </p>
            </div>
          </div>

          {/* THỜI GIAN LƯU TRÚ */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-white p-3.5">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar size={13} />
                Check-in dự kiến
              </p>

              <p className="font-bold text-slate-800">{checkInDate}</p>
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar size={13} />
                Check-out dự kiến
              </p>

              <p className="font-bold text-slate-800">{checkOutDate}</p>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock size={13} />
                Thời gian lưu trú
              </p>

              <p className="font-bold text-slate-800">
                {numberOfDays != null ? `${numberOfDays} ngày` : "—"}
              </p>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2">
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Utensils size={13} />
                Khẩu phần & Lịch ăn
              </p>

              <p className="break-words font-bold text-slate-800">
                {feedingText || "Chưa cập nhật"}
              </p>
            </div>

            {/* THỜI GIAN CHECK-IN THỰC TẾ */}
            {actualCheckInAt && (
              <div className="col-span-2 space-y-1 border-t border-slate-100 pt-2">
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Đã Check-in thực tế
                </p>

                <p className="font-semibold text-emerald-700">
                  {formatDateTime(actualCheckInAt)}
                </p>
              </div>
            )}

            {/* THỜI GIAN CHECK-OUT THỰC TẾ */}
            {actualCheckOutAt && (
              <div className="col-span-2 space-y-1 border-t border-slate-100 pt-2">
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <LogOut size={13} className="text-emerald-600" />
                  Đã Check-out thực tế
                </p>

                <p className="font-semibold text-emerald-700">
                  {formatDateTime(actualCheckOutAt)}
                </p>
              </div>
            )}
          </div>

          {/* THÔNG TIN DỊCH VỤ */}
          <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <ShieldCheck size={14} className="text-emerald-600" />
              Thông tin dịch vụ
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <p className="text-[10px] text-slate-400">Dịch vụ</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {serviceName}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Chi nhánh</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin size={12} className="shrink-0 text-emerald-600" />
                  {branchName}
                </p>
              </div>
            </div>
          </div>

          {/* THÔNG TIN CHỦ NUÔI */}
          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <User size={14} className="text-emerald-600" />
              Thông tin chủ nuôi
            </p>

            <div className="pt-1">
              <p className="text-xs font-bold text-slate-800">{ownerName}</p>

              <div className="mt-1 flex flex-col gap-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" />
                  {ownerPhone}
                </span>

                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" />
                  {ownerEmail || "Chưa cập nhật email"}
                </span>
              </div>
            </div>
          </div>

          {/* GHI CHÚ CHĂM SÓC */}
          <div className="space-y-2 rounded-xl border border-slate-100 bg-amber-50/40 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
              <FileText size={13} className="text-amber-600" />
              Ghi chú chăm sóc & Tập tính
            </p>

            {customerNote || careNote ? (
              <div className="space-y-2">
                {customerNote && (
                  <div>
                    <p className="text-[10px] font-semibold text-amber-700">
                      Ghi chú từ khách hàng
                    </p>

                    <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-600">
                      {customerNote}
                    </p>
                  </div>
                )}

                {careNote && (
                  <div>
                    <p className="text-[10px] font-semibold text-amber-700">
                      Ghi chú chăm sóc
                    </p>

                    <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-600">
                      {careNote}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] italic text-slate-500">
                Chưa có ghi chú chăm sóc.
              </p>
            )}
          </div>

          {/* THANH TOÁN */}
          <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Wallet size={14} className="text-emerald-600" />
              Thông tin thanh toán
            </p>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Tổng tiền</span>

              <span className="font-bold text-emerald-700">
                {formatMoney(data.totalPrice)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Trạng thái thanh toán</span>

              <span className="font-semibold text-slate-800">
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* HƯỚNG DẪN THAO TÁC */}
          {!loading && detail && (
            <>
              {statusCode === "PENDING" && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
                  <AlertCircle size={16} className="shrink-0" />

                  <span className="leading-relaxed">
                    Đơn lưu trú đang chờ xác nhận. Vui lòng duyệt hoặc từ chối
                    tại trang Quản lý đặt lịch trước khi thực hiện Check-in.
                  </span>
                </div>
              )}

              {isConfirmed && (
                <div className="flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-indigo-700">
                  <LogIn size={16} className="shrink-0" />

                  <span className="leading-relaxed">
                    Đơn đã được xác nhận. Nhấn Check-in khi thú cưng thực tế đến
                    cơ sở lưu trú.
                  </span>
                </div>
              )}

              {isInProgress && (
                <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-700">
                  <BookHeart size={16} className="shrink-0" />

                  <span className="leading-relaxed">
                    Thú cưng đang lưu trú. Có thể ghi nhật ký chăm sóc và
                    Check-out khi bàn giao cho chủ nuôi.
                  </span>
                </div>
              )}

              {isCompleted && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                  <CheckCircle2 size={16} className="shrink-0" />

                  <span>
                    Đơn lưu trú đã hoàn thành. Thú cưng đã được Check-out.
                  </span>
                </div>
              )}

              {statusCode === "CANCELLED" && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                  <AlertCircle size={16} className="shrink-0" />

                  <span>
                    Đơn lưu trú đã bị hủy. Không thể Check-in hoặc Check-out.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-3.5">
          {/* NÚT ĐÓNG */}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* CONFIRMED: CHECK-IN */}
            {canCheckIn && (
              <button
                type="button"
                onClick={() => onCheckIn?.(pet)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <LogIn size={14} />
                <span>Check-in</span>
              </button>
            )}

            {/* IN_PROGRESS: THÊM NHẬT KÝ */}
            {canAddDiary && (
              <button
                type="button"
                onClick={() => onAddDiary?.(pet)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <BookHeart size={14} />
                <span>Thêm nhật ký</span>
              </button>
            )}

            {/* IN_PROGRESS: CHECK-OUT */}
            {canCheckOut && (
              <button
                type="button"
                onClick={() => onCheckout?.(pet)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
              >
                <LogOut size={14} />
                <span>Check-out</span>
              </button>
            )}

            {/* COMPLETED */}
            {isCompleted && !loading && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                <CheckCircle2 size={14} />
                Đã Check-out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
