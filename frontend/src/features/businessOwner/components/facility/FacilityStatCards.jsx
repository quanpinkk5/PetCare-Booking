import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { STATS } from "../../data/facilityData";

export default function FacilityStatCards() {
    const navigate = useNavigate();

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => {
                const Icon = stat.icon;
                const isBranchCard = stat.id === "branches";

                return (
                    <div
                        key={stat.id}
                        onClick={() => {
                            if (isBranchCard) navigate("/business/branches");
                        }}
                        className={`flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition ${stat.hover} ${isBranchCard ? "cursor-pointer hover:border-emerald-300" : ""}`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.text}`}
                            >
                                <Icon size={20} />
                            </div>

                            <div>
                                <p className="text-[11px] font-medium text-slate-500">
                                    {stat.label}
                                </p>

                                <div className="flex items-center gap-1.5 leading-tight">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {stat.value}
                                    </h3>

                                    {stat.hasStar && (
                                        <>
                                            <span className="text-xs text-slate-400">/ 5</span>
                                            <Star
                                                size={12}
                                                className="fill-amber-400 text-amber-400"
                                            />
                                        </>
                                    )}
                                </div>

                                <p className="text-[11px] text-slate-400">{stat.subtext}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}