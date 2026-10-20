import { useState, useMemo, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import {
    PawPrint,
    CalendarCheck,
    CalendarDays,
    Clock,
    CheckCircle2,
    Scissors,
    Home,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import BookingStats from "../../components/MyBookings/BookingStats";
import BookingFilterBar from "../../components/MyBookings/BookingFilterBar";
import BookingCard from "../../components/MyBookings/BookingCard";
// import BookingSidebar from "../../components/MyBookings/BookingSidebar";
import { bookingApi } from "../../services/bookingApi.js";
import { bookingCardData, apiBookingStatus } from "../../services/bookingData.js";
import { useAuth } from "../../../../context/AuthContext";


// =========================
// MOCK DATA
// =========================

const STATS = [
    {
        id: 1,
        title: "Tổng lịch đặt",
        value: 12,
        icon: CalendarDays,
        color: "text-teal-600",
        bg: "bg-teal-50",
        hover: "hover:border-teal-300",
    },
    {
        id: 2,
        title: "Chờ xác nhận",
        value: 2,
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-50",
        hover: "hover:border-amber-300",
    },
    {
        id: 3,
        title: "Sắp tới",
        value: 4,
        icon: CalendarCheck,
        color: "text-blue-600",
        bg: "bg-blue-50",
        hover: "hover:border-blue-300",
    },
    {
        id: 4,
        title: "Hoàn thành",
        value: 6,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        hover: "hover:border-emerald-300",
    },
];

const TABS = [
    {
        id: "all",
        label: "Tất cả",
        count: null,
    },
    {
        id: "pending",
        label: "Chờ xác nhận",
        count: 2,
        badgeColor: "bg-amber-100 text-amber-700",
    },
    {
        id: "confirmed",
        label: "Đã xác nhận",
        count: 3,
        badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "in-progress",
        label: "Đang thực hiện",
        count: 1,
        badgeColor: "bg-blue-100 text-blue-700",
    },
    {
        id: "completed",
        label: "Hoàn thành",
        count: 6,
        badgeColor: "bg-teal-100 text-teal-700",
    },
    {
        id: "cancelled",
        label: "Đã hủy",
        count: 0,
        badgeColor: "bg-slate-100 text-slate-600",
    },
];




// =========================
// HERO
// =========================

const HeroSection = ({ stats }) => {
    return (
        <section className="relative bg-gradient-to-b from-[#E7F8F2] via-[#EEF9F5] to-[#F6FAF8] pt-8 pb-10 overflow-hidden border-b border-teal-50/60">

            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="absolute top-12 left-10 text-teal-200/40 pointer-events-none select-none -rotate-12">
                <PawPrint size={100} />
            </div>

            <div className="absolute right-10 bottom-6 text-teal-200/30 pointer-events-none select-none rotate-45">
                <PawPrint size={80} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                    <div className="flex-1 space-y-3">

                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Link to="/" className="hover:text-teal-600 transition-colors">
                                Trang chủ
                            </Link>

                            <span>/</span>

                            <Link to="/profile" className="hover:text-teal-600 transition-colors">
                                Tài khoản
                            </Link>

                            <span>/</span>

                            <span className="text-teal-700 font-semibold">
                                Lịch đặt của tôi
                            </span>
                        </nav>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Lịch đặt{" "}
                            <span className="text-teal-600">
                                của tôi
                            </span>
                        </h1>

                        <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
                            Theo dõi toàn bộ lịch đặt dịch vụ, trạng thái xử lý và thông tin thanh toán của bạn một cách dễ dàng và minh bạch.
                        </p>

                    </div>

                    <div className="relative flex items-center justify-center">

                        <div className="relative bg-white/60 p-2 rounded-3xl backdrop-blur-sm border border-white shadow-xl shadow-teal-900/5">

                            <img
                                alt="Pets"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSAtqE-cQJYkq37esYUrle4pB-QwyDR07puul4nnHrfXqF03TuLD2qzxQUHtoNCHqwNLGepOlwBsQ8d6FNQ39VEo7GFPr9d_PU1Nz4uQDcrxUjsIryl2MMtZ78jS30bipK2CVIy0wa9DY9kvY-9w9qSx7j6r5c2H3zkCifXksiHXNNwqGaXbsVuBeb-01dHToFGj3R_elvmCwhu7fGHdhXIrOl-gmtmdLDpMf-vkg"
                                className="w-64 sm:w-80 h-44 sm:h-48 rounded-2xl object-cover shadow-inner"
                            />

                            <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-teal-50 flex items-center justify-center text-teal-600 animate-bounce">
                                <CalendarCheck size={24} />
                            </div>

                        </div>
                    </div>

                </div>

                <BookingStats stats={stats} />

            </div>
        </section>
    );
};


// =========================
// PAGE
// =========================

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const { user, isAuthLoading } = useAuth();
    const [result, setResult] = useState({ data: [], total: 0, totalPages: 0, summary: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        if (isAuthLoading || !user || user.role !== 'CUSTOMER') return;
        let cancelled = false;
        const timer = setTimeout(() => {
            bookingApi.list({ status: apiBookingStatus(statusFilter), search: searchQuery.trim(), time: timeFilter, page: currentPage, limit: itemsPerPage })
                .then((response) => { if (!cancelled) setResult(response); })
                .catch((err) => { if (!cancelled) setError(err.message || 'Không thể tải lịch đặt.'); })
                .finally(() => { if (!cancelled) setLoading(false); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [user, isAuthLoading, statusFilter, searchQuery, timeFilter, currentPage, attempt]);
    const paginatedBookings = useMemo(() => result.data.map((item) => ({ ...bookingCardData(item), serviceIcon: item.bookingType === 'BOARDING' ? Home : Scissors, timeIcon: Clock })), [result.data]);
    const totalPages = Math.max(1, result.totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const beginLoad = () => { setLoading(true); setError(''); setAttempt((value) => value + 1); };

    const handleTabChange = (tabId) => {
        beginLoad();
        setActiveTab(tabId);
        setStatusFilter(tabId);
        setCurrentPage(1);
    };

    const handleSearchChange = (val) => {
        beginLoad();
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleTimeChange = (val) => {
        beginLoad();
        setTimeFilter(val);
        setCurrentPage(1);
    };

    const handleStatusChange = (val) => {
        beginLoad();
        setStatusFilter(val);
        setActiveTab(val);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            beginLoad();
            setCurrentPage(newPage);
            const element = document.getElementById("booking-list-container");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", totalPages];
        }
        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    const dynamicTabs = TABS.map((tab) => ({ ...tab, count: result.summary ? tab.id === 'all' ? result.summary.total : result.summary.statusCounts[apiBookingStatus(tab.id)] || 0 : null }));
    const values = result.summary ? [result.summary.total, result.summary.statusCounts.PENDING, result.summary.upcoming, result.summary.statusCounts.COMPLETED] : ['—', '—', '—', '—'];
    const dynamicStats = STATS.map((stat, index) => ({ ...stat, value: values[index] }));
    if (!isAuthLoading && !user) return <Navigate to="/login" replace />;
    if (user && user.role !== 'CUSTOMER') return <Navigate to="/" replace />;

    return (
        <div>
            <HeroSection stats={dynamicStats} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full space-y-6">
                    <BookingFilterBar
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        tabs={dynamicTabs}
                        searchQuery={searchQuery}
                        setSearchQuery={handleSearchChange}
                        timeFilter={timeFilter}
                        setTimeFilter={handleTimeChange}
                        statusFilter={statusFilter}
                        setStatusFilter={handleStatusChange}
                    />

                    <div id="booking-list-container" className="space-y-4">
                        {!loading && !error && paginatedBookings.length > 0 ? (
                            paginatedBookings.map((booking) => (
                                <BookingCard key={booking.recordId} booking={booking} />
                            ))
                        ) : (
                            <div role={error ? 'alert' : loading ? 'status' : undefined} className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-sm text-center space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                                    <CalendarDays size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-800">
                                    {loading || isAuthLoading ? 'Đang tải lịch đặt...' : error || 'Không tìm thấy lịch đặt nào'}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    {loading ? 'Vui lòng chờ trong giây lát.' : error ? 'Vui lòng thử tải lại danh sách.' : 'Không có lịch đặt nào phù hợp với bộ lọc hiện tại. Thử chọn danh mục khác hoặc đặt lại bộ lọc.'}
                                </p>
                                <button
                                    disabled={loading}
                                    onClick={() => {
                                        if (error) { beginLoad(); return; }
                                        handleTabChange("all");
                                        setSearchQuery("");
                                        setTimeFilter("all");
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    <RotateCcw size={14} />
                                    <span>{loading ? 'Đang tải...' : error ? 'Thử lại' : 'Xem tất cả lịch đặt'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination & Summary */}
                    {!loading && !error && result.total > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                <span>
                                    Hiển thị{" "}
                                    <strong className="text-slate-800 font-bold">
                                        {startIndex + 1} - {Math.min(startIndex + itemsPerPage, result.total)}
                                    </strong>{" "}
                                    trong tổng số{" "}
                                    <strong className="text-teal-700 font-bold">{result.total}</strong> lịch đặt
                                </span>
                                <span>
                                    Trang <strong className="text-slate-800 font-bold">{currentPage}</strong> / {totalPages}
                                </span>
                            </div>

                            <nav className="flex items-center justify-center gap-2 pt-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === 1
                                            ? "text-slate-300 cursor-not-allowed opacity-50"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 cursor-pointer shadow-xs"
                                        }`}
                                    aria-label="Trang trước"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-1 text-slate-400 font-bold text-xs"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === page
                                                    ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/20"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-teal-300"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === totalPages
                                            ? "text-slate-300 cursor-not-allowed opacity-50"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 cursor-pointer shadow-xs"
                                        }`}
                                    aria-label="Trang kế tiếp"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyBookings;
