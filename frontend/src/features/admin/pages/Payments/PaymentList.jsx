import { useEffect, useRef, useState } from "react";

import PaymentFilter from "../../components/payment/PaymentFilter";
import PaymentTable from "../../components/payment/PaymentTable";
import PaymentDetailPanel from "../../components/payment/PaymentDetailPanel";

import { adminPaymentApi } from "../../services/adminPaymentApi";

// ========================================
// CẤU HÌNH
// ========================================
const EMPTY_FILTERS = {
  search: "",
  status: "all",
  method: "all",
  fromDate: "",
  toDate: "",
};

const STATUS_LABELS = {
  PENDING: "Chờ thanh toán",
  PROCESSING: "Đang xử lý",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
};

const METHOD_LABELS = {
  CASH: "Tiền mặt",
  VNPAY: "VNPAY",
  MOMO: "MoMo",
  BANK_TRANSFER: "Chuyển khoản",
};

const formatDateTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

// Ngăn dữ liệu chuỗi bị Excel hiểu là công thức
const safeExcelText = (value) => {
  const text = String(value ?? "");

  return /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
};

export default function PaymentList() {
  // ========================================
  // 1. BỘ LỌC
  // ========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    ...EMPTY_FILTERS,
  });

  // ========================================
  // 2. DANH SÁCH PAYMENT
  // ========================================
  const [payments, setPayments] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // ========================================
  // 3. MODAL CHI TIẾT
  // ========================================
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Tránh phản hồi cũ ghi đè Payment đang chọn
  const detailRequestId = useRef(0);

  // ========================================
  // 4. XUẤT EXCEL
  // ========================================
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    if (!exportMessage) return;

    const timer = setTimeout(() => {
      setExportMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [exportMessage]);

  useEffect(() => {
    if (!exportError) return;

    const timer = setTimeout(() => {
      setExportError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [exportError]);

  // ========================================
  // 5. GỌI API DANH SÁCH
  // ========================================
  useEffect(() => {
    let cancelled = false;

    const loadPayments = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await adminPaymentApi.getPayments({
          ...appliedFilters,
          page,
          limit: pageSize,
        });

        if (cancelled) return;

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.payments)
        ) {
          throw new Error(
            response?.message || "Không thể tải danh sách thanh toán.",
          );
        }

        const data = response.data;

        const nextPagination = {
          page: Number(data.pagination?.page ?? page),
          limit: Number(data.pagination?.limit ?? pageSize),
          total: Number(data.pagination?.total ?? 0),
          totalPages: Number(data.pagination?.totalPages ?? 0),
        };

        if (page > 1 && page > Math.max(1, nextPagination.totalPages)) {
          setPage(Math.max(1, nextPagination.totalPages));
          return;
        }

        setPayments(data.payments);
        setPagination(nextPagination);
      } catch (err) {
        if (cancelled) return;

        setPayments([]);
        setError(err.message || "Không thể tải danh sách thanh toán.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPayments();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, page, pageSize, refreshKey]);

  // ========================================
  // 6. ÁP DỤNG BỘ LỌC
  // ========================================
  const handleApplyFilters = () => {
    setFilterError("");
    setExportMessage("");
    setExportError("");

    if (fromDate && toDate && fromDate > toDate) {
      setFilterError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    setAppliedFilters({
      search: searchQuery.trim(),
      status: statusFilter,
      method: methodFilter,
      fromDate,
      toDate,
    });

    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setFromDate("");
    setToDate("");

    setFilterError("");
    setExportMessage("");
    setExportError("");

    setAppliedFilters({ ...EMPTY_FILTERS });
    setPage(1);
  };

  // ========================================
  // 7. PHÂN TRANG
  // ========================================
  const handlePageChange = (nextPage) => {
    if (
      isLoading ||
      nextPage === page ||
      nextPage < 1 ||
      nextPage > pagination.totalPages
    ) {
      return;
    }

    setPage(nextPage);
  };

  const handlePageSizeChange = (nextSize) => {
    const parsedSize = Number(nextSize);

    if (![10, 20, 50].includes(parsedSize)) return;

    setPageSize(parsedSize);
    setPage(1);
  };

  // ========================================
  // 8. CHI TIẾT PAYMENT
  // ========================================
  const handleSelectPayment = async (payment) => {
    if (!payment?._id) return;

    const requestId = ++detailRequestId.current;

    setSelectedPayment(payment);
    setDetailError("");
    setIsDetailOpen(true);
    setIsDetailLoading(true);

    try {
      const response = await adminPaymentApi.getPaymentDetail(payment._id);

      if (requestId !== detailRequestId.current) return;

      if (response?.success === false || !response?.data?.payment) {
        throw new Error(
          response?.message || "Không thể tải chi tiết thanh toán.",
        );
      }

      setSelectedPayment(response.data.payment);
    } catch (err) {
      if (requestId !== detailRequestId.current) return;

      setDetailError(err.message || "Không thể tải chi tiết thanh toán.");
    } finally {
      if (requestId === detailRequestId.current) {
        setIsDetailLoading(false);
      }
    }
  };

  const handleCloseDetail = () => {
    ++detailRequestId.current;

    setIsDetailOpen(false);
    setSelectedPayment(null);
    setIsDetailLoading(false);
    setDetailError("");
  };

  // ========================================
  // 9. XUẤT EXCEL
  // ========================================
  const handleExportExcel = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportMessage("");
    setExportError("");

    try {
      // Chỉ dùng bộ lọc ĐÃ ÁP DỤNG bằng nút "Lọc"
      const filters = { ...appliedFilters };

      // 9.1. GỌI API LẤY TOÀN BỘ PAYMENT
      const EXPORT_LIMIT = 50;

      const fetchPage = async (pageNumber) => {
        const response = await adminPaymentApi.getPayments({
          ...filters,
          page: pageNumber,
          limit: EXPORT_LIMIT,
        });

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.payments)
        ) {
          throw new Error(
            response?.message || `Không thể tải Payment trang ${pageNumber}.`,
          );
        }

        return response.data;
      };

      const firstData = await fetchPage(1);

      const total = Number(firstData.pagination?.total);

      if (!Number.isSafeInteger(total) || total < 0) {
        throw new Error("API trả về tổng số Payment không hợp lệ.");
      }

      const totalPages = Math.ceil(total / EXPORT_LIMIT);

      const allPayments = [...firstData.payments];

      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        const pageData = await fetchPage(currentPage);

        allPayments.push(...pageData.payments);
      }

      // Kiểm tra đủ bản ghi, không có _id bị trùng.
      const uniqueIds = new Set(allPayments.map((item) => String(item._id)));

      if (
        allPayments.length !== total ||
        uniqueIds.size !== allPayments.length
      ) {
        throw new Error(
          "Dữ liệu thay đổi trong lúc xuất Excel. " + "Vui lòng thử lại.",
        );
      }

      // 9.2. TẢI THƯ VIỆN EXCELJS
      const ExcelJSModule = await import("exceljs");
      const ExcelJS = ExcelJSModule.default || ExcelJSModule;

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "PetCare Booking";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Bao cao thanh toan");

      // 9.3. KHAI BÁO 15 CỘT
      worksheet.columns = [
        { key: "stt", width: 8 },
        { key: "paymentCode", width: 27 },
        { key: "bookingCode", width: 27 },
        { key: "customerName", width: 25 },
        { key: "customerPhone", width: 19 },
        { key: "businessName", width: 30 },
        { key: "amount", width: 21 },
        { key: "method", width: 20 },
        { key: "status", width: 21 },
        { key: "transactionId", width: 28 },
        { key: "provider", width: 22 },
        { key: "createdAt", width: 23 },
        { key: "paidAt", width: 23 },
        { key: "failedAt", width: 23 },
        { key: "failureReason", width: 43 },
      ];

      // 9.4. TIÊU ĐỀ
      worksheet.mergeCells("A1:O1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "BÁO CÁO QUẢN LÝ THANH TOÁN - PETCARE BOOKING";

      titleCell.font = {
        name: "Arial",
        bold: true,
        size: 16,
        color: { argb: "FFFFFFFF" },
      };

      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF047857" },
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 38;

      worksheet.mergeCells("A2:O2");

      worksheet.getCell("A2").value =
        `Ngày xuất: ${formatDateTime(new Date())}`;

      worksheet.getCell("A2").font = {
        italic: true,
        color: { argb: "FF64748B" },
      };

      worksheet.getRow(2).height = 24;

      // Mô tả bộ lọc
      const filterDescriptions = [];

      if (filters.search) {
        filterDescriptions.push(`Tìm kiếm: ${filters.search}`);
      }

      if (filters.status !== "all") {
        filterDescriptions.push(
          `Trạng thái: ${STATUS_LABELS[filters.status] || filters.status}`,
        );
      }

      if (filters.method !== "all") {
        filterDescriptions.push(
          `Phương thức: ${METHOD_LABELS[filters.method] || filters.method}`,
        );
      }

      if (filters.fromDate) {
        filterDescriptions.push(`Từ ngày: ${filters.fromDate}`);
      }

      if (filters.toDate) {
        filterDescriptions.push(`Đến ngày: ${filters.toDate}`);
      }

      worksheet.mergeCells("A3:O3");

      worksheet.getCell("A3").value =
        "Bộ lọc: " +
        safeExcelText(
          filterDescriptions.length
            ? filterDescriptions.join(" | ")
            : "Tất cả giao dịch",
        );

      worksheet.getCell("A3").font = {
        color: { argb: "FF475569" },
      };

      worksheet.getRow(3).height = 26;

      // 9.5. HEADER
      const headerRow = worksheet.getRow(5);

      headerRow.values = [
        "STT",
        "Mã thanh toán",
        "Mã Booking",
        "Khách hàng",
        "Số điện thoại",
        "Thương hiệu",
        "Số tiền (VNĐ)",
        "Phương thức",
        "Trạng thái",
        "Mã giao dịch",
        "Nhà cung cấp",
        "Ngày tạo giao dịch",
        "Ngày thanh toán",
        "Ngày thất bại",
        "Lý do thất bại",
      ];

      headerRow.height = 32;

      headerRow.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: 11,
          bold: true,
          color: { argb: "FFFFFFFF" },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0F766E" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };

        cell.border = {
          bottom: {
            style: "thin",
            color: { argb: "FFD1D5DB" },
          },
        };
      });

      worksheet.views = [
        {
          state: "frozen",
          ySplit: 5,
        },
      ];

      // 9.6. ĐỔ DỮ LIỆU
      allPayments.forEach((payment, index) => {
        const row = worksheet.addRow({
          stt: index + 1,
          paymentCode: safeExcelText(payment.paymentCode),
          bookingCode: safeExcelText(payment.booking?.bookingCode),
          customerName: safeExcelText(payment.customer?.fullName),
          customerPhone: safeExcelText(payment.customer?.phone),
          businessName: safeExcelText(payment.business?.name),
          amount: Number(payment.amount ?? 0),
          method:
            METHOD_LABELS[payment.method] || safeExcelText(payment.method),
          status:
            STATUS_LABELS[payment.status] || safeExcelText(payment.status),
          transactionId: safeExcelText(payment.transactionId),
          provider: safeExcelText(payment.provider),
          createdAt: formatDateTime(payment.createdAt),
          paidAt:
            payment.status === "PAID" ? formatDateTime(payment.paidAt) : "",
          failedAt:
            payment.status === "FAILED" ? formatDateTime(payment.failedAt) : "",
          failureReason:
            payment.status === "FAILED"
              ? safeExcelText(payment.failureReason)
              : "",
        });

        row.height = 25;

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            bottom: {
              style: "hair",
              color: { argb: "FFE2E8F0" },
            },
          };

          if (index % 2 === 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF8FAFC" },
            };
          }
        });

        // Giữ số điện thoại dưới dạng text
        row.getCell(5).numFmt = "@";

        // Giữ số tiền là Number để tính tổng
        row.getCell(7).numFmt = '#,##0" ₫"';
        row.getCell(7).alignment = {
          horizontal: "right",
          vertical: "middle",
        };

        // Màu trạng thái
        const statusCell = row.getCell(9);

        if (payment.status === "PAID") {
          statusCell.font = {
            bold: true,
            color: { argb: "FF059669" },
          };
        } else if (payment.status === "FAILED") {
          statusCell.font = {
            bold: true,
            color: { argb: "FFDC2626" },
          };
        } else if (payment.status === "PROCESSING") {
          statusCell.font = {
            bold: true,
            color: { argb: "FFD97706" },
          };
        }
      });

      // 9.7. TÍNH TỔNG KẾT
      const totalTransactionAmount = allPayments.reduce(
        (sum, item) => sum + Number(item.amount ?? 0),
        0,
      );

      const paidPayments = allPayments.filter((item) => item.status === "PAID");

      const totalPaidAmount = paidPayments.reduce(
        (sum, item) => sum + Number(item.amount ?? 0),
        0,
      );

      const summaryStartRow = Math.max(5, worksheet.lastRow?.number ?? 5) + 2;

      const summaryRows = [
        {
          label: "TỔNG GIÁ TRỊ GIAO DỊCH",
          value: totalTransactionAmount,
          isMoney: true,
        },
        {
          label: "TỔNG TIỀN THANH TOÁN THÀNH CÔNG",
          value: totalPaidAmount,
          isMoney: true,
        },
        {
          label: "TỔNG SỐ GIAO DỊCH",
          value: allPayments.length,
          isMoney: false,
        },
        {
          label: "SỐ GIAO DỊCH THÀNH CÔNG",
          value: paidPayments.length,
          isMoney: false,
        },
      ];

      summaryRows.forEach((summary, index) => {
        const rowNumber = summaryStartRow + index;

        worksheet.mergeCells(`A${rowNumber}:F${rowNumber}`);

        const labelCell = worksheet.getCell(`A${rowNumber}`);

        const valueCell = worksheet.getCell(`G${rowNumber}`);

        labelCell.value = summary.label;
        valueCell.value = summary.value;

        labelCell.font = {
          bold: true,
          color: { argb: "FF065F46" },
        };

        valueCell.font = {
          bold: true,
          color: { argb: "FF065F46" },
        };

        labelCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" },
        };

        valueCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" },
        };

        valueCell.numFmt = summary.isMoney ? '#,##0" ₫"' : "#,##0";

        worksheet.getRow(rowNumber).height = 27;
      });

      // 9.8. TẠO VÀ TẢI FILE XLSX
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);

      try {
        const link = document.createElement("a");

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        link.href = url;
        link.download = `BaoCaoThanhToan_${timestamp}.xlsx`;

        document.body.appendChild(link);
        link.click();
        link.remove();
      } finally {
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }

      setExportMessage(
        `Đã tạo báo cáo Excel gồm ${allPayments.length} giao dịch, ` +
          `trong đó có ${paidPayments.length} giao dịch thành công.`,
      );
    } catch (err) {
      console.error("Export Payment Excel:", err);

      setExportError(err.message || "Không thể xuất báo cáo thanh toán.");
    } finally {
      setIsExporting(false);
    }
  };

  // ========================================
  // 10. RENDER
  // ========================================
  return (
    <main className="min-w-0 space-y-6 p-4 md:p-8">
      <PaymentFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onExport={handleExportExcel}
        isExporting={isExporting}
      />

      {filterError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {filterError}
        </div>
      )}

      {exportError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {exportError}
        </div>
      )}

      {exportMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"
        >
          {exportMessage}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {error}

          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="ml-3 font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="w-full">
        <PaymentTable
          payments={payments}
          totalPayments={pagination.total}
          pagination={pagination}
          isLoading={isLoading}
          selectedRowId={isDetailOpen ? selectedPayment?._id : null}
          onSelectPayment={handleSelectPayment}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <PaymentDetailPanel
        payment={selectedPayment}
        isOpen={isDetailOpen}
        isLoading={isDetailLoading}
        error={detailError}
        onClose={handleCloseDetail}
      />
    </main>
  );
}
