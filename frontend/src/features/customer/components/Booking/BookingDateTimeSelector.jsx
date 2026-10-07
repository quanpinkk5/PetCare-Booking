import { CalendarDays, Calendar, Clock, FileText } from "lucide-react";

const BookingDateTimeSelector = ({
    selectedDate,
    selectedTime,
    note,
    timeSlots,
    onDateSelect,
    onTimeSelect,
    onNoteChange,
}) => {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CalendarDays size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        4. Chọn lịch
                    </h2>
                    <p className="text-xs text-gray-500">
                        Chọn ngày và thời gian phù hợp
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Calendar size={15} className="text-emerald-600" />
                    Ngày đặt lịch
                </label>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateSelect && onDateSelect(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 text-sm font-medium text-slate-800"
                />
            </div>

            <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Clock size={15} className="text-emerald-600" />
                    Khung giờ
                </label>

                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                        <button
                            key={time}
                            type="button"
                            onClick={() => onTimeSelect(time)}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${selectedTime === time
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500 font-bold"
                                    : "border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-slate-50"
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <FileText size={15} className="text-emerald-600" />
                    Ghi chú
                </label>

                <textarea
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                    rows={4}
                    placeholder="Nhập ghi chú cho cơ sở..."
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 text-sm text-slate-800"
                />
            </div>
        </section>
    );
};

export default BookingDateTimeSelector;