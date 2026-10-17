import { ArrowRight } from "lucide-react";
import { SERVICE_ALERTS, SERVICE_TIPS } from "../../data/serviceData";

export default function ServiceSidebarWidgets() {
    return (
        <aside className="w-full space-y-5">
            {/* Cảnh báo */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">
                            Dịch vụ cần chú ý
                        </h3>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            !
                        </span>
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    {SERVICE_ALERTS.map((alert) => (
                        <div
                            key={alert.id}
                            className="relative border-l-2 border-amber-400 pl-3.5"
                        >
                            <h4 className="text-xs font-bold leading-snug text-slate-900">
                                {alert.title}
                            </h4>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                                {alert.description}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    window.alert(`Xem cảnh báo: ${alert.title}`)
                                }
                                className="mt-2 inline-block text-[11px] font-semibold text-emerald-600 transition hover:text-emerald-700"
                            >
                                Xem ngay
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3.5 text-center">
                    <button
                        type="button"
                        onClick={() => window.alert("Xem tất cả cảnh báo dịch vụ")}
                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                    >
                        Xem tất cả cảnh báo <ArrowRight size={13} />
                    </button>
                </div>
            </div>

            {/* Mẹo quản lý */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                    <h3 className="text-xs font-bold text-slate-900">
                        Mẹo quản lý dịch vụ
                    </h3>
                    <span className="select-none text-2xl" title="Corgi">
                        🐶
                    </span>
                </div>

                <div className="mt-4 space-y-3.5">
                    {SERVICE_TIPS.map((tip) => {
                        const Icon = tip.icon;

                        return (
                            <div key={tip.id} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Icon size={14} />
                                </div>

                                <p className="text-[11px] leading-snug text-slate-600">
                                    <span className="font-semibold text-slate-800">
                                        {tip.title}
                                    </span>{" "}
                                    {tip.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3.5 text-center">
                    <button
                        type="button"
                        onClick={() => window.alert("Mở hướng dẫn quản lý dịch vụ")}
                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                    >
                        Xem hướng dẫn chi tiết <ArrowRight size={13} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
