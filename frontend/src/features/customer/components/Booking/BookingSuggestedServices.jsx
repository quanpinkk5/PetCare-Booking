import { Sparkles, Check, Plus, HeartHandshake } from "lucide-react";

const BookingSuggestedServices = ({
    services = [],
    selectedAddons = [],
    onToggleAddon,
}) => {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm shadow-orange-500/20">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                Dịch vụ bổ sung đề xuất (Add-on)
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/80">
                                Ưu đãi đi kèm
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Chăm sóc chu đáo hơn cho bé cưng với chi phí tiết kiệm
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {services.map((addon) => {
                    const isChecked = selectedAddons.some((item) => item.id === addon.id);
                    const addonPrice = addon.price || "50.000₫";

                    return (
                        <div
                            key={addon.id}
                            className={`rounded-2xl border p-4 text-left transition-all duration-200 flex flex-col justify-between ${
                                isChecked
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50/70 to-teal-50/20 shadow-sm ring-1 ring-emerald-500/30"
                                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs"
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h3 className="font-bold text-xs text-slate-900">
                                        {addon.name}
                                    </h3>
                                    <span className="font-extrabold text-xs text-emerald-600 shrink-0">
                                        +{addonPrice}
                                    </span>
                                </div>

                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
                                    {addon.description}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggleAddon && onToggleAddon(addon)}
                                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    isChecked
                                        ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                                        : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/70 hover:border-emerald-200"
                                }`}
                            >
                                {isChecked ? (
                                    <>
                                        <Check size={13} strokeWidth={3} />
                                        <span>Đã thêm</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={13} />
                                        <span>Thêm dịch vụ</span>
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingSuggestedServices;