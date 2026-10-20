import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

import PaymentBanner from "../../components/Payment/PaymentBanner";
import BookingSummary from "../../components/Payment/BookingSummary";
import PaymentStepper from "../../components/Payment/PaymentStepper";
import PaymentMethods from "../../components/Payment/PaymentMethods";
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
        facilityAddress: stateBooking.facilityAddress || stateBooking.facility?.address || defaultBookingData.facilityAddress,
        facilityPhone: stateBooking.facilityPhone || stateBooking.facility?.phone || defaultBookingData.facilityPhone,
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
          facilityAddress: found.facility?.address || defaultBookingData.facilityAddress,
          facilityPhone: found.facility?.phone || defaultBookingData.facilityPhone,
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

  const handleApplyDiscount = (overrideCode) => {
    const codeToTest = (overrideCode || discountCode).trim().toUpperCase();

    setDiscountError("");
    setDiscountSuccess("");

    if (!codeToTest) {
      setDiscountError("Vui lòng nhập hoặc chọn mã giảm giá.");
      return;
    }

    const discount = discountCodes[codeToTest];

    if (discount === undefined) {
      setAppliedDiscount(0);
      setDiscountError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    const actualDiscount = Math.min(discount, basePrice + platformFee);

    setAppliedDiscount(actualDiscount);
    setDiscountCode(codeToTest);
    setDiscountSuccess(
      `Áp dụng mã ${codeToTest} thành công! Bạn tiết kiệm được ${formatCurrency(actualDiscount)}.`
    );
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(0);
    setDiscountCode("");
    setDiscountError("");
    setDiscountSuccess("");
  };

  const handlePayment = () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Mô phỏng xử lý thanh toán thực tế mượt mà
    window.setTimeout(() => {
      setIsProcessing(false);

      const methodNames = {
        vnpay: "VNPAY-QR",
        momo: "Ví điện tử MoMo",
        bank_transfer: "Chuyển khoản Napas247",
        cash: "Thanh toán tại cơ sở",
      };

      setModalInfo({
        type: "success",
        title: "Xác nhận thanh toán thành công!",
        message:
          `Phương thức: ${methodNames[selectedMethod] || selectedMethod.toUpperCase()}\n` +
          `Số tiền thanh toán: ${formatCurrency(finalTotal)}\n` +
          `Lịch hẹn chăm sóc cho bé ${booking.petName} đã được hệ thống ghi nhận.`,
        bookingCode: booking.bookingCode,
      });
    }, 900);
  };

  const handleOpenSupport = () => {
    setModalInfo({
      type: "support",
      title: "Bộ phận Chăm sóc & Hỗ trợ PetCare",
      message:
        "Tổng đài hỗ trợ 24/7: 1900 6868\nEmail: billing@petcare.vn\n\nChuyên viên tư vấn luôn sẵn sàng giải đáp mọi thắc mắc của bạn.",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 md:px-8 md:py-10 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition cursor-pointer self-start"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Quay lại trang trước</span>
          </button>

          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link to="/" className="hover:text-emerald-600 transition">Trang chủ</Link>
            <span>/</span>
            <Link to="/booking" className="hover:text-emerald-600 transition">Đặt lịch</Link>
            <span>/</span>
            <span className="text-emerald-700 font-bold">Thanh toán</span>
          </nav>
        </div>


        {/* 2. Interactive Stepper */}
        <PaymentStepper isCompleted={modalInfo?.type === "success"} />

        {/* 3. Main 2-Column Grid Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Left Column (2 Cols) - Forms & Selections */}
          <div className="space-y-6 lg:col-span-2">
            {/* Booking Details Summary */}
            <BookingSummary booking={booking} />

            {/* Payment Method Selector & Interactive sub-panels */}
            <PaymentMethods
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
              bookingCode={booking.bookingCode}
              finalTotal={finalTotal}
            />

            {/* Discount Coupons & Vouchers */}
            <DiscountCode
              discountCode={discountCode}
              onDiscountCodeChange={setDiscountCode}
              onApplyDiscount={handleApplyDiscount}
              discountError={discountError}
              discountSuccess={discountSuccess}
              appliedDiscount={appliedDiscount}
              onRemoveDiscount={handleRemoveDiscount}
            />

            {/* Final Confirmation CTA Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Xác nhận & Hoàn tất thanh toán
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Nhấn xác nhận để hoàn thành bước đặt lịch chăm sóc thú cưng an toàn.
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block">Số tiền cần thanh toán</span>
                  <span className="text-xl font-black text-emerald-700">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Big CTA Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayment}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 py-4 px-6 font-extrabold text-white text-sm sm:text-base shadow-md shadow-emerald-700/20 transition-all hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.005] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Đang mã hóa & xử lý giao dịch...</span>
                  </>
                ) : (
                  <>
                    <Lock size={19} />
                    <span>Xác nhận thanh toán</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/20 text-white font-mono font-bold text-sm">
                      {formatCurrency(finalTotal)}
                    </span>
                  </>
                )}
              </button>

              {/* Security badges & Partners */}
              <div className="pt-2 text-center space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck size={14} />
                    <span>Bảo mật SSL 256-bit</span>
                  </span>
                  <span>•</span>
                  <span>Hỗ trợ thẻ ATM / Visa / Mastercard</span>
                  <span>•</span>
                  <span>Ví điện tử VNPay / MoMo</span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Bằng việc bấm xác nhận, bạn đồng ý với{" "}
                  <a href="#" className="text-emerald-700 underline font-medium">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-emerald-700 underline font-medium">
                    Chính sách hoàn tiền
                  </a>{" "}
                  của PetCare Booking.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col) - Sticky Price Breakdown & Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <PaymentBreakdown
              basePrice={basePrice}
              platformFee={platformFee}
              appliedDiscount={appliedDiscount}
              finalTotal={finalTotal}
              discountCode={discountCode}
            />

            <PaymentSidebar onOpenSupport={handleOpenSupport} />
          </aside>
        </div>
      </div>

      {/* Success / Support Modal */}
      <PaymentModal
        modalInfo={modalInfo}
        onClose={() => setModalInfo(null)}
      />
    </main>
  );
}