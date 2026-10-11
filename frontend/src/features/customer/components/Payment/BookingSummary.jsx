
import { Dog, MapPin, Calendar, Clock, Receipt } from "lucide-react";

export default function BookingSummary({ booking }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-2xs">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                    Thông tin đặt lịch
                </h2>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Đã xác nhận
                </span>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Dog size={32} />
                </div>

                <div className="min-w-0">
                    <h3 className="font-bold text-slate-800">{booking.petName}</h3>
                    <p className="text-sm text-slate-500">{booking.petBreed}</p>
                    <p className="mt-1 text-sm font-medium text-emerald-700">
                        {booking.serviceName}
                    </p>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-sm text-slate-500">Cơ sở</p>
                        <p className="font-medium text-slate-800">
                            {booking.facilityName}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Calendar size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-sm text-slate-500">Ngày đặt lịch</p>
                        <p className="font-medium text-slate-800">
                            {booking.bookingDate}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-sm text-slate-500">Khung giờ</p>
                        <p className="font-medium text-slate-800">
                            {booking.bookingTime}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Receipt size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-sm text-slate-500">Mã đặt lịch</p>
                        <p className="font-medium text-slate-800">
                            {booking.bookingCode}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}