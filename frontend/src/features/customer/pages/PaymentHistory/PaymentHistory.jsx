import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import PaymentHistoryHero from "../../components/PaymentHistory/PaymentHistoryHero";
import PaymentHistoryFilter from "../../components/PaymentHistory/PaymentHistoryFilter";
import PaymentHistoryTable from "../../components/PaymentHistory/PaymentHistoryTable";
import PaymentPagination from "../../components/PaymentHistory/PaymentPagination";
import PaymentInvoiceModal from "../../components/PaymentHistory/PaymentInvoiceModal";

import {
    PAYMENT_TRANSACTIONS,
    getPaymentSummary,
    formatCurrency,
} from "../../data/paymentHistoryData";

const STATUS_TABS = [
    { id: "all", label: "Tất cả", count: null },
    { id: "completed", label: "Thành công", count: null, badgeColor: "bg-emerald-100 text-emerald-800" },
    { id: "pending", label: "Chờ thanh toán", count: null, badgeColor: "bg-amber-100 text-amber-800" },
    { id: "refunded", label: "Đã hoàn tiền", count: null, badgeColor: "bg-purple-100 text-purple-800" },
    { id: "failed", label: "Đã hủy / Thất bại", count: null, badgeColor: "bg-rose-100 text-rose-800" },
];

