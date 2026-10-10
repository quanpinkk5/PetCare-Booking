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
} from "lucide-react";

const BookingOverview = ({ booking }) => {
    const navigate = useNavigate();
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

    const confirmCancel = () => {
        setIsCancelling(true);
        setTimeout(() => {
            setIsCancelling(false);
            setIsCancelModalOpen(false);
            alert("Đã gửi yêu cầu hủy lịch hẹn thành công!");
            navigate("/my-bookings");
        }, 500);
    };

    const renderActionButtons = () => {
        switch (statusType) {
            case "pending": // 1. Chờ xác nhận: Chỉ hiện "Chat với cơ sở" & "Hủy lịch", tuyệt đối giấu "Thanh toán"
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => navigate("/messages")}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer shadow-2xs"
                        >
                            <MessageCircle size={15} />
                            <span>Chat với cơ sở</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCancelModalOpen(true)}
                            className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer shadow-2xs"
                        >
                            <XCircle size={15} />
                            <span>Hủy lịch</span>
                        </button>
                    </div>
                );

            case "confirmed": // 2. Đã xác nhận: "Thanh toán ngay" (xanh lá) trên cùng, "Chat" giữ nguyên, "Hủy lịch" chìm xuống (hài hòa, không vỡ layout)
                return (
                    <div className="flex flex-col gap-2.5 w-full">
                        <button
                            type="button"
                            onClick={() => alert(`Chuyển đến thanh toán cho đơn hàng ${booking.id} (${booking.totalPrice})`)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
                        >
                            <CreditCard size={15} />
                            <span>Thanh toán ngay</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/messages")}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer shadow-2xs"
                        >
                            <MessageCircle size={15} />
                            <span>Chat với cơ sở</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCancelModalOpen(true)}
                            className="w-full bg-slate-50/70 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer group"
                        >
                            <XCircle size={14} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                            <span>Hủy lịch hẹn</span>
                        </button>
                    </div>
                );

            case "in-progress": // 3. Đang thực hiện: Ẩn hoàn toàn "Hủy lịch", chỉ giữ lại duy nhất "Chat với cơ sở"
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => navigate("/messages")}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
                        >
                            <MessageCircle size={15} />
                            <span>Chat với cơ sở</span>
                        </button>
                        <p className="text-[11px] text-center text-slate-400 italic">
                            Dịch vụ đang thực hiện, không thể hủy lịch
                        </p>
                    </div>
                );

            case "completed": // 4. Hoàn thành: Cụm cũ biến mất, thay bằng "Đánh giá dịch vụ" (nổi bật) & "Đặt lại lịch này"
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => alert(`Mở giao diện đánh giá dịch vụ cho đơn hàng ${booking.id}`)}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
                        >
                            <Star size={15} className="fill-white" />
                            <span>Đánh giá dịch vụ</span>
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
                            onClick={() => navigate("/messages")}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer"
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
                            onClick={() => navigate("/messages")}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer"
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
                        <span>Ưu đãi thành viên:</span>
                        <span className="text-slate-500">-0đ</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="font-bold text-slate-800 text-sm">Tổng thanh toán:</span>
                        <span className="font-extrabold text-emerald-600 text-lg">
                            {booking.totalPrice}
                        </span>
                    </div>
                </div>

                {/* Actions cluster */}
                <div className="pt-1 mb-3">
                    {renderActionButtons()}
                </div>

                {/* Security pledge */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Bảo chứng bởi PetCare Booking</span>
                </div>
            </section>

            {/* Cancel Booking Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div
                        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                    <AlertTriangle size={18} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-base leading-tight">
                                        Xác nhận hủy lịch hẹn
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        Mã lịch hẹn: {booking.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-3.5 text-xs text-slate-600">
                            {/* Summary info */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Dịch vụ:</span>
                                    <span className="font-semibold text-slate-800">{booking.service?.name || "Chăm sóc thú cưng"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Thời gian:</span>
                                    <span className="font-semibold text-slate-800">{booking.time} - {booking.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Cơ sở:</span>
                                    <span className="font-semibold text-slate-800">{booking.facility?.name || "Hệ thống PetCare"}</span>
                                </div>
                            </div>

                            {/* Policy reminder box */}
                            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-amber-800 text-[11px] leading-relaxed">
                                <p className="font-semibold mb-1 flex items-center gap-1.5">
                                    <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                                    Chính sách hủy đơn:
                                </p>
                                <span>
                                    {statusType === "confirmed"
                                        ? "Đơn hàng đã được cơ sở tiếp nhận. Khi hủy trước 24 giờ hẹn, bạn sẽ được hoàn trả 100% chi phí theo quy chuẩn của PetCare."
                                        : "Đơn hàng đang chờ cơ sở duyệt. Bạn có thể hủy miễn phí ngay bây giờ."}
                                </span>
                            </div>

                            {/* Reason select */}
                            <div>
                                <label className="block font-semibold text-slate-700 text-xs mb-2">
                                    Vui lòng chọn lý do hủy lịch:
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { id: "busy", label: "Có việc bận đột xuất / Thay đổi kế hoạch" },
                                        { id: "reschedule", label: "Muốn dời sang ngày hoặc khung giờ khác" },
                                        { id: "pet_sick", label: "Thú cưng gặp vấn đề sức khỏe chưa thể đi" },
                                        { id: "other_branch", label: "Đặt nhầm cơ sở hoặc tìm được chỗ gần hơn" },
                                        { id: "other", label: "Lý do khác" },
                                    ].map((reason) => (
                                        <label
                                            key={reason.id}
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                                                cancelReason === reason.id
                                                    ? "bg-rose-50/60 border-rose-300 text-slate-800"
                                                    : "bg-slate-50/60 border-slate-200/80 text-slate-600 hover:bg-slate-100/60"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                value={reason.id}
                                                checked={cancelReason === reason.id}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                className="accent-rose-600 text-rose-600 cursor-pointer"
                                            />
                                            <span className="text-xs font-medium">{reason.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                            >
                                Giữ lại lịch hẹn
                            </button>
                            <button
                                type="button"
                                disabled={isCancelling}
                                onClick={confirmCancel}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {isCancelling ? "Đang xử lý..." : "Xác nhận hủy lịch"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingOverview;