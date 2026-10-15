
import {
    LayoutGrid,
    Clock,
    CreditCard,
    Calendar,
    Copy,
} from "lucide-react";

const METRICS = [
    {
        label: "Mã booking",
        icon: LayoutGrid,
        iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
        label: "Trạng thái booking",
        icon: Clock,
        iconClass: "bg-amber-50 text-amber-500",
    },
    {
        label: "Trạng thái thanh toán",
        icon: CreditCard,
        iconClass: "bg-amber-50 text-amber-500",
    },
    {
        label: "Thời gian dịch vụ",
        icon: Calendar,
        iconClass: "bg-blue-50 text-blue-500",
    },
    {
        label: "Tổng tiền",
        icon: CreditCard,
        iconClass: "bg-emerald-50 text-emerald-600",
    },
];

export default function BookingMetricCards() {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {METRICS.map((metric, index) => {
                const Icon = metric.icon;

                return (
                    <div
                        key={metric.label}
                        className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${metric.iconClass}`}>
                            <Icon size={20} />
                        </div>

                        <div className="min-w-0">
                            <span className="text-[11px] text-slate-400 font-medium">
                                {metric.label}
                            </span>

                            {index === 0 && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="font-bold text-slate-800 text-sm">
                                        BK250522-004
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Sao chép mã booking"
                                        onClick={() => navigator.clipboard?.writeText("BK250522-004")}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <Copy size={12} />
                                    </button>
                                </div>
                            )}

                            {index === 1 && (
                                <div className="mt-0.5">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Pending
                                    </span>
                                </div>
                            )}

                            {index === 2 && (
                                <div className="mt-0.5">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Unpaid
                                    </span>
                                </div>
                            )}

                            {index === 3 && (
                                <>
                                    <p className="font-bold text-slate-800 text-xs mt-0.5">22/05/2025</p>
                                    <p className="text-[11px] text-slate-500">14:00 - 15:30</p>
                                </>
                            )}

                            {index === 4 && (
                                <p className="font-bold text-slate-900 text-base mt-0.5">200.000đ</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
