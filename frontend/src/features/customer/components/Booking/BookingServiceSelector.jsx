import { Scissors, Sparkles, Check, Bath, Flower2, Clock, ShieldCheck } from "lucide-react";

const getServiceIcon = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("tắm")) return Bath;
    if (lower.includes("grooming") || lower.includes("tỉa")) return Scissors;
    if (lower.includes("spa")) return Flower2;
    return Sparkles;
};

const BookingServiceSelector = ({
    services,
    selectedService,
    onSelect,
    onRetry,
    loading = false,
    error = "",
    emptyMessage = "Chọn thú cưng và chi nhánh có dịch vụ phù hợp.",
}) => {
    return (
        <section id="step-service" className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
                        <Scissors size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                3. Chọn gói dịch vụ chính
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                                {services.length} gói dịch vụ
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Dịch vụ tại chi nhánh phù hợp với loài thú cưng đã chọn
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading && <p role="status" className="text-sm text-slate-500">Đang tải dịch vụ...</p>}
                {error && <p role="alert" className="text-sm text-red-600">{error} <button type="button" onClick={onRetry} className="underline">Thử lại</button></p>}
                {!loading && !error && !services.length && <p role="status" className="text-sm text-slate-500">{emptyMessage}</p>}
                {services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const Icon = getServiceIcon(service.name);
                    const duration = service.bookingType === 'BOARDING' ? 'Theo ngày lưu trú' : service.durationMinutes + ' phút';
                    const includes = service.petTypes.map((type) => type === 'CAT' ? 'Dành cho mèo' : 'Dành cho chó');
                    const isPopular = false;

                    return (
                        <button
                            key={service.id}
                            type="button"
                            onClick={() => onSelect(service)}
                            className={`group relative rounded-2xl border p-4.5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                isSelected
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50/80 via-teal-50/20 to-white shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                                    : "border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-sm hover:-translate-y-0.5"
                            }`}
                        >
                            {/* Badges */}
                            <div className="flex items-center justify-between w-full mb-3">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                                            isSelected
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
                                        }`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    {isPopular && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                                            Khuyên dùng
                                        </span>
                                    )}
                                </div>

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

                            {/* Service Content */}
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                                    {service.name}
                                </h3>

                                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 mb-2 font-medium">
                                    <Clock size={12} className="text-emerald-600" />
                                    <span>Thời gian: {duration}</span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                    {service.description}
                                </p>

                                {/* Feature checklist */}
                                <div className="space-y-1.5 pt-2.5 border-t border-slate-100/90">
                                    {includes.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                            <ShieldCheck size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="leading-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price footer */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                                <span className="text-[11px] text-slate-400">Trọn gói từ</span>
                                <span className="text-base font-extrabold text-emerald-600 group-hover:text-emerald-700">
                                    {service.price}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingServiceSelector;
