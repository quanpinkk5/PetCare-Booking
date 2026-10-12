import { useNavigate } from "react-router-dom";
import { Check, Headphones, CalendarCheck, FileText, Home } from "lucide-react";

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

    const handleGoToDetail = () => {
        onClose();
        const code = modalInfo.bookingCode || "BK20260825001";
        navigate(`/booking-detail/${code}`);
    };

    const handleGoHome = () => {
        onClose();
        navigate("/");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) handleClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-modal-title"
                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            >
                <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isSuccess
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                >
                    {isSuccess ? (
                        <Check size={32} strokeWidth={2.5} />
                    ) : (
                        <Headphones size={32} />
                    )}
                </div>

                <h2
                    id="payment-modal-title"
                    className="mt-5 text-center text-xl font-bold text-slate-800"
                >
                    {modalInfo.title}
                </h2>

                <p className="mt-3 whitespace-pre-line text-center text-sm leading-6 text-slate-600">
                    {modalInfo.message}
                </p>

                {modalInfo.bookingCode && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4 text-center border border-slate-100">
                        <p className="text-xs text-slate-500">Mã đặt lịch</p>
                        <p className="mt-1 font-bold text-emerald-700 text-lg">
                            {modalInfo.bookingCode}
                        </p>
                    </div>
                )}

                {isSuccess ? (
                    <div className="mt-6 flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={handleGoToBookings}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 cursor-pointer shadow-sm"
                        >
                            <CalendarCheck size={18} />
                            <span>Xem danh sách lịch hẹn</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGoToDetail}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                        >
                            <FileText size={18} />
                            <span>Xem chi tiết lịch đặt</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGoHome}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        >
                            <Home size={18} />
                            <span>Về trang chủ</span>
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
                    >
                        Đóng
                    </button>
                )}
            </div>
        </div>
    );
}