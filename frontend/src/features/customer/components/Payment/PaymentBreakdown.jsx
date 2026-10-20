import { Receipt, Sparkles, Tag, ShieldCheck } from "lucide-react";

function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export default function PaymentBreakdown({
    basePrice,
    platformFee,
    appliedDiscount = 0,
    finalTotal,
    discountCode = "",
}) {
    // Ước tính điểm tích lũy: 10.000đ = 1 point
    const earnedPoints = Math.max(10, Math.floor(finalTotal / 10000));

    return (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Receipt size={17} />
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                        Chi tiết thanh toán
                    </h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">Bao gồm VAT</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
                {/* Giá dịch vụ */}
                <div className="flex items-center justify-between gap-4 text-slate-600">
                    <span>Giá dịch vụ niêm yết:</span>
                    <span className="font-semibold text-slate-800">
                        {formatCurrency(basePrice)}
                    </span>
                </div>

                {/* Phí tiện ích & Bảo hiểm */}
                <div className="flex items-center justify-between gap-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                        <span>Phí tiện ích & bảo hiểm chăm sóc:</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                        {formatCurrency(platformFee)}
                    </span>
                </div>

                {/* Giảm giá */}
                {appliedDiscount > 0 && (
                    <div className="flex items-center justify-between gap-4 text-emerald-700 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Tag size={14} className="shrink-0" />
                            <span>Mã giảm giá {discountCode ? `(${discountCode})` : ""}:</span>
                        </span>
                        <span className="font-extrabold text-emerald-700">
                            -{formatCurrency(appliedDiscount)}
                        </span>
                    </div>
                )}

                {/* Total amount section */}
                <div className="border-t border-dashed border-slate-200 pt-3.5 space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <div>
                            <span className="font-bold text-slate-800 text-sm sm:text-base block">
                                Tổng cộng thanh toán:
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                                Đã bao gồm các khoản phí niêm yết
                            </span>
                        </div>

                        <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
                            {formatCurrency(finalTotal)}
                        </span>
                    </div>

                    {/* Member points reward banner */}
                    <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Sparkles size={14} className="text-amber-600 shrink-0" />
                            <span>Điểm thưởng tích lũy:</span>
                        </span>
                        <strong className="font-extrabold text-amber-800">
                            +{earnedPoints} PetPoints
                        </strong>
                    </div>
                </div>
            </div>
        </section>
    );
}