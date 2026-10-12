import React from "react";
import { BookOpen, Heart, Sparkles, CheckCircle2, Clock } from "lucide-react";

const CareJournal = ({ booking }) => {
    const isUnderway =
        booking?.statusType === "in-progress" ||
        booking?.statusType === "completed";

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                        <BookOpen size={15} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">
                        Nhật ký chăm sóc thú cưng
                    </h3>
                </div>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                    Live PetCare Log
                </span>
            </div>

            {/* Banner summary */}
            <div className="flex gap-4 p-3.5 bg-gradient-to-r from-amber-50/60 via-rose-50/30 to-white rounded-xl border border-amber-100/60 mb-4">
                <div className="shrink-0 w-20 bg-white rounded-xl p-2 border border-amber-200/80 flex flex-col items-center justify-center text-center shadow-2xs">
                    <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-1">
                        <Heart size={13} className="fill-rose-500" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 leading-tight">
                        {booking?.pet?.name || "Bé yêu"}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5">
                        Nhật ký ảnh
                    </span>
                </div>

                <div className="space-y-1 flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800 text-xs leading-snug flex items-center gap-1.5">
                        <span>
                            {isUnderway
                                ? `Bé ${booking?.pet?.name || "thú cưng"} đang được chăm sóc tận tâm`
                                : "Nhật ký sẽ được cập nhật khi bắt đầu dịch vụ"}
                        </span>
                        {isUnderway && <Sparkles size={12} className="text-amber-500" />}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        {isUnderway
                            ? "Kỹ thuật viên cập nhật nhật ký từng bước để bạn hoàn toàn an tâm theo dõi tình trạng bé từ xa."
                            : "Khi mang bé đến cơ sở và bắt đầu quy trình, kỹ thuật viên sẽ chụp ảnh và ghi nhận từng bước tại đây."}
                    </p>
                </div>
            </div>

            {/* Log items */}
            {isUnderway ? (
                <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/60 text-xs">
                        <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">
                                    Đón tiếp và kiểm tra sức khỏe lông da
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">14:05</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                                Bé ngoan, không có vết thương hở, lông bông mềm sẵn sàng cho bước tắm sấy.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-teal-50/40 border border-teal-100/60 text-xs">
                        <CheckCircle2 size={15} className="text-teal-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">
                                    Tắm sấy thảo dược thư giãn & vệ sinh tai
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">14:35</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                                Đã ngâm bồn bọt mịn, làm sạch sâu kẽ chân và vệ sinh tai móng sạch sẽ.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50/40 border border-amber-100/60 text-xs">
                        <Clock size={15} className="text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">
                                    {booking?.statusType === "completed"
                                        ? "Hoàn tất cắt tỉa tạo kiểu & xịt dưỡng mượt"
                                        : "Đang tiến hành cắt tỉa & tạo dáng theo yêu cầu"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {booking?.statusType === "completed" ? "15:45" : "Đang thực hiện"}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                                {booking?.statusType === "completed"
                                    ? "Bé đã thơm tho, lông vào nếp tuyệt đẹp và đang chờ phụ huynh đến đón."
                                    : "Stylist đang tỉa form lông tròn dễ thương theo đúng phong cách đã chọn."}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                    {[
                        "1. Kiểm tra da lông & vệ sinh cơ bản ban đầu",
                        "2. Tắm bồn sục thảo dược & sấy phồng lông",
                        "3. Cắt tỉa tạo kiểu & xịt dưỡng hoàn thiện",
                    ].map((stepText, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2.5 text-xs text-slate-400 py-1"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="text-[11px] text-slate-500">{stepText}</span>
                            <span className="text-[10px] italic text-slate-400 ml-auto">
                                (Đang chờ)
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CareJournal;