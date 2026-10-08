import React from "react";
import {
    Scissors,
    FileText,
    Clock,
    Building,
    User,
    MapPin,
    Phone,
    PawPrint,
    Circle,
    Edit,
} from "lucide-react";

const BookingDetails = ({ booking }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Service */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                        <Scissors
                            size={16}
                            className="text-emerald-600"
                        />

                        <h3 className="font-bold text-slate-800 text-[13px]">
                            Thông tin dịch vụ
                        </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex items-start justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Circle size={8} />
                                Dịch vụ:
                            </span>

                            <span className="font-medium text-slate-800 text-right">
                                {booking.service.name}
                            </span>
                        </div>

                        <div className="flex items-start justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <FileText size={10} />
                                Mô tả:
                            </span>

                            <span className="text-slate-700 text-right">
                                {booking.service.desc}
                            </span>
                        </div>

                        <div className="flex items-start justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Clock size={10} />
                                Thời lượng:
                            </span>

                            <span className="font-medium text-slate-800 text-right">
                                {booking.service.duration}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Facility */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-3">
                <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                        <Building
                            size={16}
                            className="text-emerald-600"
                        />

                        <h3 className="font-bold text-slate-800 text-[13px]">
                            Thông tin cơ sở
                        </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex items-start justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <User size={10} />
                                Tên cơ sở:
                            </span>

                            <span className="font-medium text-slate-800 text-right">
                                {booking.facility.name}
                            </span>
                        </div>

                        <div className="flex items-start justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <MapPin size={10} />
                                Địa chỉ:
                            </span>

                            <span className="text-slate-700 text-right max-w-[190px]">
                                {booking.facility.address}
                            </span>
                        </div>

                        <div className="flex items-start justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Phone size={10} />
                                Điện thoại:
                            </span>

                            <span className="text-emerald-600 font-semibold text-right">
                                {booking.facility.phone}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer note */}
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 mt-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px] mb-1">
                        <Edit
                            size={12}
                            className="text-emerald-600"
                        />

                        <span>Ghi chú của khách hàng</span>
                    </div>

                    <p className="text-[12px] text-slate-700 leading-relaxed italic">
                        "{booking.note}"
                    </p>
                </div>
            </div>

            {/* Pet */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                    <PawPrint
                        size={16}
                        className="text-emerald-600"
                    />

                    <h3 className="font-bold text-slate-800 text-[13px]">
                        Thông tin thú cưng
                    </h3>
                </div>

                <div className="flex items-center gap-3 mb-3">
                    <img
                        alt={booking.pet.name}
                        src={booking.pet.img}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                    />

                    <div>
                        <div className="font-bold text-slate-900 text-sm">
                            {booking.pet.name}{" "}
                            <span className="text-blue-500 font-bold">
                                {booking.pet.gender}
                            </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                            {booking.pet.breed}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                        <span className="text-slate-400">
                            Giới tính:
                        </span>

                        <span className="font-medium text-slate-800">
                            Đực
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-400">
                            Cân nặng:
                        </span>

                        <span className="font-medium text-slate-800">
                            {booking.pet.weight}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-400">
                            Tính cách:
                        </span>

                        <span className="font-medium text-emerald-600">
                            {booking.pet.personality}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;