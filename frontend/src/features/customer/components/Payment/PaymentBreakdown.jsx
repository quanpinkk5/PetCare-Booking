
function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export default function PaymentBreakdown({
    basePrice,
    platformFee,
    appliedDiscount,
    finalTotal,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-800">
                Chi tiết thanh toán
            </h2>

            <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">Giá dịch vụ</span>
                    <span className="font-medium text-slate-800">
                        {formatCurrency(basePrice)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">Phí nền tảng</span>
                    <span className="font-medium text-slate-800">
                        {formatCurrency(platformFee)}
                    </span>
                </div>

                {appliedDiscount > 0 && (
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-emerald-700">Giảm giá</span>
                        <span className="font-semibold text-emerald-700">
                            -{formatCurrency(appliedDiscount)}
                        </span>
                    </div>
                )}

                <div className="border-t border-dashed border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-slate-800">
                            Tổng thanh toán
                        </span>

                        <span className="text-xl font-bold text-emerald-700">
                            {formatCurrency(finalTotal)}
                        </span>
                    </div>

                    <p className="mt-2 text-right text-xs text-slate-400">
                        Đã bao gồm các khoản phí hiển thị ở trên
                    </p>
                </div>
            </div>
        </section>
    );
}