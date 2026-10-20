import { useState } from "react";
import {
    Dog,
    MapPin,
    Calendar,
    Clock,
    Copy,
    Check,
    Scissors,
    Phone,
    ShieldAlert,
    Sparkles,
} from "lucide-react";

export default function BookingSummary({ booking }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!booking?.bookingCode) return;
        navigator.clipboard.writeText(booking.bookingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-xs space-y-5">
            {/* Header: Title + Status + Booking Code */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Scissors size={18} />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                            Thông tin dịch vụ & Lịch hẹn
                        </h2>
                        <p className="text-xs text-slate-400">
                            Vui lòng kiểm tra lại thông tin chi tiết trước khi xác nhận
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-xs font-mono font-bold text-slate-700">
                        <span>{booking.bookingCode}</span>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="text-slate-400 hover:text-emerald-600 transition cursor-pointer p-0.5"
                            title="Sao chép mã đặt lịch"
                        >
                            {copied ? (
                                <Check size={13} className="text-emerald-600" />
                            ) : (
                                <Copy size={13} />
                            )}
                        </button>
                    </div>

                    <span className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-700">
                        Chờ thanh toán
                    </span>
                </div>
            </div>

            {/* Pet & Service Spotlight Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-slate-50 p-4 sm:p-5 border border-emerald-100/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                        <Dog size={38} strokeWidth={1.8} />
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs text-emerald-600">
                        <Sparkles size={13} />
                    </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                            {booking.petName}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs">
                            {booking.petBreed}
                        </span>
                    </div>

                    <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 pt-0.5">
                        <Scissors size={14} className="shrink-0" />
                        <span>{booking.serviceName}</span>
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed">
                        Liệu trình bao gồm: Cắt tỉa tạo kiểu, tắm thảo dược khử mùi, vệ sinh tai móng & xịt dưỡng hương hoa lavender cao cấp.
                    </p>
                </div>
            </div>

            {/* Grid 2 Columns: Facility Details & Appointment Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Facility block */}
                <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                        <MapPin size={15} className="text-emerald-600 shrink-0" />
                        <span>Cơ sở phục vụ</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">
                        {booking.facilityName}
                    </p>
                    <p className="text-slate-500 text-[11px] leading-snug">
                        {booking.facilityAddress || "123 Trần Thái Tông, Cầu Giấy, Hà Nội"}
                    </p>
                    {booking.facilityPhone && (
                        <p className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 pt-1">
                            <Phone size={12} />
                            <span>Hotline cơ sở: {booking.facilityPhone}</span>
                        </p>
                    )}
                </div>

                {/* Appointment time block */}
                <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                        <Calendar size={15} className="text-emerald-600 shrink-0" />
                        <span>Thời gian tiếp nhận</span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                        <span className="text-slate-500">Ngày hẹn:</span>
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                            {booking.bookingDate}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-500">Khung giờ:</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm flex items-center gap-1">
                            <Clock size={13} />
                            <span>{booking.bookingTime}</span>
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic pt-1">
                        * Khuyến khích đưa bé tới trước 10 phút để chuyên viên kiểm tra lông da.
                    </p>
                </div>
            </div>
        </section>
    );
}