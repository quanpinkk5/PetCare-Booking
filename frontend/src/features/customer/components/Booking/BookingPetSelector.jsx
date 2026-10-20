import { useState } from "react";
import { PawPrint, Check, Plus, X, Sparkles, Dog, Cat } from "lucide-react";

const BookingPetSelector = ({
    pets,
    selectedPet,
    onSelect,
    onAddPet,
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPet, setNewPet] = useState({
        name: "",
        breed: "",
        gender: "Đực",
        weight: "",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80",
    });

    const handleCreatePet = (e) => {
        e.preventDefault();
        if (!newPet.name.trim()) return;

        const created = {
            id: Date.now(),
            name: newPet.name,
            breed: newPet.breed || "Thú cưng",
            gender: newPet.gender,
            weight: newPet.weight ? `${newPet.weight}kg` : "4kg",
            image: newPet.image,
        };

        if (onAddPet) {
            onAddPet(created);
        }
        onSelect(created);
        setShowAddModal(false);
        setNewPet({
            name: "",
            breed: "",
            gender: "Đực",
            weight: "",
            image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80",
        });
    };

    return (
        <section id="step-pet" className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
                        <PawPrint size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                1. Chọn thú cưng của bạn
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                                {pets.length} bé cưng
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Chọn bé cưng bạn muốn đặt lịch chăm sóc hôm nay
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-emerald-500/80 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 text-xs font-semibold transition cursor-pointer"
                >
                    <Plus size={14} />
                    <span>Thêm bé mới</span>
                </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {pets.map((pet) => {
                    const isSelected = selectedPet?.id === pet.id;
                    const isCat = pet.breed?.toLowerCase().includes("mèo");

                    return (
                        <button
                            key={pet.id}
                            type="button"
                            onClick={() => onSelect(pet)}
                            className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-white shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                                    : "border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-sm hover:-translate-y-0.5"
                            }`}
                        >
                            {/* Checkmark Indicator */}
                            <div className="absolute top-3.5 right-3.5">
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

                            <div className="flex items-start gap-3.5">
                                {/* Pet Avatar */}
                                <div className="relative shrink-0">
                                    <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                                        <img
                                            src={pet.image}
                                            alt={pet.name}
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                if (e.currentTarget.nextSibling) {
                                                    e.currentTarget.nextSibling.style.display = "flex";
                                                }
                                            }}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="hidden h-full w-full items-center justify-center bg-emerald-50 text-emerald-600">
                                            {isCat ? <Cat size={22} /> : <Dog size={22} />}
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-600 text-[10px] shadow-xs border border-slate-200">
                                        {isCat ? <Cat size={11} className="text-amber-600" /> : <Dog size={11} className="text-emerald-600" />}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0 pr-5">
                                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition truncate">
                                        {pet.name}
                                    </h3>

                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {pet.breed}
                                    </p>

                                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                                            {pet.gender}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                                            {pet.weight}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}

                {/* Add new pet button card */}
                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="rounded-2xl border-2 border-dashed border-slate-300/90 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/30 p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-emerald-700 transition-all cursor-pointer min-h-[96px] group"
                >
                    <div className="w-9 h-9 rounded-full bg-white group-hover:bg-emerald-100 border border-slate-200 group-hover:border-emerald-200 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 shadow-xs transition">
                        <Plus size={18} />
                    </div>
                    <span className="text-xs font-semibold">
                        + Thêm thú cưng mới
                    </span>
                </button>
            </div>

            {/* Modal Thêm Thú Cưng */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="font-bold text-base text-slate-900">
                                    Thêm thú cưng mới
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePet} className="mt-4 space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Tên bé cưng *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: Bơ, Mochi, Milo..."
                                    value={newPet.name}
                                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Giống loài
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="VD: Corgi, Poodle..."
                                        value={newPet.breed}
                                        onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Cân nặng (kg)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="VD: 5"
                                        value={newPet.weight}
                                        onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Giới tính
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Đực", "Cái"].map((gender) => (
                                        <button
                                            key={gender}
                                            type="button"
                                            onClick={() => setNewPet({ ...newPet, gender })}
                                            className={`py-2 rounded-xl text-xs font-semibold border transition ${
                                                newPet.gender === gender
                                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                                >
                                    Lưu bé cưng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BookingPetSelector;