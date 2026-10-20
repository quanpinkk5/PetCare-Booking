import { useNavigate } from "react-router-dom";
import {
    Check,
    Headphones,
    CalendarCheck,
    FileText,
    Home,
    PhoneCall,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

export default function PaymentModal({ modalInfo, onClose }) {
    const navigate = useNavigate();

    if (!modalInfo) return null;

    const isSuccess = modalInfo.type === "success";

    const handleClose = () => {
        onClose();
        if (isSuccess) {
            navigate("/my-bookings");
        }
    };

    const handleGoToBookings = () => {
        onClose();
        navigate("/my-bookings");
    };

    const handleGoToInvoice = () => {
        onClose();
        const code = modalInfo.bookingCode || "BK20260825001";
        navigate(`/billing?bookingId=${code}`);
    };

    const handleGoHome = () => {
        onClose();
        navigate("/");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) handleClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-modal-title"
                className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center"
            >
                {/* Status Icon */}
                <div
                    className={`mx-auto flex h-18 w-18 items-center justify-center rounded-3xl shadow-lg transition-transform ${
                        isSuccess
                            ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/25 scale-105"
                            : "bg-blue-100 text-blue-600"
                    }`}
                >
                    {isSuccess ? (
                        <Check size={36} strokeWidth={3} />
                    ) : (
                        <Headphones size={36} />
                    )}
                </div>

                <h2
                    id="payment-modal-title"
                    className="mt-5 text-xl font-extrabold text-slate-800 tracking-tight"
                >
                    {modalInfo.title}
                </h2>

                <p className="mt-2.5 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
                    {modalInfo.message}
                </p>

                {/* Booking & Invoice Highlight Box */}
                {isSuccess && modalInfo.bookingCode && (
                    <div className="mt-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-4 border border-emerald-200/80 text-center space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Mã đặt lịch:</span>
                            <span className="font-mono font-bold text-slate-800 text-sm">
                                {modalInfo.bookingCode}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-emerald-100">
                            <span>Trạng thái:</span>
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                <Sparkles size={12} />
                                Đã xác nhận & Thanh toán
                            </span>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                {isSuccess ? (
                    <div className="mt-6 flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={handleGoToInvoice}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 font-bold text-white shadow-sm shadow-emerald-600/20 transition cursor-pointer text-xs sm:text-sm"
                        >
                            <FileText size={17} />
                            <span>Xem hóa đơn điện tử</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGoToBookings}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 font-bold text-emerald-800 border border-emerald-200 transition cursor-pointer text-xs sm:text-sm"
                        >
                            <CalendarCheck size={17} />
                            <span>Quản lý lịch đặt của tôi</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGoHome}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        >
                            <Home size={16} />
                            <span>Về trang chủ</span>
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-2.5">
                        <a
                            href="tel:19006868"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 font-bold text-white shadow-sm transition text-xs sm:text-sm"
                        >
                            <PhoneCall size={16} />
                            <span>Gọi hotline: 1900 6868</span>
                        </a>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Hệ thống bảo vệ giao dịch PetCare Protect</span>
                </div>
            </div>
        </div>
    );
}