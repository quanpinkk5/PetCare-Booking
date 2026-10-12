import { Check } from "lucide-react";
import { paymentMethods } from "../../data/paymentData";

export default function PaymentMethods({
    selectedMethod,
    onSelectMethod,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-800">
                Phương thức thanh toán
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                Chọn phương thức thanh toán phù hợp với bạn.
            </p>

            <div className="mt-5 space-y-3">
                {paymentMethods.map((method) => {
                    const selected = selectedMethod === method.id;
                    const IconComponent = method.icon;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => onSelectMethod(method.id)}
                            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition cursor-pointer ${selected
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                                }`}
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${selected
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                <IconComponent size={22} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-800">{method.name}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {method.description}
                                </p>
                            </div>

                            <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                        : "border-slate-300"
                                    }`}
                            >
                                {selected && <Check size={12} strokeWidth={3} />}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}