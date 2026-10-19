import { MapPin, Building2, Check, Star, Clock, Phone, Sparkles } from "lucide-react";

const BookingBranchSelector = ({
    branches,
    selectedBranch,
    onSelect,
}) => {
    return (
        <section id="step-branch" className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                2. Chọn cơ sở chăm sóc
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                                {branches.length} chi nhánh
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Chọn chi nhánh thuận tiện nhất với vị trí của bạn
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((branch, index) => {
                    const isSelected = selectedBranch?.id === branch.id;
                    const defaultImg = index === 0
                        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC3-_PP7VWj5tqP7kr55IKE7l-9zTzySPvB0bUIsr9lhb-O0mNTbo04WCOH4eqolILlmIbZy2Z27u4hNCBzi6pyYP1K20skb1-aRCVCsKU8DT5ooCqg3mBwQ0Bx1OmOENFoEKR-DHzJJ9bMWkV89NfSzPJ3IpUweDQjq7ZWYNy3OHSU7Q-tYzeXzdD46WHgj6bXbbQc2KfQNjL-3yDg3VoOEmrypJkaroaWE4Jqjdxw2Y9jm4fU71gt"
                        : "https://lh3.googleusercontent.com/aida-public/AB6AXuBYwU4d5oE_kIZXazzMLp_Kq8KJRAat_ohctJPpZQo2gwGPIGfQlJHofl7jCYPGPCFhMwDD5VxsVbP7-MAmoiwkFJVN0LYp4KUaeBzsP8DkMtNgGTFUzKu3SvwP7332FA7yPUlFjwHn4JEAhhur-if1E4z7m36FulluMzjIaKPumCGeYrS0Fijda8ZgTZNpABaulHz6PIulpANf_4lzU7QDzd-vjGWG6x6T4dkti5Nw5xC8qIOY5oll";
                    const branchImg = branch.image || defaultImg;
                    const rating = branch.rating || (index === 0 ? 4.9 : 4.8);
                    const reviewsCount = branch.reviewsCount || (index === 0 ? 256 : 180);
                    const phone = branch.phone || "0912 345 678";

                    return (
                        <button
                            key={branch.id}
                            type="button"
                            onClick={() => onSelect(branch)}
                            className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                isSelected
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50/80 via-teal-50/20 to-white shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                                    : "border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-sm hover:-translate-y-0.5"
                            }`}
                        >
                            {/* Checkmark Badge */}
                            <div className="absolute top-3.5 right-3.5 z-10">
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                                        isSelected
                                            ? "bg-emerald-600 text-white shadow-xs"
                                            : "border border-slate-300 bg-white group-hover:border-emerald-400"
                                    }`}
                                >
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                </span>
                            </div>

                            <div className="flex gap-3.5 items-start">
                                {/* Facility Image */}
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-xs">
                                    <img
                                        src={branchImg}
                                        alt={branch.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white flex items-center gap-0.5">
                                        <Star size={9} className="text-amber-400 fill-amber-400" />
                                        {rating}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition truncate">
                                            {branch.name}
                                        </h3>
                                        {index === 0 && (
                                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200/80">
                                                Gần bạn nhất
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-slate-500 flex items-start gap-1 leading-relaxed">
                                        <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{branch.address}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Footer specs */}
                            <div className="mt-3.5 pt-3 border-t border-slate-100/90 flex items-center justify-between text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} className="text-slate-400" />
                                    08:00 - 20:00 (Mở cửa)
                                </span>
                                <span className="flex items-center gap-1 font-medium text-slate-600">
                                    <Phone size={11} className="text-slate-400" />
                                    {phone}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingBranchSelector;