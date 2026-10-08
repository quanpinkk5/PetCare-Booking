import React from "react";
import {
    PawPrint,
    Scissors,
    Building,
    CalendarDays,
    Clock,
    Wallet,
    CreditCard,
    MessageCircle,
    XCircle,
} from "lucide-react";

const BookingOverview = ({ booking }) => {
    return (
        <section className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 w-full">

                {/* Booking information */}
                <div className="flex items-start gap-4 w-full">
                    {/* Pet image */}
                    <div className="relative">
                        <img
                            alt={booking.pet.name}
                            src={booking.pet.img}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-emerald-100 shadow-sm"
                        />

                        <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] ring-2 ring-white">
                            {booking.pet.gender}
                        </span>
                    </div>

                    <div className="space-y-2 flex-1">
                        {/* Booking code */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">
                                Mã đặt lịch
                            </span>

                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 tracking-wide">
                                {booking.id}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs w-full">

                            {/* Pet */}
                            <div className="flex items-start gap-2">
                                <PawPrint
                                    size={14}
                                    className="text-emerald-600 mt-0.5"
                                />

                                <div>
                                    <div className="font-bold text-slate-800 text-[13px]">
                                        {booking.pet.name}{" "}
                                        <span className="text-blue-500 font-bold">
                                            {booking.pet.gender}
                                        </span>
                                    </div>

                                    <div className="text-slate-400 text-[11px]">
                                        {booking.pet.breed}
                                    </div>
                                </div>
                            </div>

                            {/* Service */}
                            <div className="flex items-start gap-2">
                                <Scissors
                                    size={14}
                                    className="text-emerald-600 mt-0.5"
                                />

                                <div>
                                    <div className="font-semibold text-slate-800">
                                        {booking.service.name}
                                    </div>

                                    <div className="text-slate-400 text-[11px]">
                                        {booking.service.desc}
                                    </div>
                                </div>
                            </div>

                            {/* Facility */}
                            <div className="flex items-start gap-2">
                                <Building
                                    size={14}
                                    className="text-emerald-600 mt-0.5"
                                />

                                <div className="font-semibold text-slate-800">
                                    {booking.facility.name}
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-start gap-2">
                                <CalendarDays
                                    size={14}
                                    className="text-emerald-600 mt-0.5"
                                />

                                <div className="font-semibold text-slate-800">
                                    {booking.date}
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start gap-2">
                                <Clock
                                    size={14}
                                    className="text-emerald-600 mt-0.5"
                                />

                                <div className="text-slate-600">
                                    {booking.time}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-start gap-2">
                                <Wallet
                                    size={14}
                                    className="text-emerald-600 mt-0.5"
                                />

                                <div>
                                    <span className="text-slate-500">
                                        Tổng tiền:
                                    </span>

                                    <span className="font-bold text-slate-900 text-sm ml-1">
                                        {booking.totalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row xl:flex-col gap-2 w-full xl:w-44 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition text-xs">
                        <CreditCard size={14} />
                        <span>Thanh toán</span>
                    </button>

                    <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition text-xs">
                        <MessageCircle size={14} />
                        <span>Chat với cơ sở</span>
                    </button>

                    <button className="w-full bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition text-xs">
                        <XCircle size={14} />
                        <span>Hủy lịch</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BookingOverview;