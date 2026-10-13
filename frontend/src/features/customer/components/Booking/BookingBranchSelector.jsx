import { MapPin, Building2, Check } from "lucide-react";

const BookingBranchSelector = ({
    branches,
    selectedBranch,
    onSelect,
}) => {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <MapPin size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        2. Chọn cơ sở
                    </h2>
                    <p className="text-xs text-gray-500">
                        Chọn cơ sở gần bạn nhất
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
                {branches.map((branch) => {
                    const isSelected = selectedBranch?.id === branch.id;
                    return (
                        <button
                            key={branch.id}
                            type="button"
                            onClick={() => onSelect(branch)}
                            className={`relative rounded-xl border p-4 text-left transition flex items-start gap-3 ${isSelected
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-gray-200 hover:border-emerald-300"
                                }`}
                        >
                            {isSelected && (
                                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                                    <Check size={12} strokeWidth={3} />
                                </span>
                            )}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100/60 text-emerald-600">
                                <Building2 size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {branch.name}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} className="text-gray-400 shrink-0" />
                                    {branch.address}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingBranchSelector;