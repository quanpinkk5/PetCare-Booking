import { PawPrint, Check } from "lucide-react";

const BookingPetSelector = ({
    pets,
    selectedPet,
    onSelect,
}) => {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <PawPrint size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        1. Chọn thú cưng
                    </h2>
                    <p className="text-xs text-gray-500">
                        Chọn thú cưng bạn muốn sử dụng dịch vụ
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                {pets.map((pet) => {
                    const isSelected = selectedPet?.id === pet.id;
                    return (
                        <button
                            key={pet.id}
                            type="button"
                            onClick={() => onSelect(pet)}
                            className={`relative rounded-xl border p-4 text-left transition ${isSelected
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-gray-200 hover:border-emerald-300"
                                }`}
                        >
                            {isSelected && (
                                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                                    <Check size={12} strokeWidth={3} />
                                </span>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-full overflow-hidden bg-emerald-50 border border-emerald-100 shrink-0 flex items-center justify-center">
                                    <img
                                        src={pet.image}
                                        alt={pet.name}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            if (e.currentTarget.nextSibling) {
                                                e.currentTarget.nextSibling.style.display = "flex";
                                            }
                                        }}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="hidden h-full w-full items-center justify-center text-emerald-600">
                                        <PawPrint size={24} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {pet.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {pet.breed}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {pet.gender} • {pet.weight}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default BookingPetSelector;