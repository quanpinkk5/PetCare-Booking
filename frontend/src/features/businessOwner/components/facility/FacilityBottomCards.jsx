import { CheckCircle2, Clock, Edit2 } from "lucide-react";
import {
    SCHEDULE,
    GALLERY,
    POLICIES,
    FACILITY_NOTE,
} from "../../data/facilityData";

function EditButton() {
    return (
        <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
            <Edit2 size={12} />
            Chỉnh sửa
        </button>
    );
}

export default function FacilityBottomCards() {
    return (
        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                            Giờ hoạt động
                        </h3>
                        <EditButton />
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                        {SCHEDULE.map((item) => (
                            <div
                                key={item.day}
                                className="flex items-center justify-between gap-2 text-slate-600"
                            >
                                <span className="font-medium text-slate-500">{item.day}</span>
                                <span className="whitespace-nowrap font-medium text-slate-800">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Clock size={16} />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-4">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                        Hình ảnh cơ sở
                    </h3>
                    <EditButton />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                    {GALLERY.map((url, index) => (
                        <div
                            key={url}
                            className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100"
                        >
                            <img
                                alt={`Hình ảnh cơ sở ${index + 1}`}
                                src={url}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-emerald-600 transition hover:bg-emerald-50"
                    >
                        <Edit2 size={20} className="mb-1" />
                        <span className="text-[10px] font-semibold">Thêm ảnh</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                            Chính sách & ghi chú
                        </h3>
                        <EditButton />
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600">
                        {POLICIES.map((policy) => (
                            <li key={policy} className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                                <span>{policy}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 rounded-lg border border-amber-200/60 bg-amber-50/70 p-2.5 text-[11px] leading-relaxed text-amber-900">
                    <span className="mb-0.5 flex items-center gap-1 font-bold text-amber-800">
                        ★ Ghi chú
                    </span>
                    {FACILITY_NOTE}
                </div>
            </div>
        </section>
    );
}