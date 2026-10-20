import React from "react";

// ==============================
// FORMAT TIỀN TỆ
// ==============================
const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toLocaleString("vi-VN")}đ`;
};

// ==============================
// FORMAT NGÀY GIỜ VIỆT NAM
// ==============================
const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

// ==============================
// FORMAT NGÀY
// ==============================
const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

// ==============================
// COMPONENT
// ==============================
export default function BookingInfoCard({ booking }) {
  if (!booking) return null;

  const isBoarding = booking.bookingType === "BOARDING";
  const isAppointment = booking.bookingType === "APPOINTMENT";

  const bookingTypeLabel = isBoarding
    ? "Lưu trú (BOARDING)"
    : isAppointment
      ? "Đặt lịch (APPOINTMENT)"
      : "Không xác định";

  // ==============================
  // THỜI GIAN SỬ DỤNG DỊCH VỤ
  // ==============================
  let scheduleLabel = "Thời gian hẹn";
  let scheduleValue = "—";

  if (isAppointment) {
    const date = formatDate(booking.bookingDate);

    const startTime = booking.startTime || "";
    const endTime = booking.endTime || "";

    const timeRange =
      startTime && endTime
        ? `${startTime} - ${endTime}`
        : startTime || endTime || "";

    scheduleValue =
      date === "—" ? "—" : `${date}${timeRange ? ` | ${timeRange}` : ""}`;
  }

  if (isBoarding) {
    scheduleLabel = "Thời gian lưu trú";

    const checkIn = formatDate(booking.checkInDate);
    const checkOut = formatDate(booking.checkOutDate);

    scheduleValue = `${checkIn} - ${checkOut}`;
  }

  // ==============================
  // SỐ LƯỢNG TÍNH TIỀN
  // ==============================
  const quantityLabel = isBoarding ? "Số ngày lưu trú" : "Số lượt dịch vụ";

  const quantityValue = isBoarding
    ? booking.numberOfDays != null
      ? `${booking.numberOfDays} ngày`
      : "—"
    : isAppointment
      ? "1 lượt"
      : "—";

  const unitPriceLabel = isBoarding ? "Đơn giá / ngày" : "Đơn giá / lượt";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-800">
          Thông tin booking
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
        {/* =========================
            LEFT COLUMN
        ========================= */}
        <div className="space-y-3">
          {/* BOOKING TYPE */}
          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">Loại booking</span>

            <span className="text-slate-700 font-medium break-words">
              {bookingTypeLabel}
            </span>
          </div>

          {/* CREATED AT */}
          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">Ngày đặt</span>

            <span className="text-slate-700 font-medium">
              {formatDateTime(booking.createdAt)}
            </span>
          </div>

          {/* SCHEDULE */}
          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">
              {scheduleLabel}
            </span>

            <span className="text-slate-700 font-medium">{scheduleValue}</span>
          </div>

          {/* BRANCH */}
          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">Chi nhánh</span>

            <span className="text-slate-700 font-medium">
              {booking.branch?.name || "Chưa có thông tin"}
            </span>
          </div>

          {/* SERVICE */}
          <div className="flex">
            <span className="text-slate-400 w-32 shrink-0">Dịch vụ</span>

            <span className="text-slate-700 font-medium">
              {booking.service?.name || "Chưa có thông tin"}
            </span>
          </div>
        </div>

        {/* =========================
            RIGHT COLUMN
        ========================= */}
        <div className="space-y-3">
          {/* UNIT PRICE */}
          <div className="flex justify-between items-center gap-3">
            <span className="text-slate-400">{unitPriceLabel}</span>

            <span className="text-slate-700 font-medium text-right">
              {formatCurrency(booking.unitPrice)}
            </span>
          </div>

          {/* QUANTITY */}
          <div className="flex justify-between items-center gap-3">
            <span className="text-slate-400">{quantityLabel}</span>

            <span className="text-slate-700 font-medium text-right">
              {quantityValue}
            </span>
          </div>

          {/* TOTAL PRICE */}
          <div className="flex justify-between items-center gap-3">
            <span className="text-slate-400">Tổng tiền</span>

            <span className="text-emerald-600 font-bold text-right">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>

          {/* FINAL AMOUNT */}
          <div className="flex justify-between items-center gap-3 pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-semibold">Thành tiền</span>

            <span className="text-emerald-600 font-bold text-right">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          CUSTOMER NOTE
      ========================= */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-3">
        <span className="text-slate-400 text-sm w-32 shrink-0 mt-2">
          Ghi chú khách hàng
        </span>

        <div className="flex-1 min-w-0 bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-2.5 text-xs text-amber-900 leading-relaxed font-medium whitespace-pre-wrap break-words">
          {booking.customerNote?.trim() || "Khách hàng không có ghi chú."}
        </div>
      </div>
    </div>
  );
}
