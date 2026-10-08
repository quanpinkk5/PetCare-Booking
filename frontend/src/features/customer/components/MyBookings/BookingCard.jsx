import {
    Calendar,
    Clock,
    MapPin,
    Banknote,
    Eye,
} from "lucide-react";

const BookingCard = ({ booking }) => {
    const ServiceIcon = booking.serviceIcon;
    const isDetailAction =
        booking.primaryAction === "Chi tiết" ||
        booking.primaryAction === "Xem chi tiết" ||
        booking.primaryAction === "xem thi tiết";

    const displayPrimaryAction = isDetailAction ? "Xem chi tiết" : booking.primaryAction;
    const PrimaryIcon = isDetailAction ? Eye : booking.primaryIcon;
    const TimeIcon = booking.timeIcon;

    return (
        <article
            className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 transition-all shadow-sm ${booking.borderColor}`}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* Pet */}
                <div className="flex items-start gap-4">
                    <img
                        alt={booking.petName}
                        src={booking.img}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                    />

                    <div className="space-y-1">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                            {booking.id}
                        </span>

                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
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
                <div className="flex-1 sm:px-4 space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <ServiceIcon
                            size={14}
                            className="text-teal-600"
                        />

                        <span>{booking.service}</span>
                    </div>

                    <p className="text-slate-400 pl-6 text-[11px]">
                        {booking.serviceDesc}
                    </p>

                    <div className="flex items-center gap-2 text-slate-600 pt-1">
                        <MapPin
                            size={14}
                            className="text-teal-600"
                        />

                        <span>{booking.location}</span>
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-1 text-xs min-w-[140px]">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Calendar
                            size={14}
                            className="text-slate-400"
                        />

                        <span>{booking.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                        {TimeIcon ? (
                            <TimeIcon
                                size={12}
                                className="text-teal-600 ml-0.5"
                            />
                        ) : (
                            <Clock
                                size={14}
                                className="text-slate-400"
                            />
                        )}

                        <span className={TimeIcon ? "pl-1" : ""}>
                            {booking.time}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-slate-900 pt-1 text-sm">
                        <Banknote
                            size={14}
                            className="text-teal-600"
                        />

                        <span>{booking.price}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">

                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${booking.statusBadge}`}
                    >
                        {booking.status}
                    </span>

                    <div className="flex items-center gap-2">

                        {booking.secondaryAction && (
                            <button className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 rounded-lg transition-colors border border-slate-200 cursor-pointer">
                                {booking.secondaryAction}
                            </button>
                        )}

                        {displayPrimaryAction && (
                            <button
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${PrimaryIcon
                                        ? "text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200"
                                        : "text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                                    }`}
                            >
                                {PrimaryIcon && (
                                    <PrimaryIcon
                                        size={14}
                                        className={
                                            displayPrimaryAction === "Đặt lại"
                                                ? ""
                                                : "text-teal-600"
                                        }
                                    />
                                )}

                                <span>{displayPrimaryAction}</span>
                            </button>
                        )}

                    </div>
                </div>

            </div>
        </article>
    );
};

export default BookingCard;