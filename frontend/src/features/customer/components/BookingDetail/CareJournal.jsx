import React from "react";
import { BookOpen, Heart } from "lucide-react";

const CareJournal = () => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <BookOpen
                    size={16}
                    className="text-emerald-600"
                />

                <h3 className="font-bold text-slate-800 text-[13px]">
                    Nhật ký chăm sóc
                </h3>
            </div>

            <div className="flex gap-4">
                <div className="shrink-0 w-24 bg-amber-50 rounded-xl p-2.5 border border-amber-200 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-1">
                        <Heart
                            size={14}
                            className="fill-rose-500"
                        />
                    </div>

                    <span className="text-[10px] font-semibold text-amber-800 leading-tight">
                        Nhật ký thú cưng
                    </span>

                    <span className="text-[8px] text-slate-400 mt-0.5">
                        PetCare Log
                    </span>
                </div>

                <div className="space-y-1 flex flex-col justify-center">
                    <h4 className="font-semibold text-slate-800 text-xs leading-snug">
                        Nhật ký sẽ được cập nhật khi cơ sở bắt đầu thực hiện dịch vụ.
                    </h4>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Bạn có thể quay lại xem nhật ký chăm sóc chi tiết từ khi dịch vụ bắt đầu đến khi hoàn thành.
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-2 text-[11px] text-slate-400"
                    >
                        <span className="w-2 h-2 rounded-full bg-slate-300" />

                        <span>Chưa có nhật ký</span>

                        <span className="text-[10px] italic text-slate-400">
                            (Nhật ký sẽ được cập nhật)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareJournal;