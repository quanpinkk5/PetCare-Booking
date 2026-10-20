import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Scissors, Calendar, CreditCard, CheckCircle2 } from "lucide-react";

const steps = [
    { number: 1, label: "Chọn dịch vụ", path: "/services", icon: Scissors },
    { number: 2, label: "Đặt lịch hẹn", path: "/booking", icon: Calendar },
    { number: 3, label: "Thanh toán", path: null, icon: CreditCard },
    { number: 4, label: "Hoàn tất", path: null, icon: CheckCircle2 },
];

export default function PaymentStepper({ isCompleted = false }) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const completed = isCompleted ? step.number <= 4 : step.number < 3;
                    const active = isCompleted ? false : step.number === 3;
                    const isClickable = Boolean(step.path);
                    const StepIcon = step.icon;

                    return (
                        <Fragment key={step.number}>
                            <div
                                onClick={() => isClickable && navigate(step.path)}
                                className={`flex min-w-0 flex-1 flex-col items-center text-center ${
                                    isClickable ? "cursor-pointer group" : ""
                                }`}
                                title={isClickable ? `Quay lại: ${step.label}` : undefined}
                            >
                                <div className="relative">
                                    <div
                                        className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-bold transition-all duration-300 ${
                                            completed
                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 group-hover:scale-105"
                                                : active
                                                ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-100 scale-105"
                                                : "bg-slate-100 text-slate-400 border border-slate-200"
                                        }`}
                                    >
                                        {completed ? (
                                            <Check size={20} strokeWidth={2.8} />
                                        ) : (
                                            <StepIcon size={20} />
                                        )}
                                    </div>

                                    {/* Active pulse dot */}
                                    {active && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2.5 text-center">
                                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Bước {step.number}
                                    </p>
                                    <p
                                        className={`text-xs sm:text-sm transition-colors ${
                                            active
                                                ? "font-bold text-emerald-700"
                                                : completed
                                                ? "font-semibold text-slate-800 group-hover:text-emerald-700"
                                                : "text-slate-400 font-medium"
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="relative mx-1 sm:mx-3 mb-6 flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            completed ? "w-full bg-emerald-500" : "w-0"
                                        }`}
                                    />
                                </div>
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}