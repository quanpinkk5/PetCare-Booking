import { canPayBooking } from '../../services/bookingPayment.js';
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";

import BookingSummary from "../../components/Payment/BookingSummary";
import PaymentStepper from "../../components/Payment/PaymentStepper";
import PaymentMethods from "../../components/Payment/PaymentMethods";
import DiscountCode from "../../components/Payment/DiscountCode";
import PaymentBreakdown from "../../components/Payment/PaymentBreakdown";
import PaymentSidebar from "../../components/Payment/PaymentSidebar";
import PaymentModal from "../../components/Payment/PaymentModal";
import { bookingApi } from "../../services/bookingApi.js";
import { bookingDetailData } from "../../services/bookingData.js";
import { paymentApi, startVnpayPayment } from "../../services/paymentApi.js";
import { useAuth } from "../../../../context/AuthContext";

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function Payment() {
  const { id } = useParams();
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();
  const bookingId = id || new URLSearchParams(location.search).get("bookingId")
    || location.state?.booking?.recordId || location.state?.booking?._id || location.state?.booking?.id || "";
  if (isAuthLoading) return <main className="p-8" role="status">Đang khôi phục phiên đăng nhập…</main>;
  if (!user) return <Navigate to="/login" replace state={{ from: { pathname: location.pathname + location.search } }} />;
  if (user.role !== "CUSTOMER") return <Navigate to="/" replace />;
  if (!/^[a-f\d]{24}$/i.test(bookingId)) return <main className="p-8"><p role="alert">Vui lòng chọn lịch đặt cần thanh toán.</p><Link to="/my-bookings" className="text-teal-700">Lịch đặt của tôi</Link></main>;
  return <BookingPayment key={(user._id || user.id) + ':' + bookingId} bookingId={bookingId} />;
}

function BookingPayment({ bookingId }) {
  const navigate = useNavigate();
  const [result, setResult] = useState({ booking: null, status: null, error: "" });
  const [attempt, setAttempt] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [modalInfo, setModalInfo] = useState(null);
  const submission = useRef(false);
  const selectedMethod = "vnpay";
  const appliedDiscount = 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    let cancelled = false;
    Promise.all([bookingApi.detail(bookingId), paymentApi.status(bookingId)])
      .then(([detail, status]) => {
        if (!detail.data || !Number.isSafeInteger(status.data?.totalPrice) || status.data.totalPrice <= 0) {
          throw new Error("Thông tin thanh toán không hợp lệ.");
        }
        if (!cancelled) setResult({ booking: detail.data, status: status.data, error: "" });
      }).catch((error) => {
        if (!cancelled) setResult({ booking: null, status: null, error: error.message || "Không thể tải thông tin thanh toán." });
      });
    return () => { cancelled = true; };
  }, [bookingId, attempt]);

  const handlePayment = async () => {
    if (submission.current) return;
    submission.current = true;
    setIsProcessing(true);
    setPaymentError("");
    try {
      const data = await startVnpayPayment(bookingId);
      if (data.paymentUrl) window.location.assign(data.paymentUrl);
      else navigate('/payment-result?bookingId=' + encodeURIComponent(bookingId));
    } catch (error) {
      setPaymentError(error.message || "Không thể tạo thanh toán. Vui lòng kiểm tra trạng thái trước khi thử lại.");
    } finally {
      submission.current = false;
      setIsProcessing(false);
    }
  };

  if (!result.booking) return <main className="min-h-screen bg-slate-50/70 px-4 py-6 md:px-8 md:py-10">
    <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-8">
      <p role={result.error ? "alert" : "status"}>{result.error || "Đang tải thông tin thanh toán…"}</p>
      {result.error && <button type="button" onClick={() => { setResult({ booking: null, status: null, error: "" }); setAttempt((value) => value + 1); }} className="mt-4 mr-4 text-teal-700">Thử lại</button>}
      <Link to="/my-bookings" className="mt-4 inline-block text-teal-700">Lịch đặt của tôi</Link>
    </div>
  </main>;

  const detail = bookingDetailData(result.booking);
  const booking = {
    bookingCode: result.status.bookingCode,
    petName: detail.pet.name, petBreed: detail.pet.breed,
    serviceName: detail.service.name, serviceDescription: detail.service.desc,
    facilityName: detail.facility.name, facilityAddress: detail.facility.address,
    facilityPhone: detail.facility.phone, bookingDate: detail.date, bookingTime: detail.time,
    paymentStatus: result.status.paymentStatus,
  };
  // Backend totalPrice already contains the booking's full payable amount.
  const basePrice = result.status.totalPrice;
  const platformFee = 0;
  const finalTotal = basePrice;
  const canPay = canPayBooking(result.status.bookingStatus, result.status.paymentStatus);
  const handleApplyDiscount = () => setDiscountError("Mã giảm giá hiện chưa được hỗ trợ cho thanh toán VNPay.");
  const handleRemoveDiscount = () => { setDiscountCode(""); setDiscountError(""); };

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
        <PaymentStepper isCompleted={result.status.paymentStatus === "PAID"} />

        {/* 3. Main 2-Column Grid Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Left Column (2 Cols) - Forms & Selections */}
          <div className="space-y-6 lg:col-span-2">
            {/* Booking Details Summary */}
            <BookingSummary booking={booking} />

            {/* Payment Method Selector & Interactive sub-panels */}
            <PaymentMethods
              selectedMethod={selectedMethod}
              onSelectMethod={() => {}}
              enabledMethods={["vnpay"]}
              disabled={isProcessing}
              bookingCode={booking.bookingCode}
              finalTotal={finalTotal}
            />

            {/* Discount Coupons & Vouchers */}
            <DiscountCode
              discountCode={discountCode}
              onDiscountCodeChange={setDiscountCode}
              onApplyDiscount={handleApplyDiscount}
              discountError={discountError}
              discountSuccess=""
              disabled
              coupons={[]}
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

              {paymentError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{paymentError}</p>}
              {!canPay && <p role="status" className="text-sm text-amber-700">{result.status.paymentStatus === "PAID" ? "Lịch đặt đã được thanh toán." : result.status.bookingStatus === "PENDING" ? "Vui lòng chờ cơ sở xác nhận lịch đặt trước khi thanh toán." : "Lịch đặt không còn ở trạng thái có thể thanh toán."}</p>}
              <Link to={'/payment-result?bookingId=' + encodeURIComponent(bookingId)} className="inline-block text-sm font-semibold text-teal-700">Kiểm tra trạng thái thanh toán</Link>
              {/* Big CTA Button */}
              {canPay && <button
                type="button"
                disabled={isProcessing || !canPay}
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
              </button>}

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
                  <span>Thanh toán qua VNPay</span>
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