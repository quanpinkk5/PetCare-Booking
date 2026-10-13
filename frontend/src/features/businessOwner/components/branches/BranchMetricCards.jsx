import {
    ArrowUp,
    BookMarked,
    ChevronRight,
    Plus,
} from "lucide-react";

import { METRICS, TOTAL_BOOKINGS } from "../../data/branchData";

export default function BranchMetricCards({ onAddBranch }) {
    return (
        <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((metric) => {
                const Icon = metric.icon;

                return (
                    <div
                        key={metric.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all ${metric.hover}`}
                    >
                        <div className="flex items-center gap-3.5">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.bg} ${metric.text}`}
                            >
                                <Icon size={20} />
                            </div>

                            <div>
                                <p className="mb-1 text-[11px] font-medium leading-none text-slate-500">
                                    {metric.label}
                                </p>

                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-slate-900">
                                        {metric.value}
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                        {metric.subtext}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                );
            })}

            <div className="flex min-w-0 items-stretch gap-3 sm:col-span-2">
                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                            <BookMarked size={20} />
                        </div>

                        <div className="min-w-0">
                            <p className="mb-1 text-[11px] font-medium leading-tight text-slate-500">
                                Tổng booking tháng này
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xl font-bold text-slate-900">
                                    {TOTAL_BOOKINGS.value}
                                </span>

                                <span className="flex items-center gap-0.5 rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-semibold text-emerald-600">
                                    <ArrowUp size={10} />
                                    {TOTAL_BOOKINGS.growth}
                                </span>
                            </div>

                            <span className="text-[9px] text-slate-400">
                                So với tháng trước
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onAddBranch}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Thêm chi nhánh</span>
                </button>
            </div>
        </section>
    );
}