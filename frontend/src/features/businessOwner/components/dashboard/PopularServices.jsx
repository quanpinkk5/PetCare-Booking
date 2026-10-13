import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { POPULAR_SERVICES } from "../../data/dashboardData";

export default function PopularServices() {
    const navigate = useNavigate();

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                    Dịch vụ phổ biến
                </h4>

                <button
                    type="button"
                    onClick={() => navigate("/business/branch-services")}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Xem tất cả <ArrowRight size={12} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                {POPULAR_SERVICES.map((service) => (
                    <div
                        key={service.title}
                        className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`rounded-lg p-2 text-sm ${service.bgIcon}`}>
                                {service.emoji}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                                {service.percent}
                            </span>
                        </div>

                        <div className="mt-2">
                            <p className="text-xs font-bold text-slate-800">
                                {service.title}
                            </p>
                            <p className="text-[10px] text-slate-400">{service.val}</p>
                        </div>

                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                                className={`h-full rounded-full ${service.bgBar}`}
                                style={{ width: service.width }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}