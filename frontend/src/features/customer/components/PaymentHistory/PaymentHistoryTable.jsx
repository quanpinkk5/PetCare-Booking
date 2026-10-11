import { Link, useNavigate } from "react-router-dom";
import {
    FileText,
    Printer,
    CreditCard,
    ExternalLink,
    Calendar,
    Clock,
    Building2,
    PawPrint,
    CheckCircle2,
    RotateCcw,
    XCircle,
    AlertCircle,
} from "lucide-react";
import {
    formatCurrency,
    PAYMENT_METHODS,
    PAYMENT_STATUSES,
} from "../../data/paymentHistoryData";

export default function PaymentHistoryTable({
    transactions,
    onViewInvoice,
    onPrintInvoice,
}) {
    const navigate = useNavigate();

    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200/90 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <FileText size={32} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">
                        Không tìm thấy giao dịch nào
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                        Không có lịch sử thanh toán nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop & Tablet Table (Hidden on small mobile) */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                                <th className="py-4 px-4 w-44">Mã GD / Hóa đơn</th>
                                <th className="py-4 px-4">Dịch vụ & Cơ sở</th>
                                <th className="py-4 px-4 w-36">Thời gian</th>
                                <th className="py-4 px-4 w-44">Phương thức</th>
                                <th className="py-4 px-4 w-36 text-right">Số tiền</th>
                                <th className="py-4 px-4 w-36 text-center">Trạng thái</th>
                                <th className="py-4 px-4 w-48 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => {
                                const method = PAYMENT_METHODS[tx.method] || PAYMENT_METHODS.vnpay;
                                const status = PAYMENT_STATUSES[tx.status] || PAYMENT_STATUSES.completed;
                                const MethodIcon = method.icon;
                                const StatusIcon = status.icon;

                                return (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-slate-50/70 transition-colors group"
                                    >
                                        {/* Mã GD & Hóa đơn */}
                                        <td className="py-4 px-4 align-top">
                                            <div className="space-y-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onViewInvoice(tx)}
                                                    className="font-mono font-bold text-slate-900 hover:text-emerald-700 hover:underline transition-colors block text-left cursor-pointer"
                                                >
                                                    {tx.id}
                                                </button>

                                                <span className="text-[11px] font-mono text-slate-400 block">
                                                    {tx.invoiceNo}
                                                </span>

                                                <Link
                                                    to={`/my-bookings/${tx.bookingId}`}
                                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                                                >
                                                    <span>Mã hẹn: {tx.bookingId}</span>
                                                    <ExternalLink size={10} />
                                                </Link>
                                            </div>
                                        </td>

                                        {/* Dịch vụ & Cơ sở */}
                                        <td className="py-4 px-4 align-top">
                                            <div className="space-y-1 max-w-md">
                                                <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                                                    {tx.serviceName}
                                                </h4>

                                                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                                    <Building2 size={12} className="text-emerald-600 shrink-0" />
                                                    <span className="truncate">{tx.facilityName}</span>
                                                </p>

                                                <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                                    <PawPrint size={11} className="text-emerald-600 shrink-0" />
                                                    <span>
                                                        {tx.petName} ({tx.petBreed})
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Thời gian */}
                                        <td className="py-4 px-4 align-top text-slate-600">
                                            <div className="space-y-1">
                                                <span className="font-medium text-slate-800 block">
                                                    {tx.createdAt.split(" ")[0]}
                                                </span>
                                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                    <Clock size={11} />
                                                    {tx.createdAt.split(" ")[1]}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Phương thức thanh toán */}
                                        <td className="py-4 px-4 align-top">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border shadow-2xs bg-white text-slate-700 border-slate-200">
                                                <MethodIcon size={14} className={method.color} />
                                                <span>{tx.methodLabel}</span>
                                            </div>
                                        </td>

                                        {/* Số tiền */}
                                        <td className="py-4 px-4 align-top text-right">
                                            <div className="space-y-0.5">
                                                <div
                                                    className={`font-black text-sm ${
                                                        tx.status === "completed"
                                                            ? "text-slate-900"
                                                            : tx.status === "pending"
                                                            ? "text-amber-600"
                                                            : tx.status === "refunded"
                                                            ? "text-purple-600 line-through"
                                                            : "text-slate-400 line-through"
                                                    }`}
                                                >
                                                    {formatCurrency(tx.totalAmount)}
                                                </div>

                                                {tx.discount > 0 && (
                                                    <div className="text-[11px] text-emerald-600 font-medium">
                                                        - {formatCurrency(tx.discount)} ({tx.discountCode})
                                                    </div>
                                                )}

                                                {tx.refundedAmount > 0 && (
                                                    <div className="text-[11px] text-purple-700 font-bold">
                                                        Hoàn: {formatCurrency(tx.refundedAmount)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Trạng thái */}
                                        <td className="py-4 px-4 align-top text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${status.badgeClass}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                                                <span>{tx.statusLabel}</span>
                                            </span>
                                        </td>

                                        {/* Thao tác */}
                                        <td className="py-4 px-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Pending action */}
                                                {tx.status === "pending" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(`/payment/${tx.bookingId}`, {
                                                                state: {
                                                                    booking: {
                                                                        bookingCode: tx.bookingId,
                                                                        petName: tx.petName,
                                                                        petBreed: tx.petBreed,
                                                                        serviceName: tx.serviceName,
                                                                        facilityName: tx.facilityName,
                                                                        basePrice: tx.basePrice,
                                                                        platformFee: tx.platformFee,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                        className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                                                        title="Thanh toán ngay"
                                                    >
                                                        <CreditCard size={13} />
                                                        <span>Thanh toán</span>
                                                    </button>
                                                )}

                                                {/* View invoice */}
                                                <button
                                                    type="button"
                                                    onClick={() => onViewInvoice(tx)}
                                                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 font-semibold text-xs shadow-2xs transition flex items-center gap-1 cursor-pointer"
                                                    title="Xem hóa đơn chi tiết"
                                                >
                                                    <FileText size={13} className="text-emerald-600" />
                                                    <span>Hóa đơn</span>
                                                </button>

                                                {/* Print button */}
                                                <button
                                                    type="button"
                                                    onClick={() => onPrintInvoice(tx)}
                                                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                                                    title="In nhanh"
                                                >
                                                    <Printer size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile / Compact Cards View (Shown on screens < lg) */}
            <div className="lg:hidden space-y-3.5">
                {transactions.map((tx) => {
                    const method = PAYMENT_METHODS[tx.method] || PAYMENT_METHODS.vnpay;
                    const status = PAYMENT_STATUSES[tx.status] || PAYMENT_STATUSES.completed;
                    const MethodIcon = method.icon;

                    return (
                        <div
                            key={tx.id}
                            className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3"
                        >
                            {/* Card Top: Code + Status Badge */}
                            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                                <div>
                                    <span className="text-[11px] font-mono text-emerald-700 font-bold block">
                                        {tx.id}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 block">
                                        {tx.invoiceNo}
                                    </span>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${status.badgeClass}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                                    <span>{tx.statusLabel}</span>
                                </span>
                            </div>

                            {/* Service Details */}
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                                    {tx.serviceName}
                                </h4>

                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <Building2 size={13} className="text-emerald-600 shrink-0" />
                                    <span>{tx.facilityName}</span>
                                </p>

                                <div className="flex items-center gap-2 pt-1">
                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                        <PawPrint size={11} className="text-emerald-600" />
                                        {tx.petName} ({tx.petBreed})
                                    </span>

                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                        <Clock size={11} />
                                        {tx.createdAt}
                                    </span>
                                </div>
                            </div>

                            {/* Method & Amount */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                    <MethodIcon size={14} className={method.color} />
                                    <span>{tx.methodLabel}</span>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm font-black text-slate-900 block">
                                        {formatCurrency(tx.totalAmount)}
                                    </span>
                                    {tx.discount > 0 && (
                                        <span className="text-[10px] text-emerald-600 font-medium">
                                            Giảm {formatCurrency(tx.discount)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions cluster */}
                            <div className="flex items-center gap-2 pt-1">
                                {tx.status === "pending" && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/payment/${tx.bookingId}`)}
                                        className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <CreditCard size={14} />
                                        <span>Thanh toán ngay</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onViewInvoice(tx)}
                                    className="flex-1 py-2 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                    <FileText size={14} className="text-emerald-600" />
                                    <span>Xem hóa đơn</span>
                                </button>

                                <Link
                                    to={`/my-bookings/${tx.bookingId}`}
                                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer shadow-2xs"
                                    title="Xem chi tiết lịch đặt"
                                >
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
