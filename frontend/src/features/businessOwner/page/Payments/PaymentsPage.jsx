import { useMemo, useState } from "react";

import { PAYMENTS_DATA } from "../../data/paymentData";

import PaymentMetrics from "../../components/payments/PaymentMetrics";
import PaymentFilters from "../../components/payments/PaymentFilters";
import PaymentTable from "../../components/payments/PaymentTable";
import PaymentDetailModal from "../../components/payments/PaymentDetailModal";

const INITIAL_FILTERS = {
  branch: "Tất cả",
  status: "Tất cả",
  method: "Tất cả",
};

export default function PaymentsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return PAYMENTS_DATA.filter((payment) => {
      const matchesSearch =
        !keyword ||
        [
          payment.id,
          payment.customer,
          payment.phone,
          payment.branch,
          payment.service,
          payment.method,
        ].some((value) => value.toLowerCase().includes(keyword));

      const matchesBranch =
        filters.branch === "Tất cả" ||
        payment.branch.includes(filters.branch);

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
        matchesMethod
      );
    });
  }, [filters, searchTerm]);

  const handleReset = () => {
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
      <PaymentMetrics />

      {/* 2. Bộ lọc & Bảng danh sách giao dịch (chiếm toàn bộ chiều rộng) */}
      <div className="space-y-4">
        <PaymentFilters
          filters={filters}
          setFilters={handleFiltersChange}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          onReset={handleReset}
          onExport={handleExport}
        />

        <PaymentTable
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