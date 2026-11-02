import { useEffect, useMemo, useState } from "react";

import { ownerPaymentApi } from "../../services/paymentApi";
import { mapOwnerPayment, matchesPaymentDates, summarizePayments } from "../../services/paymentView";

import PaymentMetrics from "../../components/payments/PaymentMetrics";
import PaymentFilters from "../../components/payments/PaymentFilters";
import PaymentTable from "../../components/payments/PaymentTable";
import PaymentDetailModal from "../../components/payments/PaymentDetailModal";

const INITIAL_FILTERS = {
  branch: "Tất cả",
  fromDate: "",
  toDate: "",
  status: "Tất cả",
  method: "Tất cả",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    ownerPaymentApi.list(controller.signal).then((response) => {
      if (controller.signal.aborted) return;
      setPayments((response.data || []).map(mapOwnerPayment));
      setBranches(response.branches || []);
    }).catch((err) => {
      if (!controller.signal.aborted) setError(err.message || "Không thể tải thanh toán");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [refreshKey]);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !keyword ||
        [
          payment.id,
          payment.bookingCode,
          payment.customer,
          payment.phone,
          payment.branch,
          payment.service,
          payment.method,
        ].some((value) => value.toLowerCase().includes(keyword));

      const matchesBranch =
        filters.branch === "Tất cả" ||
        payment.branchId === filters.branch;

      const matchesStatus =
        filters.status === "Tất cả" ||
        payment.status === filters.status;

      const matchesMethod =
        filters.method === "Tất cả" ||
        payment.method.toLowerCase().includes(filters.method.toLowerCase());

      return (
        matchesSearch &&
        matchesBranch &&
        matchesStatus &&
        matchesMethod &&
        matchesPaymentDates(payment, filters.fromDate, filters.toDate)
      );
    });
  }, [payments, filters, searchTerm]);

  const metrics = summarizePayments(filteredPayments);

  const handleReset = () => {
    setLoading(true);
    setError("");
    setSelectedPayment(null);
    setRefreshKey((key) => key + 1);
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleFiltersChange = (update) => {
    setFilters(update);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
  };

  const handleExport = () => {
    const headers = [
      "Mã thanh toán",
      "Khách hàng",
      "Số điện thoại",
      "Dịch vụ",
      "Chi nhánh",
      "Phương thức",
      "Số tiền",
      "Ngày thanh toán",
      "Trạng thái",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.customer,
      payment.phone,
      payment.service,
      payment.branch,
      payment.method,
      payment.amount,
      payment.date,
      payment.status,
    ]);

    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "bao-cao-thanh-toan.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const displayedPayment = selectedPayment
    ? filteredPayments.find((payment) => payment.id === selectedPayment.id) || selectedPayment
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* 1. Các thẻ chỉ số thống kê */}
      <PaymentMetrics metrics={metrics} unavailable={loading || Boolean(error)} />

      {/* 2. Bộ lọc & Bảng danh sách giao dịch (chiếm toàn bộ chiều rộng) */}
      <div className="space-y-4">
        <PaymentFilters
          branches={branches}
          disabled={loading || Boolean(error)}
          filters={filters}
          setFilters={handleFiltersChange}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          onReset={handleReset}
          onExport={handleExport}
        />

        <PaymentTable
          loading={loading}
          error={error}
          payments={filteredPayments}
          selectedPaymentId={displayedPayment?.id}
          onSelectPayment={handleSelectPayment}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={6}
        />
      </div>

      {/* 3. Modal chi tiết thanh toán hiển thị nổi trên màn hình */}
      {displayedPayment && (
        <PaymentDetailModal
          payment={displayedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
