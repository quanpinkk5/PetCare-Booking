import { ArrowRight, AlertCircle } from "lucide-react";
import { ALERTS } from "../../data/branchData";

export default function AttentionAlerts() {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                        Chi nhánh cần chú ý
                    </h3>

                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {ALERTS.length}
                    </span>
                </div>

                <AlertCircle size={17} className="text-orange-500" />
            </div>

            <div className="space-y-4">
                {ALERTS.map((alert) => (
                    <div
                        key={alert.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50/50 p-2.5"
                    >
                        <div className="flex min-w-0 items-start gap-2.5">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />

                            <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-900">
                                    {alert.branch}
                                </h5>

                                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                                    {alert.desc}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.alert(alert.desc)}
                            className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            Xem ngay
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-center">
                <button
                    type="button"
                    onClick={() => window.alert("Danh sách tất cả cảnh báo")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                >
                    <span>Xem tất cả cảnh báo</span>
                    <ArrowRight size={12} />
                </button>
            </div>
        </section>
    );
}