import { useState } from "react";
import { CalendarDays, Calendar, Clock, FileText, Sun, Sunset, Moon, Sparkles, ChevronRight } from "lucide-react";

// Generate next 7 days
const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    const dayNames = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateString = `${yyyy}-${mm}-${dd}`;

        days.push({
            dateString,
            dayName: i === 0 ? "Hôm nay" : i === 1 ? "Ngày mai" : dayNames[d.getDay()],
            dayNumber: d.getDate(),
            month: `Thg ${d.getMonth() + 1}`,
        });
    }
    return days;
};

const SHIFTS = {
    morning: {
        title: "Buổi sáng",
        icon: Sun,
        slots: ["08:00", "09:00", "10:00", "11:00"],
    },
    afternoon: {
        title: "Buổi chiều",
        icon: Sunset,
        slots: ["13:00", "14:00", "15:00", "16:00"],
    },
    evening: {
        title: "Buổi tối",
        icon: Moon,
        slots: ["17:00", "18:00", "19:00"],
    },
};

const NOTE_SUGGESTIONS = [
    "🐾 Bé hơi nhát người lạ",
    "✂️ Cắt tỉa gọn phần mặt",
    "🧴 Dị ứng sữa tắm tạo bọt",
    "⚡ Đón bé trước 17:00",
    "🦷 Cần vệ sinh thêm kẽ răng",
];

const BookingDateTimeSelector = ({
    selectedDate,
    selectedTime,
    note,
    timeSlots = [],
    onDateSelect,
    onTimeSelect,
    onNoteChange,
}) => {
    const upcomingDays = getUpcomingDays();
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handleAddSuggestion = (text) => {
        const trimmed = (note || "").trim();
        if (!trimmed) {
            onNoteChange(text);
        } else if (!trimmed.includes(text)) {
            onNoteChange(`${trimmed}, ${text}`);
        }
    };

    return (
        <section id="step-datetime" className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
                        <CalendarDays size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                4. Chọn thời gian hẹn
                            </h2>
                            {selectedTime && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                                    {selectedTime}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Chọn ngày và khung giờ thuận tiện nhất để nhân viên sẵn sàng đón bé
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick 7-Day Pills */}
            <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Calendar size={14} className="text-emerald-600" />
                        <span>Chọn ngày hẹn</span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowCustomPicker(!showCustomPicker)}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        <span>{showCustomPicker ? "Đóng lịch" : "Chọn ngày khác"}</span>
                        <ChevronRight size={13} />
                    </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {upcomingDays.map((item) => {
                        const isSelected = selectedDate === item.dateString;
                        return (
                            <button
                                key={item.dateString}
                                type="button"
                                onClick={() => onDateSelect && onDateSelect(item.dateString)}
                                className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                    isSelected
                                        ? "border-emerald-500 bg-gradient-to-b from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20 scale-[1.02]"
                                        : "border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-emerald-300 text-slate-700 hover:shadow-xs"
                                }`}
                            >
                                <span
                                    className={`text-[11px] font-semibold truncate ${
                                        isSelected ? "text-emerald-100" : "text-slate-500"
                                    }`}
                                >
                                    {item.dayName}
                                </span>
                                <span className="text-base sm:text-lg font-extrabold leading-tight">
                                    {item.dayNumber}
                                </span>
                                <span
                                    className={`text-[10px] ${
                                        isSelected ? "text-emerald-200" : "text-slate-400"
                                    }`}
                                >
                                    {item.month}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {showCustomPicker && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 animate-in fade-in duration-150">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Chọn ngày trên lịch:
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => onDateSelect && onDateSelect(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:border-emerald-500 outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Time Slot Shifts */}
            <div className="mt-6 pt-5 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider mb-4">
                    <Clock size={14} className="text-emerald-600" />
                    <span>Khung giờ khả dụng</span>
                </label>

                <div className="space-y-4">
                    {Object.entries(SHIFTS).map(([key, shift]) => {
                        const ShiftIcon = shift.icon;
                        return (
                            <div key={key} className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/60">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
                                    <ShiftIcon size={14} className="text-emerald-600" />
                                    <span>{shift.title}</span>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {shift.slots.map((time) => {
                                        const isSelected = selectedTime === time;
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => onTimeSelect(time)}
                                                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                                    isSelected
                                                        ? "border-emerald-500 bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/20 scale-105"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30"
                                                }`}
                                            >
                                                <span>{time}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Note & Suggestions */}
            <div className="mt-6 pt-5 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <FileText size={14} className="text-emerald-600" />
                    <span>Ghi chú cho chuyên viên chăm sóc (Tùy chọn)</span>
                </label>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {NOTE_SUGGESTIONS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleAddSuggestion(tag)}
                            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-[11px] font-medium border border-slate-200/70 hover:border-emerald-200 transition cursor-pointer"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>

                <textarea
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                    rows={3}
                    placeholder="VD: Bé hơi nhút nhát, vui lòng thao tác nhẹ nhàng; bé thích chải lông phần tai..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs leading-relaxed outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-800 placeholder:text-slate-400 bg-slate-50/30 focus:bg-white transition"
                />
            </div>
        </section>
    );
};

export default BookingDateTimeSelector;