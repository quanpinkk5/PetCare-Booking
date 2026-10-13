import {
    ChevronDown,
    Calendar,
    CalendarX,
    Plus,
} from "lucide-react";

const FILTERS = [
    {
        label: "Chi nhánh",
        options: ["Happy Pet - Cầu Giấy", "Happy Pet - Ba Đình"],
        width: "w-44",
    },
    {
        label: "Dịch vụ",
        options: ["Grooming cao cấp", "Tắm sấy cơ bản", "Pet Spa & Massage"],
        width: "w-44",
    },
    {
        label: "Chế độ xem",
        options: ["Xem theo tuần", "Xem theo tháng", "Xem theo ngày"],
        width: "w-32",
    },
];

export default function ScheduleFilterBar({
    onAddSchedule,
    onAddException,
}) {
    return (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5">
                {FILTERS.map((filter) => (
                    <div
                        key={filter.label}
                        className={`flex flex-col gap-1 ${filter.width}`}
                    >
                        <label className="mb-1 text-[9px] font-medium text-slate-400">
                            {filter.label}
                        </label>

                        <div className="relative">
                            <select className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500">
                                {filter.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={14}
                                className="pointer-events-none absolute right-2 top-1.5 text-slate-400"
                            />
                        </div>
                    </div>
                ))}

                <div className="flex w-48 flex-col gap-1">
                    <label className="mb-1 text-[9px] font-medium text-slate-400">
                        Tuần làm việc
                    </label>

                    <div className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700">
                        <span>19/05 – 25/05/2025</span>
                        <Calendar size={14} className="ml-1 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-3 sm:pt-0">
                <button
                    type="button"
                    onClick={onAddSchedule}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50"
                >
                    <Plus size={14} />
                    <span>Thêm lịch</span>
                </button>

                <button
                    type="button"
                    onClick={onAddException}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50"
                >
                    <CalendarX size={14} />
                    <span>Thêm ngoại lệ</span>
                </button>
            </div>
        </section>
    );
}
