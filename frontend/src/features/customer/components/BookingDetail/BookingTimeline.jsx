import React from "react";
import {
    Clock,
    CalendarCheck,
    Scissors,
    CheckCircle2,
    Check,
} from "lucide-react";

const TIMELINE_STEPS = [
    {
        id: 1,
        title: "Đã tạo lịch",
        time: "25/08/2026 - 09:15",
        icon: Check,
        state: "completed",
    },
    {
        id: 2,
        title: "Đang chờ xác nhận",
        time: "25/08/2026 - 09:15",
        icon: Clock,
        state: "active",
    },
    {
        id: 3,
        title: "Đã xác nhận",
        time: "-",
        icon: CalendarCheck,
        state: "pending",
    },
    {
        id: 4,
        title: "Đang thực hiện",
        time: "-",
        icon: Scissors,
        state: "pending",
    },
    {
        id: 5,
        title: "Hoàn thành",
        time: "-",
        icon: CheckCircle2,
        state: "pending",
    },
];

const BookingTimeline = ({ statusStep = 2, statusType = "pending" }) => {
    const progressWidthClass =
        statusType === "cancelled"
            ? "w-0"
            : statusStep <= 1
            ? "w-0"
            : statusStep === 2
            ? "w-1/4"
            : statusStep === 3
            ? "w-2/4"
            : statusStep === 4
            ? "w-3/4"
            : "w-full";

    const currentStepObj = TIMELINE_STEPS.find((s) => s.id === statusStep) || TIMELINE_STEPS[1];

    return (
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="font-bold text-slate-800 text-sm sm:text-base">
                        Tiến trình xử lý
                    </h2>
                </div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Bước {statusStep}/5: <span className="font-bold">{currentStepObj.title}</span>
                </div>
            </div>

            <div className="relative flex items-center justify-between">
                {/* Background line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

                {/* Completed line */}
                <div className={`absolute top-4 left-6 ${progressWidthClass} h-0.5 bg-emerald-500 transition-all duration-500 -z-0`} />

                {TIMELINE_STEPS.map((step) => {
                    const Icon = step.icon;

                    let stepState = "pending";
                    if (step.id < statusStep) {
                        stepState = "completed";
                    } else if (step.id === statusStep) {
                        stepState = statusType === "cancelled" ? "cancelled" : "active";
                    }

                    let circleClass = "";
                    if (stepState === "completed") {
                        circleClass = "bg-emerald-600";
                    } else if (stepState === "active") {
                        circleClass = "bg-amber-500 animate-pulse";
                    } else if (stepState === "cancelled") {
                        circleClass = "bg-rose-500";
                    } else {
                        circleClass = "bg-slate-100 border border-slate-200";
                    }

                    return (
                        <div
                            key={step.id}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white ${circleClass}`}
                            >
                                <Icon
                                    size={14}
                                    className={
                                        stepState === "pending"
                                            ? "text-slate-400"
                                            : "text-white"
                                    }
                                />
                            </div>

                            <span
                                className={`mt-2 text-xs font-bold ${
                                    stepState === "active"
                                        ? "text-amber-600"
                                        : stepState === "completed"
                                        ? "text-slate-800"
                                        : stepState === "cancelled"
                                        ? "text-rose-600"
                                        : "text-slate-500 font-medium"
                                }`}
                            >
                                {step.title}
                            </span>

                            <span
                                className={`text-[10px] ${
                                    step.time === "-"
                                        ? "text-transparent select-none"
                                        : "text-slate-400"
                                }`}
                            >
                                {step.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingTimeline;