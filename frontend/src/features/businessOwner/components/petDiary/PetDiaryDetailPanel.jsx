
import { useState } from "react";
import {
    Activity,
    ArrowRight,
    Calendar,
    Camera,
    Clock,
    Edit3,
    FileText,
    Moon,
    ShieldCheck,
    Utensils,
} from "lucide-react";

import { TIMELINE_DATA } from "../../data/petDiaryData";

const ACTIVITY_OPTIONS = [
    "🍽️ Ăn uống",
    "🚶 Đi dạo",
    "🌙 Nghỉ ngơi",
    "✂️ Grooming",
    "💊 Uống thuốc",
];

export default function PetDiaryDetailPanel({ pet }) {
    const [selectedActivity, setSelectedActivity] = useState(0);
    const [note, setNote] = useState("");

    if (!pet) {
        return (
            <aside className="w-full xl:w-[380px] shrink-0 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                <p className="text-sm text-slate-400">
                    Chọn thú cưng để xem thông tin chi tiết.
                </p>
            </aside>
        );
    }

    const resetForm = () => {
        setSelectedActivity(0);
        setNote("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Hiện tại giao diện sử dụng dữ liệu mẫu.
        // Chưa có API để lưu nhật ký vào cơ sở dữ liệu.
        console.log("Pet diary update:", {
            petId: pet.id,
            activity: ACTIVITY_OPTIONS[selectedActivity],
            note,
        });
    };

    return (
        <aside className="w-full xl:w-[380px] bg-white rounded-2xl border border-slate-200/80 shadow-2xs shrink-0 flex flex-col p-5 space-y-5">
            {/* Hồ sơ thú cưng */}
            <div className="relative flex items-start gap-3.5 pb-4 border-b border-slate-100">
                <img
                    alt={pet.name}
                    src={pet.img}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm shrink-0"
                />

                <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                                {pet.name}
                            </h3>
                            <span className={`font-black text-sm ${pet.genderColor}`}>
                                {pet.gender}
                            </span>
                        </div>

                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${pet.statusBadge}`}
                        >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                            {pet.status}
                        </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                        {pet.breed} • {pet.age} • {pet.weight}
                    </p>

                    <div
                        className={`flex items-center gap-1.5 text-[11px] font-medium mt-1 ${pet.roomColor}`}
                    >
                        <ShieldCheck size={14} />
                        <span>
                            {pet.room} • {pet.roomCode}
                        </span>
                    </div>
                </div>
            </div>

            {/* Thông tin chủ nuôi và booking */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] pb-4 border-b border-slate-100">
                <div>
                    <span className="text-slate-400 block text-[10px]">
                        Chủ nuôi
                    </span>
                    <span className="font-medium text-slate-700">
                        {pet.owner}
                    </span>
                </div>

                <div>
                    <span className="text-slate-400 block text-[10px]">
                        Mã booking
                    </span>
                    <span className="font-medium text-slate-700">
                        BD-250520-001
                    </span>
                </div>

                <div>
                    <span className="text-slate-400 block text-[10px]">
                        SĐT
                    </span>
                    <span className="font-medium text-slate-700">
                        {pet.phone}
                    </span>
                </div>

                <div>
                    <span className="text-slate-400 block text-[10px]">
                        Loại dịch vụ
                    </span>
                    <span className="font-medium text-slate-700">
                        Boarding
                    </span>
                </div>

                <div className="col-span-1 truncate">
                    <span className="text-slate-400 block text-[10px]">
                        Email
                    </span>
                    <span className="font-medium text-slate-700 truncate block">
                        {pet.email}
                    </span>
                </div>

                <div>
                    <span className="text-slate-400 block text-[10px]">
                        Chi nhánh
                    </span>
                    <span className="font-medium text-slate-700">
                        Happy Pet Cầu Giấy
                    </span>
                </div>
            </div>

            {/* Lịch lưu trú */}
            <div className="grid grid-cols-2 gap-y-2.5 text-[11px] pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                    <p className="text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        Check-in
                    </p>
                    <p className="font-bold text-slate-800">
                        {pet.checkin} {pet.checkinTime}
                    </p>
                </div>

                <div className="space-y-0.5">
                    <p className="text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        Check-out dự kiến
                    </p>
                    <p className="font-bold text-slate-800">
                        {pet.checkout}{" "}
                        <span className="text-emerald-600 font-normal text-[10px]">
                            {pet.checkoutSub}
                        </span>
                    </p>
                </div>

                <div className="space-y-0.5">
                    <p className="text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        Thời gian
                    </p>
                    <p className="font-bold text-slate-800">5 ngày</p>
                </div>

                <div className="space-y-0.5">
                    <p className="text-slate-400 flex items-center gap-1">
                        <Utensils size={12} />
                        Lịch cho ăn
                    </p>
                    <p className="font-bold text-slate-800">
                        08:00 • 14:00 • 20:00
                    </p>
                </div>
            </div>

            {/* Ghi chú chăm sóc */}
            {/* <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100 text-[11px]">
                <div className="pt-1 border-slate-200/60">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <FileText size={12} />
                        Ghi chú chăm sóc
                    </p>

                    <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        {pet.careNote}
                    </p>
                </div>
            </div> */}

            {/* Các thao tác */}
            {/* <div className="grid grid-cols-3 gap-2 pt-1 pb-4 border-b border-slate-100"> */}
            {/* <button
                    type="button"
                    className="py-2 px-1 text-center font-bold text-emerald-700 border border-emerald-600 rounded-xl hover:bg-emerald-50 transition text-[11px]"
                >
                    Xem chi tiết
                </button>

                <button
                    type="button"
                    className="py-2 px-1 text-center font-bold text-emerald-800 bg-emerald-100 rounded-xl hover:bg-emerald-200 transition text-[11px] flex items-center justify-center gap-1"
                >
                    <Edit3 size={12} />
                    Nhật ký
                </button>

                <button
                    type="button"
                    className="py-2 px-1 text-center font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 shadow-sm transition text-[11px]"
                >
                    Check-out
                </button> */}
            {/* </div> */}

            {/* Timeline chăm sóc */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-xs">
                        Lịch chăm sóc hôm nay
                    </h4>

                    <button
                        type="button"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold text-[10px] flex items-center gap-0.5"
                    >
                        Xem tất cả
                        <ArrowRight size={10} />
                    </button>
                </div>

                <div className="space-y-2.5 text-[11px]">
                    {TIMELINE_DATA.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-slate-400 font-medium text-[10px] w-8 shrink-0">
                                        {item.time}
                                    </span>

                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}
                                    >
                                        <Icon size={10} />
                                    </div>

                                    <div className="min-w-0">
                                        <span className="font-semibold text-slate-700">
                                            {item.type}
                                        </span>

                                        {item.desc && (
                                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                                {item.desc}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {item.img && (
                                    <img
                                        alt="Ảnh cập nhật"
                                        src={item.img}
                                        className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-200 shrink-0"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form cập nhật */}
            <form className="space-y-3" onSubmit={handleSubmit}>
                <h4 className="font-bold text-slate-800 text-xs">
                    Thêm cập nhật mới
                </h4>

                <div className="flex flex-wrap gap-1.5">
                    {ACTIVITY_OPTIONS.map((label, index) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => setSelectedActivity(index)}
                            className={`px-2.5 py-1 rounded-full font-medium text-[10px] flex items-center gap-1 ${selectedActivity === index
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <textarea
                        rows={3}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Nhập ghi chú về tình trạng, hành vi, sức khỏe..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500 focus:bg-white resize-none outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm shadow-emerald-200 transition"
                    >
                        Lưu cập nhật
                    </button>
                </div>
            </form>
        </aside>
    );
}
