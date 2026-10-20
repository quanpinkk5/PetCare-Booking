import { useState } from "react";
import {
    Check,
    Copy,
    QrCode,
    ShieldCheck,
    CreditCard,
    Smartphone,
    Info,
    Sparkles,
    Landmark,
} from "lucide-react";
import { paymentMethods, bankTransferDetails } from "../../data/paymentData";

function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export default function PaymentMethods({
    selectedMethod,
    onSelectMethod,
    bookingCode = "BK20260825001",
    finalTotal = 285000,
}) {
    const [copiedField, setCopiedField] = useState(null);

    const handleCopyText = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const transferContent = `THANHTOAN ${bookingCode}`;

    return (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-xs space-y-5">
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CreditCard size={18} />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                            Phương thức thanh toán
                        </h2>
                        <p className="text-xs text-slate-500">
                            Lựa chọn phương thức thanh toán an toàn và tiện lợi nhất cho bạn
                        </p>
                    </div>
                </div>
            </div>

            {/* Methods options list */}
            <div className="space-y-3">
                {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    const IconComponent = method.icon;

                    return (
                        <div
                            key={method.id}
                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                isSelected
                                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-xs"
                                    : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60"
                            }`}
                        >
                            {/* Method Selection Row */}
                            <button
                                type="button"
                                onClick={() => onSelectMethod(method.id)}
                                className="flex w-full items-center gap-3.5 p-4 text-left transition cursor-pointer"
                            >
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 shadow-2xs ${
                                        isSelected
                                            ? "bg-emerald-600 text-white shadow-emerald-600/20"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    <IconComponent size={22} />
                                </div>

                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-bold text-slate-800 text-sm sm:text-base">
                                            {method.name}
                                        </p>
                                        {method.tag && (
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.tagColor}`}
                                            >
                                                {method.tag}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
                                        {method.description}
                                    </p>
                                </div>

                                {/* Radio Indicator */}
                                <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                                        isSelected
                                            ? "border-emerald-600 bg-emerald-600 text-white shadow-2xs"
                                            : "border-slate-300 bg-white"
                                    }`}
                                >
                                    {isSelected && <Check size={12} strokeWidth={3.5} />}
                                </div>
                            </button>

                            {/* Sub-panel details when selected */}
                            {isSelected && (
                                <div className="border-t border-emerald-100/80 bg-white/80 p-4 sm:p-5 text-xs text-slate-600 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {/* 1. VNPay Sub-panel */}
                                    {method.id === "vnpay" && (
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900">
                                                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="font-semibold">Hỗ trợ quét qua hơn 40+ ứng dụng ngân hàng & Ví VNPay</p>
                                                    <p className="text-[11px] text-blue-700">
                                                        Vietcombank, MB Bank, Techcombank, BIDV, Agribank, ACB, VPBank, TPBank, Viettel Money,...
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-[11px]">
                                                Sau khi bấm "Xác nhận thanh toán", mã QR thanh toán VNPay sẽ hiển thị để bạn quét và xác thực chuyển khoản ngay lập tức.
                                            </p>
                                        </div>
                                    )}

                                    {/* 2. MoMo Sub-panel */}
                                    {method.id === "momo" && (
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-pink-50/60 border border-pink-100 text-pink-900">
                                                <Smartphone size={16} className="text-pink-600 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="font-semibold">Thanh toán siêu tốc 1 chạm qua ứng dụng MoMo</p>
                                                    <p className="text-[11px] text-pink-700">
                                                        Tự động chuyển tới app MoMo hoặc hiển thị mã QR MoMo Pay an toàn tuyệt đối.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Bank Transfer Sub-panel (Rich & Interactive) */}
                                    {method.id === "bank_transfer" && (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 space-y-3">
                                                <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                                                    <span className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                                                        <Landmark size={15} className="text-emerald-700" />
                                                        Thông tin chuyển khoản Napas247 (VietQR)
                                                    </span>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                                        Tự động duyệt 24/7
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 block text-[11px]">Ngân hàng thụ hưởng:</span>
                                                        <strong className="text-slate-800 font-bold block pt-0.5">
                                                            {bankTransferDetails.bankName}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span className="text-slate-400 block text-[11px]">Tên chủ tài khoản:</span>
                                                        <strong className="text-slate-800 font-bold block pt-0.5">
                                                            {bankTransferDetails.accountHolder}
                                                        </strong>
                                                    </div>

                                                    {/* Account Number with Copy */}
                                                    <div className="sm:col-span-1">
                                                        <span className="text-slate-400 block text-[11px]">Số tài khoản:</span>
                                                        <div className="flex items-center gap-2 pt-0.5">
                                                            <strong className="text-emerald-800 font-mono text-base font-extrabold tracking-wide">
                                                                {bankTransferDetails.accountNumber}
                                                            </strong>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyText(bankTransferDetails.accountNumber.replace(/\s/g, ""), "accountNumber")}
                                                                className="px-2 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 font-semibold text-[11px] hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                                            >
                                                                {copiedField === "accountNumber" ? (
                                                                    <>
                                                                        <Check size={11} className="text-emerald-600" />
                                                                        <span>Đã chép</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={11} />
                                                                        <span>Sao chép</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Total Amount to Transfer */}
                                                    <div className="sm:col-span-1">
                                                        <span className="text-slate-400 block text-[11px]">Số tiền cần chuyển:</span>
                                                        <div className="flex items-center gap-2 pt-0.5">
                                                            <strong className="text-slate-900 font-extrabold text-base">
                                                                {formatCurrency(finalTotal)}
                                                            </strong>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyText(String(finalTotal), "amount")}
                                                                className="px-2 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 font-semibold text-[11px] hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                                            >
                                                                {copiedField === "amount" ? (
                                                                    <>
                                                                        <Check size={11} className="text-emerald-600" />
                                                                        <span>Đã chép</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={11} />
                                                                        <span>Sao chép</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Transfer note with Copy */}
                                                    <div className="sm:col-span-2">
                                                        <span className="text-slate-400 block text-[11px]">Nội dung chuyển khoản (bắt buộc):</span>
                                                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-emerald-300/80 mt-1">
                                                            <span className="font-mono font-black text-emerald-800 text-sm">
                                                                {transferContent}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyText(transferContent, "note")}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                                                            >
                                                                {copiedField === "note" ? (
                                                                    <>
                                                                        <Check size={12} />
                                                                        <span>Đã sao chép</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={12} />
                                                                        <span>Sao chép nội dung</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Cash at Facility Sub-panel */}
                                    {method.id === "cash" && (
                                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 space-y-1">
                                            <p className="font-semibold flex items-center gap-1.5">
                                                <Info size={15} className="text-amber-700 shrink-0" />
                                                Thanh toán trực tiếp khi tiếp nhận thú cưng
                                            </p>
                                            <p className="text-[11px] text-amber-800 leading-relaxed">
                                                Lịch hẹn của bạn sẽ được giữ chỗ. Khi đưa bé đến cơ sở, bạn có thể thanh toán bằng tiền mặt, thẻ ATM hoặc quẹt thẻ tín dụng tại quầy lễ tân.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}