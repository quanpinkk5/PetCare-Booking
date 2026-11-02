import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    CreditCard,
    MessageCircle,
    XCircle,
    Star,
    RotateCcw,
    ShieldCheck,
    Receipt,
    AlertTriangle,
    X,
    BookOpen,
} from "lucide-react";

const BookingOverview = ({ booking, onCancel }) => {
    const navigate = useNavigate();
    const bookingId = booking.recordId || booking.id;
    const messageUrl = booking.businessId ? `/messages?businessId=${encodeURIComponent(booking.businessId)}` : null;
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("busy");
    const [isCancelling, setIsCancelling] = useState(false);

    const statusType =
        booking.statusType ||
        (booking.status?.toLowerCase().includes("chờ")
            ? "pending"
            : booking.status?.toLowerCase().includes("đã xác nhận")
            ? "confirmed"
            : booking.status?.toLowerCase().includes("đang thực hiện")
            ? "in-progress"
            : booking.status?.toLowerCase().includes("hoàn thành")
            ? "completed"
            : booking.status?.toLowerCase().includes("hủy")
            ? "cancelled"
            : "pending");

    const confirmCancel = async () => {
        if (isCancelling) return;
        setIsCancelling(true);
        try {
            await onCancel(cancelReason);
            setIsCancelModalOpen(false);
        } catch {
            // Error handled by parent
        } finally {
            setIsCancelling(false);
        }
    };

    const renderActionButtons = () => {
        switch (statusType) {
            case "pending":
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-xs text-slate-500">{booking.paymentStatus === "PAID" ? "Đã thanh toán · Chờ cơ sở xác nhận lịch" : "Vui lòng chờ cơ sở xác nhận lịch đặt trước khi thanh toán."}</p>

                        <button
                            type="button"
                            onClick={() => setIsCancelModalOpen(true)}
                            className="w-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer"
                        >
                            <XCircle size={14} />
                            <span>Hủy lịch đặt</span>
                        </button>
                    </div>
                );

            case "confirmed": // 2. Đã xác nhận: [ Thanh toán / Đã thanh toán ] & [ Chat ] & [ Hủy lịch có điều kiện ]
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            disabled={booking.paymentStatus === "PAID" || booking.paymentStatus === "REFUNDED"}
                            onClick={() => navigate(`/payment/${bookingId}`, { state: { booking } })}
                            className={`w-full font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs whitespace-nowrap ${
                                booking.paymentStatus === "PAID" || booking.paymentStatus === "REFUNDED"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            }`}
                        >
                            <CreditCard size={15} />
                            <span>
                                {booking.paymentStatus === "PAID"
                                    ? "✓ Đã thanh toán thành công"
                                    : booking.paymentStatus === "REFUNDED"
                                    ? "Đã hoàn tiền"
                                    : "Thanh toán dịch vụ"}
                            </span>
                        </button>

                        <button
                            type="button"
                            disabled={!messageUrl}
                            title={messageUrl ? "Nhắn tin với cơ sở của lịch đặt" : "Không còn thông tin cơ sở để nhắn tin"}
                            onClick={() => messageUrl && navigate(messageUrl)}
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MessageCircle size={14} />
                            <span>Nhắn tin với cơ sở</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCancelModalOpen(true)}
                            className="w-full bg-transparent hover:bg-rose-50/60 text-slate-400 hover:text-rose-600 font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-[11px] cursor-pointer"
                        >
                            <XCircle size={13} />
                            <span>Yêu cầu hủy lịch</span>
                        </button>
                    </div>
                );

            case "in-progress": // 3. Đang thực hiện: [ Xem Pet Diary ] & [ Chat với cơ sở ]
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => navigate(`/my-bookings/${bookingId}/diary`)}
                            className="w-full bg-[#009879] hover:bg-[#008066] text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
                        >
                            <BookOpen size={15} />
                            <span>Xem nhật ký Pet Diary</span>
                        </button>

                        <button
                            type="button"
                            disabled={!messageUrl}
                            title={messageUrl ? "Nhắn tin với cơ sở của lịch đặt" : "Không còn thông tin cơ sở để nhắn tin"}
                            onClick={() => messageUrl && navigate(messageUrl)}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MessageCircle size={15} />
                            <span>Chat với cơ sở</span>
                        </button>
                        <p className="text-[11px] text-center text-slate-400 italic">
                            Dịch vụ đang thực hiện, không thể hủy lịch
                        </p>
                    </div>
                );

            case "completed": // 4. Hoàn thành: [ Xem Pet Diary ], [ Đánh giá dịch vụ ], [ Hóa đơn điện tử ] & [ Đặt lại ]
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => navigate(`/my-bookings/${bookingId}/diary`)}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#009879] border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition text-xs cursor-pointer"
                        >
                            <BookOpen size={15} />
                            <span>Xem lại Pet Diary của bé</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`/reviews?bookingId=${bookingId}&action=write`)}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
                        >
                            <Star size={15} className="fill-white" />
                            <span>Đánh giá dịch vụ</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`/billing?bookingId=${bookingId}`)}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition text-xs cursor-pointer"
                        >
                            <Receipt size={14} />
                            <span>Xem hóa đơn điện tử</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/booking")}
                            className="w-full bg-white hover:bg-teal-50 text-teal-700 border border-teal-300 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition text-xs cursor-pointer"
                        >
                            <RotateCcw size={14} />
                            <span>Đặt lại lịch này</span>
                        </button>
                    </div>
                );

            case "cancelled":
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => navigate("/booking")}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
                        >
                            <RotateCcw size={14} />
                            <span>Đặt lại lịch</span>
                        </button>

                        <button
                            type="button"
                            disabled={!messageUrl}
                            title={messageUrl ? "Nhắn tin với cơ sở của lịch đặt" : "Không còn thông tin cơ sở để nhắn tin"}
                            onClick={() => messageUrl && navigate(messageUrl)}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MessageCircle size={14} />
                            <span>Chat với cơ sở</span>
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            disabled={!messageUrl}
                            title={messageUrl ? "Nhắn tin với cơ sở của lịch đặt" : "Không còn thông tin cơ sở để nhắn tin"}
                            onClick={() => messageUrl && navigate(messageUrl)}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MessageCircle size={15} />
                            <span>Chat với cơ sở</span>
                        </button>
                    </div>
                );
        }
    };

    return (
        <>
            <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Receipt size={15} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">
                            Thanh toán & Hành động
                        </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {booking.id}
                    </span>
                </div>

                {/* Appointment date & time highlight */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                            <CalendarDays size={13} className="text-emerald-600" />
                            Ngày hẹn:
                        </span>
                        <span className="font-bold text-slate-800">
                            {booking.date}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                            <Clock size={13} className="text-emerald-600" />
                            Khung giờ:
                        </span>
                        <span className="font-bold text-emerald-700">
                            {booking.time}
                        </span>
                    </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-xs mb-4">
                    <div className="flex items-center justify-between text-slate-600">
                        <span>Giá dịch vụ niêm yết:</span>
                        <span className="font-medium text-slate-800">{booking.totalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                        <span>Phí khử trùng & vệ sinh:</span>
                        <span className="text-emerald-600 font-semibold">Miễn phí</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                        <span>Ưu đãi áp dụng:</span>
                        <span className="text-slate-400">0đ</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between font-bold text-sm">
                        <span className="text-slate-800">Tổng thanh toán:</span>
                        <span className="text-emerald-700 text-base">{booking.totalPrice}</span>
                    </div>
                </div>

                {/* Action buttons */}
                {renderActionButtons()}

                {/* Guarantee note */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Cam kết chất lượng dịch vụ & hoàn tiền nếu có sự cố</span>
                </div>
            </section>

            {/* Modal xác nhận hủy lịch */}
            {isCancelModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
                    onClick={() => setIsCancelModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsCancelModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base">
                                    Xác nhận hủy lịch đặt #{booking.id}
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Hành động này không thể hoàn tác sau khi xác nhận
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                Lý do hủy lịch:
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: "busy", label: "Tôi bận việc đột xuất không thể đến" },
                                    { value: "changed_mind", label: "Muốn đổi ngày/giờ hẹn khác" },
                                    { value: "pet_sick", label: "Thú cưng không khỏe/không phù hợp" },
                                    { value: "other", label: "Lý do khác" },
                                ].map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                                            cancelReason === opt.value
                                                ? "border-rose-300 bg-rose-50/50 text-rose-900 font-semibold"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="cancel_reason"
                                            value={opt.value}
                                            checked={cancelReason === opt.value}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            className="text-rose-600 focus:ring-rose-500"
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80 mb-5 text-[11px] text-amber-800 space-y-1">
                            <p className="font-bold">Chính sách hủy lịch:</p>
                            <p>• Hủy trước 24h: Hoàn tiền 100% về ví/tài khoản thanh toán ban đầu.</p>
                            <p>• Hủy sau 24h hoặc vắng mặt: Có thể áp dụng phí hủy dịch vụ 20%.</p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                            >
                                Đóng lại
                            </button>
                            <button
                                type="button"
                                onClick={confirmCancel}
                                disabled={isCancelling}
                                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                            >
                                {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingOverview;
