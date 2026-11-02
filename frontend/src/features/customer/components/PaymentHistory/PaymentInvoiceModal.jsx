import { useRef } from "react";
import { createPortal } from "react-dom";
import {
    X,
    Printer,
    Download,
    PawPrint,
    Building2,
    ShieldCheck,
} from "lucide-react";
import {
    formatCurrency,
    numberToWordsVietnamese,
    PAYMENT_METHODS,
    PAYMENT_STATUSES,
} from "../../data/paymentHistoryData";

export default function PaymentInvoiceModal({ transaction, onClose }) {
    const printRef = useRef(null);

    if (!transaction) return null;

    const statusConfig = PAYMENT_STATUSES[transaction.status] || PAYMENT_STATUSES.completed;
    const methodConfig = PAYMENT_METHODS[transaction.method] || PAYMENT_METHODS.vnpay;
    const MethodIcon = methodConfig.icon;
    const StatusIcon = statusConfig.icon;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const invoiceContent = `
=====================================================
PETCARE BOOKING - CHI TIẾT GIAO DỊCH
Mã chứng từ: ${transaction.id}
Mã giao dịch: ${transaction.id}
Mã đặt lịch: ${transaction.bookingId}
Ngày lập: ${transaction.createdAt}
Trạng thái: ${transaction.statusLabel}
-----------------------------------------------------
KHÁCH HÀNG:
- Họ và tên: ${transaction.customerName}
- Số điện thoại: ${transaction.customerPhone}
- Email: ${transaction.customerEmail}
- Địa chỉ: ${transaction.customerAddress || "—"}
- Thú cưng: ${transaction.petName} (${transaction.petBreed})

CƠ SỞ THỰC HIỆN:
- Cơ sở: ${transaction.facilityName}
- Địa chỉ: ${transaction.facilityAddress}
- Điện thoại: ${transaction.facilityPhone}

CHI TIẾT THANH TOÁN:
- Dịch vụ: ${transaction.serviceName} (${formatCurrency(transaction.basePrice)})
- Phí nền tảng: ${formatCurrency(transaction.platformFee)}
- Giảm giá (${transaction.discountCode || "Không có"}): -${formatCurrency(transaction.discount || 0)}
- TỔNG CỘNG THANH TOÁN: ${formatCurrency(transaction.totalAmount)}
- Bằng chữ: ${numberToWordsVietnamese(transaction.totalAmount)}
- Phương thức: ${transaction.methodLabel}
- Mã tham chiếu GD: ${transaction.gatewayRef || "N/A"}
=====================================================
        `.trim();

        const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `HoaDon_${transaction.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return createPortal(
        <div
            className="payment-invoice-modal fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 md:p-6 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <style>{`@media print {
                body > :not(.payment-invoice-modal) { display: none !important; }
                .payment-invoice-modal { position: static !important; display: block !important; overflow: visible !important; }
                .payment-invoice-modal > div { max-width: none !important; overflow: visible !important; }
            }`}</style>
            <div
                ref={printRef}
                className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col print:shadow-none print:border-none print:max-h-none print:w-full"
            >
                {/* Modal Top Control Bar (Hidden when printing) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0 print:hidden">
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="font-bold text-sm sm:text-base">Chi tiết giao dịch</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-100 text-emerald-800">
                            {transaction.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer shadow-xs"
                            title="In giao dịch"
                        >
                            <Printer size={14} />
                            <span className="hidden sm:inline">In giao dịch</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDownload}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition cursor-pointer"
                            title="Tải về máy"
                        >
                            <Download size={14} />
                            <span className="hidden sm:inline">Tải về</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer ml-1"
                            title="Đóng"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Printable Invoice Container */}
                <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6 text-slate-700 print:p-6 print:overflow-visible">
                    {/* Header Company & Invoice Title */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                                    <PawPrint size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                                        PetCare <span className="text-emerald-600">Booking</span>
                                    </h2>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                                        Nền tảng đặt lịch thú cưng số 1
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 pt-2">Thông tin thanh toán dịch vụ thú cưng</p>
                        </div>

                        {/* Invoice Meta */}
                        <div className="sm:text-right space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl w-full sm:w-auto border sm:border-0 border-slate-100">
                            <h3 className="text-base sm:text-lg font-black text-emerald-800 uppercase tracking-wide">
                                CHỨNG TỪ GIAO DỊCH
                            </h3>
                            <p className="text-xs text-slate-600">
                                Mã chứng từ: <strong className="text-slate-900 font-mono text-sm">{transaction.id}</strong>
                            </p>
                            <p className="text-xs text-slate-600">
                                Mã giao dịch: <strong className="font-mono">{transaction.id}</strong>
                            </p>
                            <p className="text-xs text-slate-600">
                                Ngày lập: <span>{transaction.createdAt}</span>
                            </p>
                        </div>
                    </div>

                    {/* Watermark / Status Stamp Banner */}
                    <div className="relative flex items-center justify-between bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center shrink-0">
                                <StatusIcon size={20} className={statusConfig.badgeClass.split(" ")[1]} />
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400 block font-medium">Trạng thái thanh toán</span>
                                <span className="font-bold text-sm text-slate-800">
                                    {transaction.statusLabel}
                                </span>
                            </div>
                        </div>

                        {/* Stamp graphic */}
                        <div
                            className={`border-2 border-dashed rounded-xl px-4 py-1.5 font-black text-xs sm:text-sm tracking-wider uppercase transform -rotate-2 select-none ${statusConfig.stampClass}`}
                        >
                            {transaction.status === "completed"
                                ? "✔ ĐÃ THANH TOÁN"
                                : transaction.status === "pending"
                                ? "⏳ CHỜ THANH TOÁN"
                                : transaction.status === "refunded"
                                ? "↩ ĐÃ HOÀN TIỀN"
                                : "✖ KHÔNG THÀNH CÔNG"}
                        </div>
                    </div>

                    {/* Customer & Facility 2-col info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Customer block */}
                        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                                <span>Thông tin người mua</span>
                            </h4>
                            <div className="space-y-1 text-slate-600">
                                <p>
                                    <strong className="text-slate-800">Họ và tên:</strong> {transaction.customerName}
                                </p>
                                <p>
                                    <strong className="text-slate-800">Số điện thoại:</strong> {transaction.customerPhone}
                                </p>
                                <p>
                                    <strong className="text-slate-800">Email:</strong> {transaction.customerEmail}
                                </p>
                                <p>
                                    <strong className="text-slate-800">Địa chỉ:</strong> {transaction.customerAddress}
                                </p>
                                <p className="pt-1 text-emerald-700 font-semibold flex items-center gap-1">
                                    <PawPrint size={13} />
                                    <span>
                                        Thú cưng: {transaction.petName} ({transaction.petBreed}) {transaction.petGender}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Facility block */}
                        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                                <Building2 size={13} />
                                <span>Đơn vị cung cấp dịch vụ</span>
                            </h4>
                            <div className="space-y-1 text-slate-600">
                                <p>
                                    <strong className="text-slate-800">Cơ sở:</strong> {transaction.facilityName}
                                </p>
                                <p>
                                    <strong className="text-slate-800">Địa chỉ:</strong> {transaction.facilityAddress}
                                </p>
                                <p>
                                    <strong className="text-slate-800">Hotline cơ sở:</strong> {transaction.facilityPhone}
                                </p>
                                <p>
                                    <strong className="text-slate-800">Mã đặt lịch:</strong>{" "}
                                    <span className="font-mono font-bold text-emerald-700">{transaction.bookingId}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Service Breakdown Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4 w-12 text-center">STT</th>
                                    <th className="py-3 px-4">Tên dịch vụ & Liệu trình</th>
                                    <th className="py-3 px-4 w-20 text-center">ĐVT</th>
                                    <th className="py-3 px-4 w-16 text-center">SL</th>
                                    <th className="py-3 px-4 text-right">Đơn giá</th>
                                    <th className="py-3 px-4 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/50">
                                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">01</td>
                                    <td className="py-3.5 px-4">
                                        <p className="font-bold text-slate-800 text-xs sm:text-sm">
                                            {transaction.serviceName}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                            {transaction.serviceDesc}
                                        </p>
                                    </td>
                                    <td className="py-3.5 px-4 text-center text-slate-600">Buổi</td>
                                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">1</td>
                                    <td className="py-3.5 px-4 text-right text-slate-700">
                                        {formatCurrency(transaction.basePrice)}
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                                        {formatCurrency(transaction.basePrice)}
                                    </td>
                                </tr>

                                {transaction.platformFee > 0 && (
                                    <tr className="hover:bg-slate-50/50 text-slate-600">
                                        <td className="py-3 px-4 text-center text-slate-400">02</td>
                                        <td className="py-3 px-4 font-medium">
                                            Phí vận hành nền tảng & bảo hiểm dịch vụ
                                        </td>
                                        <td className="py-3 px-4 text-center">Lượt</td>
                                        <td className="py-3 px-4 text-center">1</td>
                                        <td className="py-3 px-4 text-right">
                                            {formatCurrency(transaction.platformFee)}
                                        </td>
                                        <td className="py-3 px-4 text-right font-medium">
                                            {formatCurrency(transaction.platformFee)}
                                        </td>
                                    </tr>
                                )}

                                {transaction.discount > 0 && (
                                    <tr className="hover:bg-slate-50/50 text-emerald-700 bg-emerald-50/30">
                                        <td className="py-3 px-4 text-center text-emerald-500">03</td>
                                        <td className="py-3 px-4 font-medium flex items-center gap-1.5">
                                            <span>Mã giảm giá ưu đãi</span>
                                            {transaction.discountCode && (
                                                <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                                    {transaction.discountCode}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">-</td>
                                        <td className="py-3 px-4 text-center">-</td>
                                        <td className="py-3 px-4 text-right">-{formatCurrency(transaction.discount)}</td>
                                        <td className="py-3 px-4 text-right font-bold text-emerald-600">
                                            -{formatCurrency(transaction.discount)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Calculations */}
                    <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
                        {/* Left: Payment Method & Words */}
                        <div className="space-y-2 flex-1">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                                <p className="text-slate-500 flex items-center gap-1.5">
                                    <MethodIcon size={14} className={methodConfig.color} />
                                    <span>Phương thức thanh toán:</span>
                                    <strong className="text-slate-800">{transaction.methodLabel}</strong>
                                </p>
                                {transaction.gatewayRef && (
                                    <p className="text-[11px] text-slate-500">
                                        Mã tham chiếu cổng GD: <span className="font-mono font-semibold">{transaction.gatewayRef}</span>
                                    </p>
                                )}
                                {transaction.paidAt && (
                                    <p className="text-[11px] text-slate-500">
                                        Thời điểm thanh toán: <span className="font-medium text-slate-700">{transaction.paidAt}</span>
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-slate-600 italic">
                                <span className="font-semibold text-slate-700">Số tiền bằng chữ: </span>
                                <span className="text-emerald-800 font-medium">{numberToWordsVietnamese(transaction.totalAmount)}</span>
                            </p>
                        </div>

                        {/* Right: Price Total Stack */}
                        <div className="w-full sm:w-72 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Cộng tiền dịch vụ:</span>
                                <span>{formatCurrency(transaction.basePrice)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Phí tiện ích & nền tảng:</span>
                                <span>{formatCurrency(transaction.platformFee)}</span>
                            </div>
                            {transaction.discount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Chiết khấu khuyến mại:</span>
                                    <span>-{formatCurrency(transaction.discount)}</span>
                                </div>
                            )}
                            <div className="border-t border-slate-200 pt-2 flex items-baseline justify-between text-sm sm:text-base font-extrabold text-slate-900">
                                <span>Tổng thanh toán:</span>
                                <span className="text-emerald-600 text-lg sm:text-xl font-black">
                                    {formatCurrency(transaction.totalAmount)}
                                </span>
                            </div>

                            {transaction.refundedAmount > 0 && (
                                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-[11px] space-y-0.5">
                                    <div className="flex justify-between font-bold">
                                        <span>Số tiền đã hoàn:</span>
                                        <span>{formatCurrency(transaction.refundedAmount)}</span>
                                    </div>
                                    <p className="text-[10px] text-purple-600">{transaction.refundReason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                        Thông tin được tổng hợp từ giao dịch thanh toán trên hệ thống PetCare Booking.
                        Chứng từ này không thay thế hóa đơn giá trị gia tăng.
                    </p>
                </div>

                {/* Modal Footer Controls (Hidden when printing) */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 print:hidden">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Thông tin giao dịch PetCare Booking</span>
                    </span>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition cursor-pointer shadow-xs"
                        >
                            <Printer size={14} />
                            <span>In giao dịch</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>, document.body
    );
}
