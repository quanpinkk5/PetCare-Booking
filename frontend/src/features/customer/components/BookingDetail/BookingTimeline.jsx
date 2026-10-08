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

const BookingTimeline = () => {
    return (
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h2 className="font-bold text-slate-800 text-base mb-6">
                Tiến trình xử lý
            </h2>

            <div className="relative flex items-center justify-between">
                {/* Background line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

                {/* Completed line */}
                <div className="absolute top-4 left-6 w-1/4 h-0.5 bg-emerald-500 -z-0" />

                {TIMELINE_STEPS.map((step) => {
                    const Icon = step.icon;

                    let circleClass = "";

                    if (step.state === "completed") {
                        circleClass = "bg-emerald-600";
                    } else if (step.state === "active") {
                        circleClass = "bg-amber-500 animate-pulse";
                    } else {
                        circleClass =
                            "bg-slate-100 border border-slate-200";
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
                                        step.state === "pending"
                                            ? "text-slate-400"
                                            : "text-white"
                                    }
                                />
                            </div>

                            <span
                                className={`mt-2 text-xs font-bold ${step.state === "active"
                                        ? "text-amber-600"
                                        : step.state === "completed"
                                            ? "text-slate-800"
                                            : "text-slate-500 font-medium"
                                    }`}
                            >
                                {step.title}
                            </span>

                            <span
                                className={`text-[10px] ${step.time === "-"
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