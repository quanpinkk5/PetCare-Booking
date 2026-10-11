import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const steps = [
    { number: 1, label: "Chọn dịch vụ", path: "/services" },
    { number: 2, label: "Đặt lịch", path: "/booking" },
    { number: 3, label: "Thanh toán", path: null },
    { number: 4, label: "Hoàn tất", path: null },
];

export default function PaymentStepper({ isCompleted = false }) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-start justify-between">
                {steps.map((step, index) => {
                    const completed = isCompleted ? step.number <= 4 : step.number < 3;
                    const active = isCompleted ? false : step.number === 3;
                    const isClickable = Boolean(step.path);

                    return (
                        <Fragment key={step.number}>
                            <div
                                onClick={() => isClickable && navigate(step.path)}
                                className={`flex min-w-0 flex-col items-center text-center ${
                                    isClickable ? "cursor-pointer group" : ""
                                }`}
                                title={isClickable ? `Quay lại: ${step.label}` : undefined}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition ${completed
                                            ? "bg-emerald-600 text-white group-hover:bg-emerald-700"
                                            : active
                                                ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-600"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                >
                                    {completed ? (
                                        <Check size={18} strokeWidth={2.5} />
                                    ) : (
                                        step.number
                                    )}
                                </div>

                                <span
                                    className={`mt-2 text-xs sm:text-sm transition ${active || completed
                                            ? "font-semibold text-slate-800 group-hover:text-emerald-700"
                                            : "text-slate-400"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={`mx-2 mt-5 h-0.5 flex-1 ${completed ? "bg-emerald-500" : "bg-slate-200"
                                        }`}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}