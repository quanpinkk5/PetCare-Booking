import { ArrowRight } from "lucide-react";
import { EXCEPTIONS } from "../../data/scheduleData";

export default function UpcomingExceptions() {
    return (
        <section className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800">
                        Ngoại lệ sắp tới
                    </h3>

                    <button
                        type="button"
                        className="cursor-pointer text-[11px] font-medium text-emerald-600 hover:underline"
                    >
                        Xem tất cả
                    </button>
                </div>

                <div className="space-y-3">
                    {EXCEPTIONS.map((exception) => {
                        const Icon = exception.icon;

                        return (
                            <div
                                key={exception.id}
                                className="flex items-start justify-between gap-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0"
                            >
                                <div className="flex items-start gap-2">
                                    <div
                                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded ${exception.bg} ${exception.color}`}
                                    >
                                        <Icon size={14} />
                                    </div>

                                    <div>
                                        <h5 className="text-[11px] font-bold leading-tight text-slate-700">
                                             {exception.title}
                                        </h5>
                                        <p className="text-[10px] text-slate-400">
                                            {exception.date}
                                        </p>
                                        <span className="text-[9px] text-slate-500">
                                            {exception.reason}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded px-2 py-0.5 text-[9px] font-medium ${exception.bg} ${exception.color}`}
                                >
                                    {exception.time}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-2 text-right">
                    <button
                        type="button"
                        className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 transition-colors hover:text-emerald-600"
                    >
                        Quản lý tất cả ngoại lệ
                        <ArrowRight size={10} />
                    </button>
                </div>
            </div>
        </section>
    );
}
