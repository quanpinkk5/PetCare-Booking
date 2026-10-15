import { Eye } from "lucide-react";

export default function PaymentTable({
    payments,
    selectedPaymentId,
    onSelectPayment,
    currentPage,
    setCurrentPage,
    pageSize = 6,
}) {
    const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const visiblePayments = payments.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse whitespace-nowrap text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            <th className="px-3 py-3">Mã thanh toán</th>
                            <th className="px-3 py-3">Khách hàng</th>
                            <th className="px-3 py-3">Dịch vụ</th>
                            <th className="px-3 py-3">Chi nhánh</th>
                            <th className="px-3 py-3">Phương thức</th>
                            <th className="px-3 py-3">Số tiền</th>
                            <th className="px-3 py-3">Ngày thanh toán</th>
                            <th className="px-3 py-3">Trạng thái</th>
                            <th className="px-3 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-xs">
                        {visiblePayments.map((payment) => {
                            const isSelected = payment.id === selectedPaymentId;

                            return (
                                <tr
                                    key={payment.id}
                                    onClick={() => onSelectPayment(payment)}
                                    className={`cursor-pointer transition ${isSelected
                                            ? "border-l-4 border-l-emerald-600 bg-emerald-50/40"
                                            : "hover:bg-slate-50"
                                        }`}
                                >
                                    <td className="px-3 py-3 font-semibold text-slate-900">
                                        {payment.id}
                                    </td>

                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={payment.avatar}
                                                alt={payment.customer}
                                                className="h-7 w-7 rounded-full object-cover"
                                            />

                                            <div>
                                                <div className="font-semibold text-slate-900">
                                                    {payment.customer}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {payment.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center gap-1 text-slate-700">
                                            <span className={payment.color}>{payment.icon}</span>
                                            {payment.service}
                                        </span>
                                    </td>

                                    <td className="px-3 py-3 text-slate-600">
                                        {payment.branch}
                                    </td>

                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span
                                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${payment.badgeClass}`}
                                            >
                                                {payment.methodBadge}
                                            </span>
                                            <span className="text-slate-600">{payment.method}</span>
                                        </span>
                                    </td>

                                    <td className="px-3 py-3 font-semibold text-slate-900">
                                        {payment.amount}
                                    </td>

                                    <td className="px-3 py-3 text-[11px] text-slate-500">
                                        {payment.date}
                                    </td>

                                    <td className="px-3 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${payment.statusClass}`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>

                                    <td className="px-3 py-3 text-center">
                                        <button
                                            type="button"
                                            aria-label={`Xem chi tiết giao dịch ${payment.id}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onSelectPayment(payment);
                                            }}
                                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                                isSelected
                                                    ? "bg-emerald-600 text-white shadow-xs"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                                            }`}
                                        >
                                            <Eye size={14} className={isSelected ? "text-white" : "text-emerald-600"} />
                                            <span>Xem chi tiết</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {visiblePayments.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-10 text-center text-sm text-slate-400"
                                >
                                    Không tìm thấy giao dịch phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 pt-3 text-[11px] text-slate-400">
                <span>
                    {payments.length === 0
                        ? "Không có giao dịch"
                        : `Hiển thị ${startIndex + 1} đến ${Math.min(
                            startIndex + pageSize,
                            payments.length
                        )} của ${payments.length} giao dịch`}
                </span>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={safePage === 1}
                        onClick={() => handlePageChange(safePage - 1)}
                        className="rounded border border-slate-200 px-2 py-1 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                        .slice(
                            Math.max(0, safePage - 2),
                            Math.max(0, safePage - 2) + 3
                        )
                        .map((page) => (
                            <button
                                type="button"
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`rounded px-2 py-1 ${page === safePage
                                        ? "bg-emerald-600 text-white"
                                        : "border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                    <button
                        type="button"
                        disabled={safePage === totalPages}
                        onClick={() => handlePageChange(safePage + 1)}
                        className="rounded border border-slate-200 px-2 py-1 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    );
}