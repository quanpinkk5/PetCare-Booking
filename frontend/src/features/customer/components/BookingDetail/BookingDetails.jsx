import React from "react";
import {
    Scissors,
    Clock,
    Building,
    MapPin,
    Phone,
    PawPrint,
    Edit,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const BookingDetails = ({ booking }) => {
    return (
        <div className="flex flex-col gap-5">
            {/* Row 1: Thú cưng & Dịch vụ (2 cột cân xứng 50% - 50%) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Thú cưng */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <PawPrint size={15} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Thông tin thú cưng
                                </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                Khách hàng VIP
                            </span>
                        </div>

                        {/* Pet main profile */}
                        <div className="flex items-center gap-3.5 mb-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                            <img
                                alt={booking.pet?.name || "Pet"}
                                src={booking.pet?.img}
                                className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-200/80 shadow-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <h4 className="font-extrabold text-slate-900 text-base truncate">
                                        {booking.pet?.name}
                                    </h4>
                                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                                        {booking.pet?.gender}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                    {booking.pet?.breed}
                                </p>
                            </div>
                        </div>

                        {/* Pet details list */}
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-400">Giới tính:</span>
                                <span className="font-semibold text-slate-700">
                                    {booking.pet?.gender === "♂" ? "Đực" : "Cái"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-400">Cân nặng:</span>
                                <span className="font-semibold text-slate-700">
                                    {booking.pet?.weight || "12kg"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-slate-400">Tính cách:</span>
                                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                    {booking.pet?.personality || "Thân thiện"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Dịch vụ */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                    <Scissors size={15} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Gói dịch vụ đã đặt
                                </h3>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                <Clock size={11} className="text-teal-600" />
                                <span>{booking.service?.duration || "90-120 phút"}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100/60">
                                <span className="text-xs text-teal-600 font-bold uppercase tracking-wider block mb-0.5">
                                    Tên dịch vụ
                                </span>
                                <h4 className="font-bold text-slate-900 text-sm">
                                    {booking.service?.name}
                                </h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    {booking.service?.desc}
                                </p>
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <span className="text-xs font-semibold text-slate-700 block">
                                    Quy trình chuẩn bao gồm:
                                </span>
                                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                        <span>Tắm sấy thảo dược</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                        <span>Cắt tỉa & tạo kiểu</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                        <span>Vệ sinh tai & móng</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                        <span>Xịt dưỡng & khử khuẩn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Cơ sở tiếp nhận & Ghi chú của khách hàng (2 cột cân xứng 50% - 50%) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 3. Cơ sở */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Building size={15} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Cơ sở thực hiện
                                </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                Hoạt động 08:00 - 20:00
                            </span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5">
                                <Building size={14} className="text-teal-600 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-slate-400 block text-[11px]">Tên chi nhánh</span>
                                    <span className="font-bold text-slate-800 text-xs">
                                        {booking.facility?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <MapPin size={14} className="text-teal-600 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-slate-400 block text-[11px]">Địa chỉ tiếp nhận</span>
                                    <span className="font-medium text-slate-700 leading-snug block">
                                        {booking.facility?.address}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Phone size={14} className="text-teal-600 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-slate-400 block text-[11px]">Hotline cơ sở</span>
                                    <span className="font-bold text-emerald-600">
                                        {booking.facility?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Ghi chú khách hàng */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <Edit size={15} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Ghi chú & Dặn dò
                                </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                Lưu ý chăm sóc
                            </span>
                        </div>

                        <div className="p-3.5 bg-gradient-to-br from-amber-50/60 to-emerald-50/30 rounded-xl border border-amber-100/70 mb-3">
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                                "{booking.note || "Milo hơi sợ máy sấy. Không sử dụng nước hoa quá mạnh."}"
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                            <Sparkles size={12} className="text-emerald-600 shrink-0" />
                            <span>Kỹ thuật viên sẽ đọc kỹ lưu ý trước khi thực hiện dịch vụ cho bé.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;