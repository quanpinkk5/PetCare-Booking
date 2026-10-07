import { Scissors, Sparkles, Check } from "lucide-react";

const BookingServiceSelector = ({
    services,
    selectedService,
    onSelect,
}) => {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Scissors size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        3. Chọn dịch vụ
                    </h2>
                    <p className="text-xs text-gray-500">
                        Chọn dịch vụ chăm sóc phù hợp
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                {services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                        <button
                            key={service.id}
                            type="button"
                            onClick={() => onSelect(service)}
                            className={`relative rounded-xl border p-4 text-left transition flex flex-col justify-between ${isSelected
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-gray-200 hover:border-emerald-300"
                                }`}
                        >
                            {isSelected && (
                                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                                    <Check size={12} strokeWidth={3} />
                                </span>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-emerald-500" />
                                    <h3 className="font-semibold text-gray-900">
                                        {service.name}
                                    </h3>
                                </div>

                                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            <p className="mt-3 font-bold text-emerald-600 text-base">
                                {service.price}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingServiceSelector;