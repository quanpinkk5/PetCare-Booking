import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

import PaymentBanner from "../../components/Payment/PaymentBanner";
import BookingSummary from "../../components/Payment/BookingSummary";
import PaymentStepper from "../../components/Payment/PaymentStepper";
import PaymentMethods from "../../components/Payment/PaymentMethods";
import PayerInfo from "../../components/Payment/PayerInfo";
import DiscountCode from "../../components/Payment/DiscountCode";
import PaymentBreakdown from "../../components/Payment/PaymentBreakdown";
import PaymentSidebar from "../../components/Payment/PaymentSidebar";
import PaymentModal from "../../components/Payment/PaymentModal";
import { getBookingById } from "../../services/mockBookings";

import {
  bookingData as defaultBookingData,
  discountCodes,
} from "../../data/paymentData";

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const [selectedMethod, setSelectedMethod] = useState("vnpay");

  const [invoiceNote, setInvoiceNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);

  // Resolve booking data from navigation state, route params, or default mock
  const booking = useMemo(() => {
    if (location.state?.booking) {
      const stateBooking = location.state.booking;
      return {
        bookingCode: stateBooking.bookingCode || stateBooking.id || defaultBookingData.bookingCode,
        petName: stateBooking.petName || stateBooking.pet?.name || defaultBookingData.petName,
        petBreed: stateBooking.petBreed || stateBooking.pet?.breed || stateBooking.breed || defaultBookingData.petBreed,
        serviceName: stateBooking.serviceName || stateBooking.service?.name || stateBooking.service || defaultBookingData.serviceName,
        facilityName: stateBooking.facilityName || stateBooking.facility?.name || stateBooking.location || defaultBookingData.facilityName,
        bookingDate: stateBooking.bookingDate || stateBooking.date || defaultBookingData.bookingDate,
        bookingTime: stateBooking.bookingTime || stateBooking.time || defaultBookingData.bookingTime,
        customerName: stateBooking.customerName || defaultBookingData.customerName,
        customerPhone: stateBooking.customerPhone || defaultBookingData.customerPhone,
        customerEmail: stateBooking.customerEmail || defaultBookingData.customerEmail,
        basePrice: stateBooking.basePrice || (stateBooking.totalPrice || stateBooking.price ? parseInt(String(stateBooking.totalPrice || stateBooking.price).replace(/\D/g, ""), 10) : defaultBookingData.basePrice),
        platformFee: stateBooking.platformFee ?? defaultBookingData.platformFee,
      };
    }

    if (id) {
      const found = getBookingById(id);
      if (found) {
        return {
          bookingCode: found.id || id,
          petName: found.pet?.name || defaultBookingData.petName,
          petBreed: found.pet?.breed || defaultBookingData.petBreed,
          serviceName: found.service?.name || defaultBookingData.serviceName,
          facilityName: found.facility?.name || defaultBookingData.facilityName,
          bookingDate: found.date || defaultBookingData.bookingDate,
          bookingTime: found.time || defaultBookingData.bookingTime,
          customerName: defaultBookingData.customerName,
          customerPhone: defaultBookingData.customerPhone,
          customerEmail: defaultBookingData.customerEmail,
          basePrice: found.totalPrice ? parseInt(found.totalPrice.replace(/\D/g, ""), 10) : defaultBookingData.basePrice,
          platformFee: defaultBookingData.platformFee,
        };
      }
    }

    return defaultBookingData;
  }, [location.state, id]);

  const { basePrice, platformFee } = booking;

  const finalTotal = Math.max(
    0,
    basePrice + platformFee - appliedDiscount
  );

  const handleApplyDiscount = () => {
    const normalizedCode = discountCode.trim().toUpperCase();

    setDiscountError("");
    setDiscountSuccess("");

    if (!normalizedCode) {
      setDiscountError("Vui lòng nhập mã giảm giá.");
      return;
    }

    const discount = discountCodes[normalizedCode];

    if (discount === undefined) {
      setAppliedDiscount(0);
      setDiscountError("Mã giảm giá không hợp lệ.");
      return;
    }

    const actualDiscount = Math.min(discount, basePrice + platformFee);

    setAppliedDiscount(actualDiscount);
    setDiscountCode(normalizedCode);
    setDiscountSuccess(
      `Áp dụng mã thành công. Bạn được giảm ${formatCurrency(actualDiscount)}.`
    );
  };

  const handlePayment = () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Demo giao diện: hoàn tất thanh toán
    window.setTimeout(() => {
      setIsProcessing(false);

      setModalInfo({
        type: "success",
        title: "Đã hoàn tất bước thanh toán!",
        message:
          `Phương thức: ${selectedMethod.toUpperCase()}\n` +
          `Số tiền: ${formatCurrency(finalTotal)}\n` +
          `Ghi chú: ${invoiceNote || "Không có"}`,
        bookingCode: booking.bookingCode,
      });
    }, 800);
  };

  const handleOpenSupport = () => {
    setModalInfo({
      type: "support",
      title: "Liên hệ hỗ trợ PetCare",
      message:
        "Hotline: 1900 8888\nEmail: support@petcare.vn\n\nVui lòng cung cấp mã đặt lịch khi liên hệ.",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Quay lại</span>
          </button>
          <span className="text-xs text-slate-400">Bước 3 / 4: Xác nhận thanh toán</span>
        </div>

        <PaymentBanner />

        <PaymentStepper isCompleted={modalInfo?.type === "success"} />

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <BookingSummary booking={booking} />

            <PaymentMethods
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
            />

            <PayerInfo
              booking={booking}
              invoiceNote={invoiceNote}
              onNoteChange={setInvoiceNote}
            />

            <DiscountCode
              discountCode={discountCode}
              onDiscountCodeChange={setDiscountCode}
              onApplyDiscount={handleApplyDiscount}
              discountError={discountError}
              discountSuccess={discountSuccess}
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800">
                Xác nhận thanh toán
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Vui lòng kiểm tra lại thông tin đặt lịch và số tiền trước khi
                tiếp tục.
              </p>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayment}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Xác nhận thanh toán</span>
                    <span className="ml-1">
                      {formatCurrency(finalTotal)}
                    </span>
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Hệ thống hỗ trợ thanh toán bảo mật 256-bit SSL.
              </p>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <PaymentBreakdown
              basePrice={basePrice}
              platformFee={platformFee}
              appliedDiscount={appliedDiscount}
              finalTotal={finalTotal}
            />

            <PaymentSidebar onOpenSupport={handleOpenSupport} />
          </aside>
        </div>
      </div>

      <PaymentModal
        modalInfo={modalInfo}
        onClose={() => setModalInfo(null)}
      />
    </main>
  );
}