import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    MapPin,
    Banknote,
    Eye,
    XCircle,
    CreditCard,
    MessageSquare,
    Star,
    RotateCcw,
} from "lucide-react";

const BookingCard = ({ booking }) => {
    const navigate = useNavigate();
    const ServiceIcon = booking.serviceIcon;
    const TimeIcon = booking.timeIcon;

    const handleViewDetail = () => {
        navigate(`/my-bookings/${booking.id}`);
    };

    const renderActionButtons = () => {
        const statusType =
            booking.statusType ||
            (booking.status === "Chờ xác nhận"
                ? "pending"
                : booking.status === "Đã xác nhận"
                ? "confirmed"
                : booking.status === "Đang thực hiện"
                ? "in-progress"
                : booking.status === "Hoàn thành"
                ? "completed"
                : booking.status === "Đã hủy"
                ? "cancelled"
                : "other");

        const viewDetailButton = (
            <button
                type="button"
                onClick={handleViewDetail}
                className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-teal-700 hover:border-teal-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
            >
                <Eye size={14} className="text-teal-600 shrink-0" />
                <span>Xem chi tiết</span>
            </button>
        );

        switch (statusType) {
            case "pending": // Chờ xác nhận: [ Xem chi tiết ] & [ Hủy yêu cầu ] (Viền đỏ hoặc xám đậm)
                return (
                    <div className="flex items-center gap-2 w-full">
                        {viewDetailButton}
                        <button
                            type="button"
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-rose-300 text-rose-600 bg-white hover:bg-rose-50 hover:border-rose-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                        >
                            <XCircle size={14} className="text-rose-500 shrink-0" />
                            <span>Hủy yêu cầu</span>
                        </button>
                    </div>
                );

            case "confirmed": // Đã xác nhận: [ Xem chi tiết ] & [ Thanh toán ngay ]
                return (
                    <div className="flex items-center gap-2 w-full">
                        {viewDetailButton}
                        <button
                            type="button"
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                            <CreditCard size={14} className="shrink-0" />
                            <span>Thanh toán ngay</span>
                        </button>
                    </div>
                );

            case "in-progress": // Đang thực hiện: [ Xem chi tiết ] & [ Chat ]
                return (
                    <div className="flex items-center gap-2 w-full">
                        {viewDetailButton}
                        <button
                            type="button"
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                        >
                            <MessageSquare size={14} className="text-teal-600 shrink-0" />
                            <span>Chat</span>
                        </button>
                    </div>
                );

            case "completed": // Hoàn thành: [ Xem chi tiết ] & [ Đánh giá ]
                return (
                    <div className="flex items-center gap-2 w-full">
                        {viewDetailButton}
                        <button
                            type="button"
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                        >
                            <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                            <span>Đánh giá</span>
                        </button>
                    </div>
                );

            case "cancelled": // Đã hủy: [ Xem chi tiết ] & [ Đặt lại ]
                return (
                    <div className="flex items-center gap-2 w-full">
                        {viewDetailButton}
                        <button
                            type="button"
                            onClick={() => navigate("/booking")}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                            <RotateCcw size={14} className="shrink-0" />
                            <span>Đặt lại</span>
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="flex items-center gap-2 w-full">
                        {viewDetailButton}
                    </div>
                );
        }
    };

    return (
        <article
            className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 transition-all shadow-sm ${booking.borderColor}`}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* Pet */}
                <div className="flex items-start gap-3.5 shrink-0">
                    <img
                        alt={booking.petName}
                        src={booking.img}
                        onClick={handleViewDetail}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    />

                    <div className="space-y-1">
                        <span
                            onClick={handleViewDetail}
                            className="text-xs font-bold text-teal-600 uppercase tracking-wider cursor-pointer hover:underline"
                        >
                            {booking.id}
                        </span>

                        <h3
                            onClick={handleViewDetail}
                            className="text-base font-bold text-slate-900 flex items-center gap-1.5 cursor-pointer hover:text-teal-700 transition-colors"
                        >
                            {booking.petName}

                            <span
                                className={`text-sm ${booking.genderColor}`}
                            >
                                {booking.gender}
                            </span>
                        </h3>

                        <p className="text-xs text-slate-500 font-medium">
                            {booking.breed}
                        </p>
                    </div>
                </div>

                {/* Service */}
                <div className="flex-1 min-w-0 sm:px-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <ServiceIcon
                            size={14}
                            className="text-teal-600 shrink-0"
                        />

                        <span className="truncate">{booking.service}</span>
                    </div>

                    <p className="text-slate-400 pl-6 text-[11px] line-clamp-2">
                        {booking.serviceDesc}
                    </p>

                    <div className="flex items-center gap-2 text-slate-600 pt-1">
                        <MapPin
                            size={14}
                            className="text-teal-600 shrink-0"
                        />

                        <span className="truncate">{booking.location}</span>
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-1 text-xs shrink-0 sm:min-w-[130px]">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Calendar
                            size={14}
                            className="text-slate-400 shrink-0"
                        />

                        <span>{booking.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                        {TimeIcon ? (
                            <TimeIcon
                                size={12}
                                className="text-teal-600 ml-0.5 shrink-0"
                            />
                        ) : (
                            <Clock
                                size={14}
                                className="text-slate-400 shrink-0"
                            />
                        )}

                        <span className={TimeIcon ? "pl-1" : ""}>
                            {booking.time}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-slate-900 pt-1 text-sm">
                        <Banknote
                            size={14}
                            className="text-teal-600 shrink-0"
                        />

                        <span>{booking.price}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center justify-center gap-2.5 w-full sm:w-64 md:w-72 sm:shrink-0 sm:border-l sm:border-slate-100 sm:pl-4 border-t sm:border-t-0 pt-3 sm:pt-0">

                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center justify-center gap-1.5 text-center shadow-2xs tracking-wide ${booking.statusBadge}`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                        {booking.status}
                    </span>

                    {renderActionButtons()}
                </div>

            </div>
        </article>
    );
};

export default BookingCard;