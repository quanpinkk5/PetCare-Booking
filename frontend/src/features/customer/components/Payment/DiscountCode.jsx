import { useState } from "react";
import {
    Tag,
    AlertCircle,
    CheckCircle2,
    Ticket,
    Sparkles,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { availableCoupons } from "../../data/paymentData";

function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export default function DiscountCode({
    discountCode,
    onDiscountCodeChange,
    onApplyDiscount,
    discountError,
    discountSuccess,
    appliedDiscount = 0,
    onRemoveDiscount,
}) {
    const [showAllCoupons, setShowAllCoupons] = useState(false);

    const handleSelectCoupon = (code) => {
        onDiscountCodeChange(code);
        // Tự động kích hoạt áp dụng mã
        setTimeout(() => {
            onApplyDiscount(code);
        }, 50);
    };

    return (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Tag size={18} />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                            Mã ưu đãi & Voucher
                        </h2>
                        <p className="text-xs text-slate-500">
                            Áp dụng mã giảm giá để tiết kiệm chi phí dịch vụ
                        </p>
                    </div>
                </div>

                {appliedDiscount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <Sparkles size={12} />
                        <span>Đã giảm {formatCurrency(appliedDiscount)}</span>
                    </span>
                )}
            </div>

            {/* Input form */}
            <form
                className="flex flex-col sm:flex-row gap-2 pt-1"
                onSubmit={(event) => {
                    event.preventDefault();
                    onApplyDiscount();
                }}
            >
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(event) => onDiscountCodeChange(event.target.value.toUpperCase())}
                        placeholder="Nhập mã ưu đãi (Ví dụ: PETCARE10)"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-mono uppercase outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 placeholder-slate-400 placeholder:normal-case"
                    />
                    {discountCode && (
                        <button
                            type="button"
                            onClick={() => {
                                onDiscountCodeChange("");
                                if (onRemoveDiscount) onRemoveDiscount();
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition cursor-pointer shrink-0"
                >
                    Áp dụng mã
                </button>
            </form>

            {/* Error & Success Messages */}
            {discountError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 animate-in fade-in">
                    <AlertCircle size={16} className="shrink-0 text-red-500" />
                    <span>{discountError}</span>
                </div>
            )}

            {discountSuccess && (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                        <span className="font-medium">{discountSuccess}</span>
                    </div>
                    {onRemoveDiscount && (
                        <button
                            type="button"
                            onClick={onRemoveDiscount}
                            className="text-xs text-slate-500 hover:text-red-600 underline font-medium cursor-pointer"
                        >
                            Gỡ mã
                        </button>
                    )}
                </div>
            )}

            {/* Available Coupons Spotlight List */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Ticket size={14} className="text-emerald-600" />
                        <span>Mã ưu đãi dành riêng cho bạn</span>
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowAllCoupons(!showAllCoupons)}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                        <span>{showAllCoupons ? "Thu gọn" : "Xem tất cả (4)"}</span>
                        {showAllCoupons ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(showAllCoupons ? availableCoupons : availableCoupons.slice(0, 2)).map((coupon) => {
                        const isCurrentActive = discountCode.trim().toUpperCase() === coupon.code && appliedDiscount > 0;

                        return (
                            <div
                                key={coupon.code}
                                className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-2.5 ${
                                    isCurrentActive
                                        ? "bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400 shadow-2xs"
                                        : "bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-emerald-300 shadow-2xs"
                                }`}
                            >
                                <div className="min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-mono font-black text-xs text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                            {coupon.code}
                                        </span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${coupon.badgeColor}`}>
                                            {coupon.badge}
                                        </span>
                                    </div>
                                    <p className="font-bold text-slate-800 text-xs">
                                        {coupon.title}
                                    </p>
                                    <p className="text-[11px] text-slate-400 line-clamp-1">
                                        {coupon.description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleSelectCoupon(coupon.code)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                        isCurrentActive
                                            ? "bg-emerald-700 text-white"
                                            : "bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-emerald-700 shadow-2xs"
                                    }`}
                                >
                                    {isCurrentActive ? "Đang dùng" : "Áp dụng"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}