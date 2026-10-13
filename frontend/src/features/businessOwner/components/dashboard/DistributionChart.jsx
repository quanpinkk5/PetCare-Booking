import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SERVICE_DISTRIBUTION = [
    { color: "bg-emerald-500", name: "Grooming", value: "40 (33.3%)" },
    { color: "bg-blue-500", name: "Tắm", value: "32 (26.7%)" },
    { color: "bg-sky-400", name: "Spa", value: "24 (20.0%)" },
    { color: "bg-amber-500", name: "Boarding", value: "24 (20.0%)" },
];

export default function DistributionChart() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:col-span-5">
            <h4 className="mb-2 text-xs font-bold text-slate-800">
                Phân bố dịch vụ
            </h4>

            <div className="flex items-center justify-center gap-3">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                    <svg
                        className="-rotate-90"
                        viewBox="0 0 100 100"
                        role="img"
                        aria-label="Biểu đồ phân bố 120 booking"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="transparent"
                            stroke="#f1f5f9"
                            strokeWidth="14"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="transparent"
                            stroke="#f59e0b"
                            strokeWidth="14"
                            strokeDasharray="44 220"
                            strokeDashoffset="-176"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="transparent"
                            stroke="#38bdf8"
                            strokeWidth="14"
                            strokeDasharray="44 220"
                            strokeDashoffset="-132"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="transparent"
                            stroke="#3b82f6"
                            strokeWidth="14"
                            strokeDasharray="58.7 220"
                            strokeDashoffset="-73.3"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="transparent"
                            stroke="#10b981"
                            strokeWidth="14"
                            strokeDasharray="73.3 220"
                            strokeDashoffset="0"
                        />
                    </svg>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] text-slate-400">Tổng</span>
                        <span className="text-sm font-bold leading-tight text-slate-800">
                            120
                        </span>
                        <span className="text-[8px] text-slate-400">booking</span>
                    </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                    {SERVICE_DISTRIBUTION.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`}
                            />
                            <span className="font-medium text-slate-600">
                                {item.name}
                            </span>
                            <span className="ml-auto font-mono text-[10px] text-slate-400">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-100 pt-2 text-right">
                <button
                    type="button"
                    onClick={() => navigate("/business/services")}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Xem chi tiết <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}