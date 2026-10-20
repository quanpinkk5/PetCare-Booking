import { useEffect, useState } from "react";

import { CreditCard, X, FileDown, UserRound } from "lucide-react";

// ========================================
// 1. CẤU HÌNH TRẠNG THÁI
// ========================================
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

// ========================================
// 2. CẤU HÌNH PHƯƠNG THỨC
// ========================================
const METHOD_CONFIG = {
  MOMO: {
    label: "MoMo",
    className: "bg-pink-50 text-pink-600",
  },
  VNPAY: {
    label: "VNPAY",
    className: "bg-blue-50 text-blue-600",
  },
  BANK_TRANSFER: {
    label: "Chuyển khoản",
    className: "bg-slate-100 text-slate-700",
  },
  CASH: {
    label: "Tiền mặt (CASH)",
    className: "bg-emerald-50 text-emerald-600",
  },
};

// ========================================
// 3. HÀM ĐỊNH DẠNG
// ========================================
const formatMoney = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `${amount.toLocaleString("vi-VN")} đ`;
};

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

// Chuyển dữ liệu thành text an toàn
// trước khi đưa vào HTML của phiếu PDF.
const escapeHtml = (value) => {
  return String(value ?? "—").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
};

// ========================================
// 4. COMPONENT
// ========================================
export default function PaymentDetailPanel({
  payment,
  isOpen,
  isLoading = false,
  error = "",
  onClose,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  // Thông báo lỗi PDF tự biến mất sau 5 giây
  useEffect(() => {
    if (!downloadError) return;

    const timer = setTimeout(() => {
      setDownloadError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [downloadError]);

  // Khi chuyển Payment hoặc đóng modal,
  // xóa thông báo lỗi cũ.
  useEffect(() => {
    setDownloadError("");
  }, [payment?._id, isOpen]);

  // ========================================
  // 5. TẢI PDF
  // ========================================
  const handleDownloadPdf = async () => {
    if (
      !payment ||
      payment.status !== "PAID" ||
      isLoading ||
      isDownloading ||
      error
    ) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    let receiptElement = null;

    try {
      // Dynamic import để chỉ tải thư viện khi cần.
      const html2pdfModule = await import("html2pdf.js");

      const html2pdf = html2pdfModule.default || html2pdfModule;

      const paymentCode = payment.paymentCode || "UNKNOWN";

      const safeFileName = paymentCode.replace(/[^a-zA-Z0-9_-]/g, "_");

      const methodName =
        METHOD_CONFIG[payment.method]?.label || payment.method || "—";

      const customerName = payment.customer?.fullName || "Không có thông tin";

      // ====================================
      // 5.1. TẠO DÒNG THÔNG TIN TRONG PDF
      // ====================================
      const createReceiptRow = (label, value) => `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
          page-break-inside: avoid;
          break-inside: avoid;
        ">
          <span style="
            flex-shrink: 0;
            color: #64748b;
          ">
            ${escapeHtml(label)}
          </span>

          <span style="
            color: #0f172a;
            font-weight: 600;
            text-align: right;
            overflow-wrap: anywhere;
          ">
            ${escapeHtml(value || "—")}
          </span>
        </div>
      `;

      // ====================================
      // 5.2. TẠO PHIẾU HTML
      // ====================================
      receiptElement = document.createElement("div");

      // Đặt phần tử ngoài vùng màn hình thay
      // vì display:none, để html2canvas vẫn
      // có thể render nội dung.

      receiptElement.style.cssText = `
  width: 720px;
  padding: 35px;
  box-sizing: border-box;
  background: #ffffff;
  color: #0f172a;
  font-family: Arial, sans-serif;
  line-height: 1.6;
`;

      receiptElement.innerHTML = `
        <div style="
          text-align: center;
          padding-bottom: 23px;
          border-bottom: 3px solid #059669;
        ">
          <div style="
            font-size: 27px;
            font-weight: 800;
            color: #047857;
            letter-spacing: 0.5px;
          ">
            PETCARE BOOKING
          </div>

          <div style="
            margin-top: 8px;
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
          ">
            PHIẾU XÁC NHẬN THANH TOÁN
          </div>

          <div style="
            margin-top: 7px;
            font-size: 11px;
            color: #64748b;
          ">
            Chứng từ xác nhận giao dịch thanh toán
          </div>

          <div style="
            display: inline-block;
            margin-top: 16px;
            padding: 6px 18px;
            border-radius: 20px;
            background: #d1fae5;
            color: #047857;
            font-size: 12px;
            font-weight: 700;
          ">
            ĐÃ THANH TOÁN
          </div>
        </div>

        <div style="margin-top: 26px;">
          <div style="
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 700;
            color: #047857;
          ">
            THÔNG TIN GIAO DỊCH
          </div>

          ${createReceiptRow("Mã thanh toán", payment.paymentCode)}

          ${createReceiptRow("Mã Booking", payment.booking?.bookingCode)}

          ${createReceiptRow("Khách hàng", customerName)}

          ${createReceiptRow("Số điện thoại", payment.customer?.phone)}

          ${createReceiptRow("Email", payment.customer?.email)}

          ${createReceiptRow("Thương hiệu / Cơ sở", payment.business?.name)}
        </div>

        <div style="margin-top: 27px;">
          <div style="
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 700;
            color: #047857;
          ">
            CHI TIẾT THANH TOÁN
          </div>

          ${createReceiptRow("Phương thức", methodName)}

          ${createReceiptRow("Mã tham chiếu", payment.transactionId)}

          ${createReceiptRow("Nhà cung cấp", payment.provider)}

          ${createReceiptRow(
            "Ngày tạo giao dịch",
            formatDateTime(payment.createdAt),
          )}

          ${createReceiptRow("Ngày thanh toán", formatDateTime(payment.paidAt))}
        </div>

        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-top: 29px;
          padding: 19px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          page-break-inside: avoid;
          break-inside: avoid;
        ">
          <span style="
            font-size: 13px;
            font-weight: 700;
            color: #065f46;
          ">
            TỔNG TIỀN ĐÃ THANH TOÁN
          </span>

          <span style="
            font-size: 24px;
            font-weight: 800;
            color: #047857;
            white-space: nowrap;
          ">
            ${escapeHtml(formatMoney(payment.amount))}
          </span>
        </div>

        <div style="
          margin-top: 34px;
          padding-top: 19px;
          border-top: 1px dashed #cbd5e1;
          text-align: center;
          color: #64748b;
          font-size: 11px;
        ">
          <div>
            Cảm ơn quý khách đã sử dụng dịch vụ
            PetCare Booking!
          </div>

          <div style="margin-top: 8px;">
            Ngày tạo phiếu:
            ${escapeHtml(formatDateTime(new Date()))}
          </div>

          <div style="margin-top: 8px;">
            Đây là phiếu xác nhận thanh toán,
            không phải hóa đơn VAT hoặc
            hóa đơn điện tử hợp pháp.
          </div>
        </div>
      `;

          

      // Đợi font được tải trước khi render PDF.
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // ====================================
      // 5.3. CẤU HÌNH PDF A4
      // ====================================
      const options = {
        margin: 8,

        filename: `PhieuThanhToan_${safeFileName}.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

        pagebreak: {
          mode: ["css", "legacy"],
        },
      };

      // ====================================
      // 5.4. TẢI PDF TRỰC TIẾP
      // ====================================
      await html2pdf().set(options).from(receiptElement).save();
    } catch (err) {
      console.error("Download Payment PDF Error:", err);

      setDownloadError("Không thể tạo file PDF. Vui lòng thử lại.");
    } finally {
      if (receiptElement) {
        receiptElement.remove();
      }

      setIsDownloading(false);
    }
  };

  // ========================================
  // 6. KHÔNG RENDER KHI MODAL ĐÓNG
  // ========================================
  if (!isOpen || !payment) return null;

  const status = STATUS_CONFIG[payment.status] || {
    label: payment.status || "—",
    className: "bg-slate-100 text-slate-600",
  };

  const method = METHOD_CONFIG[payment.method] || {
    label: payment.method || "—",
    className: "bg-slate-100 text-slate-600",
  };

  const customerName = payment.customer?.fullName || "Không có thông tin";

  const paidAt =
    payment.status === "PAID" ? formatDateTime(payment.paidAt) : "—";

  const canDownload =
    payment.status === "PAID" && !isLoading && !error && !isDownloading;

  // ========================================
  // 7. GIAO DIỆN MODAL
  // ========================================
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm transition-opacity sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết thanh toán"
    >
      {/* BACKDROP */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* MODAL */}
      <div className="relative z-10 my-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Chi tiết thanh toán
            </h3>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Mã thanh toán: {payment.paymentCode}
            </p>
          </div>

          <button
            type="button"
            aria-label="Đóng chi tiết thanh toán"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-5 overflow-y-auto p-6">
          {/* ĐANG TẢI CHI TIẾT */}
          {isLoading && (
            <p className="text-xs text-slate-500">
              Đang tải thông tin giao dịch...
            </p>
          )}

          {/* LỖI API */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
            >
              {error}
            </div>
          )}

          {/* LỖI PDF */}
          {downloadError && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
            >
              {downloadError}
            </div>
          )}

          {/* MÃ THANH TOÁN + TRẠNG THÁI */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <CreditCard className="h-4 w-4" />
              </div>

              <span className="break-all text-sm font-bold text-slate-800">
                {payment.paymentCode}
              </span>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* THÔNG TIN GIAO DỊCH */}
          <div className="space-y-3.5 text-xs">
            {/* MÃ BOOKING */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Mã booking</span>

              <span className="text-right font-semibold text-emerald-600">
                {payment.booking?.bookingCode || "—"}
              </span>
            </div>

            {/* KHÁCH HÀNG */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Khách hàng</span>

              <div className="flex items-start gap-2 text-right">
                {payment.customer?.avatar ? (
                  <img
                    src={payment.customer.avatar}
                    alt={customerName}
                    className="h-6 w-6 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                )}

                <div>
                  <p className="font-semibold text-slate-800">{customerName}</p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {payment.customer?.phone || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* CƠ SỞ */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Cơ sở</span>

              <span className="text-right font-semibold text-slate-800">
                {payment.business?.name || "—"}
              </span>
            </div>

            {/* SỐ TIỀN */}
            <div className="flex items-center justify-between gap-4 border-y border-slate-100 py-3.5">
              <span className="font-medium text-slate-400">
                Số tiền thanh toán
              </span>

              <span className="text-xl font-bold text-emerald-600">
                {formatMoney(payment.amount)}
              </span>
            </div>

            {/* PHƯƠNG THỨC */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Phương thức</span>

              <span
                className={`rounded px-2 py-1 text-right font-semibold ${method.className}`}
              >
                {method.label}
              </span>
            </div>

            {/* MÃ GIAO DỊCH */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">
                Mã tham chiếu cổng
              </span>

              <span className="break-all text-right font-medium text-slate-700">
                {payment.transactionId || "—"}
              </span>
            </div>

            {/* NHÀ CUNG CẤP */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Nhà cung cấp</span>

              <span className="text-right font-semibold text-slate-700">
                {payment.provider || "—"}
              </span>
            </div>

            {/* NGÀY TẠO */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">
                Ngày tạo giao dịch
              </span>

              <span className="text-right font-medium text-slate-700">
                {formatDateTime(payment.createdAt)}
              </span>
            </div>

            {/* NGÀY THANH TOÁN */}
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-400">Ngày thanh toán</span>

              <span className="text-right font-medium text-slate-700">
                {paidAt}
              </span>
            </div>

            {/* THÔNG TIN THẤT BẠI */}
            {payment.status === "FAILED" && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-slate-400">
                    Thời gian thất bại
                  </span>

                  <span className="text-right font-medium text-slate-700">
                    {formatDateTime(payment.failedAt)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-slate-400">
                    Lý do thất bại
                  </span>

                  <span className="max-w-[65%] text-right text-rose-600">
                    {payment.failureReason || "Chưa có lý do"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={!canDownload}
              title={
                payment.status !== "PAID"
                  ? "Chỉ giao dịch đã thanh toán mới được tải PDF"
                  : "Tải phiếu xác nhận thanh toán"
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" />

              {isDownloading ? "Đang tạo PDF..." : "Tải PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
