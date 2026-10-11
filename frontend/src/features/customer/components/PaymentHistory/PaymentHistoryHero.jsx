import { Link } from "react-router-dom";
import {
    PawPrint,
    Receipt,
    CheckCircle2,
    Clock,
    RotateCcw,
    CreditCard,
    FileSpreadsheet,
    Wallet,
    TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../data/paymentHistoryData";

export default function PaymentHistoryHero({ summary, onExportCSV }) {
    const statsCards = [
        {
            id: "spent",
            label: "Tổng tiền đã thanh toán",
            value: formatCurrency(summary.totalSpent),
            subtext: `${summary.completedCount} giao dịch thành công`,
            icon: Wallet,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            borderColor: "hover:border-emerald-300",
            pill: "Đã tất toán",
            pillBg: "bg-emerald-100 text-emerald-800",
        },
        {
            id: "completed",
            label: "Giao dịch thành công",
            value: summary.completedCount,
            subtext: "Hoàn tất 100% dịch vụ",
            icon: CheckCircle2,
            color: "text-teal-600",
            bg: "bg-teal-50",
            borderColor: "hover:border-teal-300",
            pill: "An toàn",
            pillBg: "bg-teal-100 text-teal-800",
        },
        {
            id: "pending",
            label: "Chờ thanh toán",
            value: formatCurrency(summary.totalPending),
            subtext: `${summary.pendingCount} giao dịch đang chờ`,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50",
            borderColor: "hover:border-amber-300",
            pill: summary.pendingCount > 0 ? "Cần xử lý" : "0 hóa đơn",
            pillBg: summary.pendingCount > 0 ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-slate-100 text-slate-600",
        },
        {
            id: "refunded",
            label: "Đã hoàn tiền",
            value: formatCurrency(summary.totalRefunded),
            subtext: `${summary.refundedCount} giao dịch hoàn trả`,
            icon: RotateCcw,
            color: "text-purple-600",
            bg: "bg-purple-50",
            borderColor: "hover:border-purple-300",
            pill: "Chính sách 24h",
            pillBg: "bg-purple-100 text-purple-800",
        },
    ];

    return (
        <section className="relative bg-gradient-to-b from-[#E7F8F2] via-[#EEF9F5] to-[#F6FAF8] pt-8 pb-10 overflow-hidden border-b border-teal-50/60">
            {/* Background decorative glows */}
            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-12 left-10 text-teal-200/40 pointer-events-none select-none -rotate-12">
                <PawPrint size={100} />
            </div>
            <div className="absolute right-10 bottom-6 text-teal-200/30 pointer-events-none select-none rotate-45">
                <PawPrint size={80} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header title & breadcrumb */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Link to="/" className="hover:text-emerald-600 transition-colors">
                                Trang chủ
                            </Link>
                            <span>/</span>
                            <Link to="/profile" className="hover:text-emerald-600 transition-colors">
                                Tài khoản
                            </Link>
                            <span>/</span>
                            <span className="text-emerald-700 font-semibold">Lịch sử thanh toán</span>
                        </nav>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Lịch sử thanh toán & <span className="text-emerald-600">Hóa đơn</span>
                        </h1>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Quản lý, tra cứu hóa đơn điện tử và đối soát toàn bộ các giao dịch thanh toán dịch vụ thú cưng một cách minh bạch, an toàn và tức thì.
                        </p>
                    </div>

                    {/* Quick export actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onExportCSV}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs hover:border-emerald-300 hover:text-emerald-700 transition cursor-pointer"
                        >
                            <FileSpreadsheet size={16} className="text-emerald-600" />
                            <span>Xuất dữ liệu (CSV)</span>
                        </button>

                        <Link
                            to="/my-bookings"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
                        >
                            <Receipt size={16} />
                            <span>Lịch đặt của tôi</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {statsCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.id}
                                className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm transition-all duration-200 ${card.borderColor} hover:-translate-y-0.5`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <span
                                        className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${card.pillBg}`}
                                    >
                                        {card.pill}
                                    </span>
                                </div>

                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    {card.label}
                                </h3>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        {card.value}
                                    </span>
                                </div>

                                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                                    {card.subtext}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
