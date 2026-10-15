import { ArrowRight } from "lucide-react";
import { TIPS } from "../../data/branchData";

export default function BranchTipsWidget() {
    return (
        <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="pointer-events-none absolute right-2 top-0 rotate-3 select-none text-4xl">
                🐶
            </div>

            <div className="mb-4 border-b border-slate-100 pb-3 pr-10">
                <h3 className="text-sm font-bold text-emerald-700">
                    Mẹo quản lý chi nhánh
                </h3>
            </div>

            <div className="space-y-4">
                {TIPS.map((tip) => {
                    const Icon = tip.icon;

                    return (
                        <div key={tip.id} className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                <Icon size={16} />
                            </div>

                            <p className="text-[11px] leading-relaxed text-slate-600">
                                {tip.desc}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 text-center">
                <button
                    type="button"
                    onClick={() => window.alert("Hướng dẫn quản lý chi nhánh")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                >
                    <span>Xem hướng dẫn chi tiết</span>
                    <ArrowRight size={12} />
                </button>
            </div>
        </section>
    );
}