export default function PaymentHistory() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initial state from URL parameters if available
    const initialBookingId = searchParams.get("bookingId") || searchParams.get("booking") || "";
    const initialStatus = searchParams.get("status") || "all";
    const initialTxn = searchParams.get("txn") || "";

    const [activeStatusTab, setActiveStatusTab] = useState(initialStatus);
    const [searchQuery, setSearchQuery] = useState(initialBookingId || initialTxn);
    const [selectedMethod, setSelectedMethod] = useState("all");
    const [selectedTimeRange, setSelectedTimeRange] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const itemsPerPage = 6;

    // Check if initial URL param matched an invoice directly
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });

        if (initialTxn) {
            const found = PAYMENT_TRANSACTIONS.find((t) => t.id.toLowerCase() === initialTxn.toLowerCase());
            if (found) setSelectedInvoice(found);
        } else if (initialBookingId) {
            const found = PAYMENT_TRANSACTIONS.find((t) => t.bookingId.toLowerCase() === initialBookingId.toLowerCase());
            if (found) setSelectedInvoice(found);
        }
    }, [initialTxn, initialBookingId]);

    // Check if any filter is active
    const isFiltered = useMemo(() => {
        return (
            activeStatusTab !== "all" ||
            searchQuery.trim() !== "" ||
            selectedMethod !== "all" ||
            selectedTimeRange !== "all" ||
            sortBy !== "newest"
        );
    }, [activeStatusTab, searchQuery, selectedMethod, selectedTimeRange, sortBy]);

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        let result = [...PAYMENT_TRANSACTIONS];

        // 1. Status Tab filter
        if (activeStatusTab !== "all") {
            result = result.filter((tx) => tx.status === activeStatusTab);
        }

        // 2. Search query filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter((tx) => {
                return (
                    tx.id.toLowerCase().includes(q) ||
                    tx.invoiceNo.toLowerCase().includes(q) ||
                    tx.bookingId.toLowerCase().includes(q) ||
                    tx.serviceName.toLowerCase().includes(q) ||
                    tx.facilityName.toLowerCase().includes(q) ||
                    tx.petName.toLowerCase().includes(q) ||
                    tx.petBreed.toLowerCase().includes(q) ||
                    tx.methodLabel.toLowerCase().includes(q)
                );
            });
        }

        // 3. Payment Method filter
        if (selectedMethod !== "all") {
            result = result.filter((tx) => tx.method === selectedMethod);
        }

        // 4. Time range filter
        if (selectedTimeRange === "this_month") {
            result = result.filter((tx) => tx.rawDate.startsWith("2026-08"));
        } else if (selectedTimeRange === "last_month") {
            result = result.filter((tx) => tx.rawDate.startsWith("2026-07"));
        } else if (selectedTimeRange === "older") {
            result = result.filter((tx) => !tx.rawDate.startsWith("2026-08") && !tx.rawDate.startsWith("2026-07"));
        }

        // 5. Sorting
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.rawDate) - new Date(a.rawDate);
            }
            if (sortBy === "oldest") {
                return new Date(a.rawDate) - new Date(b.rawDate);
            }
            if (sortBy === "amount_desc") {
                return b.totalAmount - a.totalAmount;
            }
            if (sortBy === "amount_asc") {
                return a.totalAmount - b.totalAmount;
            }
            return 0;
        });

        return result;
    }, [activeStatusTab, searchQuery, selectedMethod, selectedTimeRange, sortBy]);

    // Dynamic tabs with updated counts
    const dynamicStatusTabs = useMemo(() => {
        return STATUS_TABS.map((tab) => {
            if (tab.id === "all") {
                return { ...tab, count: PAYMENT_TRANSACTIONS.length };
            }
            const count = PAYMENT_TRANSACTIONS.filter((tx) => tx.status === tab.id).length;
            return { ...tab, count };
        });
    }, []);

    // Summary calculation
    const summary = useMemo(() => {
        return getPaymentSummary(PAYMENT_TRANSACTIONS);
    }, []);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            const el = document.getElementById("payment-list-container");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleStatusTabChange = (tabId) => {
        setActiveStatusTab(tabId);
        setCurrentPage(1);
    };

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleMethodChange = (val) => {
        setSelectedMethod(val);
        setCurrentPage(1);
    };

    const handleTimeRangeChange = (val) => {
        setSelectedTimeRange(val);
        setCurrentPage(1);
    };

    const handleSortChange = (val) => {
        setSortBy(val);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setActiveStatusTab("all");
        setSearchQuery("");
        setSelectedMethod("all");
        setSelectedTimeRange("all");
        setSortBy("newest");
        setCurrentPage(1);
        setSearchParams({});
    };

    // Export CSV function (Supports Vietnamese with UTF-8 BOM)
    const handleExportCSV = () => {
        const headers = [
            "Mã giao dịch",
            "Số hóa đơn",
            "Mã đặt lịch",
            "Thời gian tạo",
            "Dịch vụ",
            "Cơ sở",
            "Thú cưng",
            "Phương thức",
            "Số tiền gốc",
            "Phí nền tảng",
            "Giảm giá",
            "Mã giảm giá",
            "Tổng thanh toán",
            "Trạng thái",
            "Thời gian thanh toán",
        ];

        const rows = filteredTransactions.map((tx) => [
            `"${tx.id}"`,
            `"${tx.invoiceNo}"`,
            `"${tx.bookingId}"`,
            `"${tx.createdAt}"`,
            `"${tx.serviceName.replace(/"/g, '""')}"`,
            `"${tx.facilityName.replace(/"/g, '""')}"`,
            `"${tx.petName} (${tx.petBreed})"`,
            `"${tx.methodLabel}"`,
            tx.basePrice,
            tx.platformFee,
            tx.discount || 0,
            `"${tx.discountCode || ""}"`,
            tx.totalAmount,
            `"${tx.statusLabel}"`,
            `"${tx.paidAt || "Chưa"}"`,
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `LichSuThanhToan_PetCare_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
            {/* 1. Hero Section with Stats & Breadcrumbs */}
            <PaymentHistoryHero
                summary={summary}
                onExportCSV={handleExportCSV}
            />

            {/* 2. Main Content Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div id="payment-list-container" className="space-y-6">
                    {/* Filter & Search Toolbar */}
                    <PaymentHistoryFilter
                        activeStatusTab={activeStatusTab}
                        onStatusTabChange={handleStatusTabChange}
                        statusTabs={dynamicStatusTabs}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        selectedMethod={selectedMethod}
                        onMethodChange={handleMethodChange}
                        selectedTimeRange={selectedTimeRange}
                        onTimeRangeChange={handleTimeRangeChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        onResetFilters={handleResetFilters}
                        isFiltered={isFiltered}
                    />

                    {/* Transaction List Table & Mobile Cards */}
                    <PaymentHistoryTable
                        transactions={paginatedTransactions}
                        onViewInvoice={(tx) => setSelectedInvoice(tx)}
                        onPrintInvoice={(tx) => {
                            setSelectedInvoice(tx);
                            setTimeout(() => {
                                window.print();
                            }, 250);
                        }}
                    />

                    {/* Pagination */}
                    <PaymentPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredTransactions.length}
                        startIndex={startIndex}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </main>

            {/* 3. Electronic Invoice Modal */}
            <PaymentInvoiceModal
                transaction={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
            />
        </div>
    );
}
