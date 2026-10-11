
import { AlertCircle, CheckCircle2, Tag } from "lucide-react";

export default function DiscountCode({
    discountCode,
    onDiscountCodeChange,
    onApplyDiscount,
    discountError,
    discountSuccess,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-2">
                <Tag size={18} className="text-emerald-600" />
                <h2 className="font-bold text-slate-800">Mã ưu đãi</h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
                Nhập mã để nhận ưu đãi cho lịch hẹn.
            </p>

            <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                    event.preventDefault();
                    onApplyDiscount();
                }}
            >
                <input
                    type="text"
                    value={discountCode}
                    onChange={(event) => onDiscountCodeChange(event.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
                >
                    Áp dụng
                </button>
            </form>

            {discountError && (
                <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{discountError}</span>
                </p>
            )}

            {discountSuccess && (
                <p className="mt-3 text-sm text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{discountSuccess}</span>
                </p>
            )}

            <p className="mt-3 text-xs text-slate-400">
                Mã mẫu: PETCARE10 hoặc FREESHIP
            </p>
        </section>
    );
}