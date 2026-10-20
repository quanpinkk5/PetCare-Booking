import React, { useEffect, useState } from "react";

import { PawPrint, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

import BookingMetrics from "../../components/booking/BookingMetrics";
import BookingFilter from "../../components/booking/BookingFilter";
import BookingTable from "../../components/booking/BookingTable";

import { adminBookingApi } from "../../services/adminBookingApi";

// ==============================
// CẤU HÌNH
// ==============================
const EMPTY_FILTERS = {
  search: "",
  status: "all",
  bookingType: "all",
  fromDate: "",
  toDate: "",
};

const STATUS_MAP = {
  "Tất cả trạng thái": "all",
  "Chờ xác nhận": "PENDING",
  "Đã xác nhận": "CONFIRMED",
  "Đang thực hiện": "IN_PROGRESS",
  "Hoàn thành": "COMPLETED",
  "Đã hủy": "CANCELLED",
};

const BOOKING_STATUS_LABELS = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang thực hiện",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const PAYMENT_STATUS_LABELS = {
  PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán",
};

const TYPE_LABELS = {
  APPOINTMENT: "Đặt lịch",
  BOARDING: "Lưu trú",
};

const INITIAL_METRICS = {
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  inProgressBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
};

const formatNumber = (value) => Number(value ?? 0).toLocaleString("vi-VN");

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
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

const getSchedule = (booking) => {
  if (booking.bookingType === "APPOINTMENT") {
    const date = formatDate(booking.bookingDate);
    const start = booking.startTime || "";
    const end = booking.endTime || "";

    if (!date) return "";

    const timeRange = start && end ? `${start} - ${end}` : start || end;

    return timeRange ? `${date} | ${timeRange}` : date;
  }

  if (booking.bookingType === "BOARDING") {
    const checkIn = formatDate(booking.checkInDate);
    const checkOut = formatDate(booking.checkOutDate);

    if (!checkIn && !checkOut) return "";

    return `${checkIn} - ${checkOut}`;
  }

  return "";
};

// Nếu Backend trả object địa chỉ thì vẫn xử lý an toàn
const getBranchAddress = (address) => {
  if (typeof address === "string") {
    return address;
  }

  if (address && typeof address === "object") {
    return [address.detail, address.district, address.province]
      .filter(Boolean)
      .join(", ");
  }

  return "";
};

export default function BookingList() {
  // ==============================
  // 1. INPUT BỘ LỌC
  // ==============================
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [bookingTypeFilter, setBookingTypeFilter] = useState(
    "Tất cả loại booking",
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({ ...EMPTY_FILTERS });

  // ==============================
  // 2. DANH SÁCH
  // ==============================
  const [bookings, setBookings] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [filterError, setFilterError] = useState("");

  // ==============================
  // 3. THỐNG KÊ
  // ==============================
  const [bookingMetrics, setBookingMetrics] = useState(INITIAL_METRICS);

  const [metricsLoading, setMetricsLoading] = useState(true);

  const [metricsError, setMetricsError] = useState("");

  // ==============================
  // 4. XUẤT EXCEL
  // ==============================
  const [isExporting, setIsExporting] = useState(false);

  const [exportMessage, setExportMessage] = useState("");

  const [exportError, setExportError] = useState("");

  // ==============================
  // 5. GỌI API METRICS
  // ==============================
  useEffect(() => {
    let cancelled = false;

    const loadMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError("");

      try {
        const response = await adminBookingApi.getMetrics();

        if (cancelled) return;

        if (response?.success === false || !response?.data) {
          throw new Error(
            response?.message || "Không thể tải thống kê booking.",
          );
        }

        setBookingMetrics({
          ...INITIAL_METRICS,
          ...response.data,
        });
      } catch (error) {
        if (!cancelled) {
          setMetricsError(error.message || "Không thể tải thống kê booking.");
        }
      } finally {
        if (!cancelled) {
          setMetricsLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==============================
  // 6. GỌI API DANH SÁCH
  // ==============================
  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      setListLoading(true);
      setListError("");

      try {
        const response = await adminBookingApi.getBookings({
          ...appliedFilters,
          page,
          limit: pageSize,
        });

        if (cancelled) return;

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.bookings)
        ) {
          throw new Error(
            response?.message || "Không thể tải danh sách booking.",
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

        setBookings(data.bookings);
        setPagination(nextPagination);
      } catch (error) {
        if (cancelled) return;

        setBookings([]);
        setListError(error.message || "Không thể tải danh sách booking.");
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, page, pageSize, refreshKey]);

  // ==============================
  // 7. 5 THẺ THỐNG KÊ
  // ==============================
  const metrics = [
    {
      title: "Tổng booking",
      value: metricsLoading
        ? "..."
        : formatNumber(bookingMetrics.totalBookings),
      icon: Calendar,
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Chờ xác nhận",
      value: metricsLoading
        ? "..."
        : formatNumber(bookingMetrics.pendingBookings),
      icon: Clock,
      bg: "bg-amber-50 text-amber-500",
    },
    {
      title: "Đang thực hiện",
      value: metricsLoading
        ? "..."
        : formatNumber(bookingMetrics.inProgressBookings),
      icon: PawPrint,
      bg: "bg-sky-50 text-sky-500",
    },
    {
      title: "Hoàn thành",
      value: metricsLoading
        ? "..."
        : formatNumber(bookingMetrics.completedBookings),
      icon: CheckCircle2,
      bg: "bg-teal-50 text-teal-600",
    },
    {
      title: "Đã hủy",
      value: metricsLoading
        ? "..."
        : formatNumber(bookingMetrics.cancelledBookings),
      icon: XCircle,
      bg: "bg-rose-50 text-rose-500",
    },
  ];

  // ==============================
  // 8. LỌC
  // ==============================
  const handleFilter = () => {
    setFilterError("");

    if (fromDate && toDate && fromDate > toDate) {
      setFilterError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    setAppliedFilters({
      search: searchQuery.trim(),
      status: STATUS_MAP[statusFilter] || "all",
      bookingType:
        bookingTypeFilter === "Tất cả loại booking" ? "all" : bookingTypeFilter,
      fromDate,
      toDate,
    });

    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("Tất cả trạng thái");
    setBookingTypeFilter("Tất cả loại booking");
    setFromDate("");
    setToDate("");
    setFilterError("");

    setAppliedFilters({ ...EMPTY_FILTERS });
    setPage(1);
  };

  // ==============================
  // 9. PHÂN TRANG
  // ==============================
  const handlePageChange = (nextPage) => {
    if (
      listLoading ||
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const handlePageSizeChange = (nextSize) => {
    if (listLoading || ![10, 20].includes(nextSize)) {
      return;
    }

    setPageSize(nextSize);
    setPage(1);
  };

  // ==============================
  // 10. XUẤT EXCEL
  // ==============================
  const handleExportExcel = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportError("");
    setExportMessage("");

    try {
      // Dùng đúng bộ lọc ĐÃ NHẤN "LỌC",
      // không dùng input chưa áp dụng.
      const filters = { ...appliedFilters };

      // Chỉ tải ExcelJS khi cần xuất file.
      const ExcelJSModule = await import("exceljs");
      const ExcelJS = ExcelJSModule.default || ExcelJSModule;

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "PetCare Booking";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Bao cao Booking");

      // 1. Tiêu đề báo cáo
      worksheet.mergeCells("A1:O1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "BÁO CÁO DANH SÁCH BOOKING - PETCARE BOOKING";

      titleCell.font = {
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
        vertical: "middle",
        horizontal: "center",
      };

      worksheet.getRow(1).height = 34;

      worksheet.mergeCells("A2:O2");

      worksheet.getCell("A2").value =
        `Ngày xuất: ${formatDateTime(new Date())}`;

      worksheet.getCell("A2").font = {
        italic: true,
        color: { argb: "FF64748B" },
      };

      worksheet.getRow(2).height = 24;

      // 2. Cấu hình cột
      worksheet.columns = [
        { key: "stt", width: 8 },
        { key: "bookingCode", width: 25 },
        { key: "customerName", width: 25 },
        { key: "customerPhone", width: 18 },
        { key: "petName", width: 20 },
        { key: "serviceName", width: 32 },
        { key: "branchName", width: 32 },
        { key: "branchAddress", width: 48 },
        { key: "bookingType", width: 18 },
        { key: "createdAt", width: 24 },
        { key: "schedule", width: 35 },
        { key: "totalPrice", width: 20 },
        { key: "bookingStatus", width: 20 },
        { key: "paymentStatus", width: 20 },
        { key: "numberOfDays", width: 16 },
      ];

      // 3. Header bảng
      const headerRow = worksheet.getRow(4);

      headerRow.values = [
        "STT",
        "Mã booking",
        "Khách hàng",
        "Số điện thoại",
        "Thú cưng",
        "Dịch vụ",
        "Chi nhánh",
        "Địa chỉ chi nhánh",
        "Loại booking",
        "Ngày đặt",
        "Lịch hẹn / Lưu trú",
        "Tổng tiền (VNĐ)",
        "Trạng thái booking",
        "Trạng thái thanh toán",
        "Số ngày lưu trú",
      ];

      headerRow.height = 29;

      headerRow.eachCell((cell) => {
        cell.font = {
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
          ySplit: 4,
        },
      ];

      // 4. Lấy toàn bộ Booking theo bộ lọc
      const EXPORT_LIMIT = 50;

      const fetchPage = async (pageNumber) => {
        const response = await adminBookingApi.getBookings({
          ...filters,
          page: pageNumber,
          limit: EXPORT_LIMIT,
        });

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.bookings)
        ) {
          throw new Error(
            response?.message || `Không thể lấy dữ liệu trang ${pageNumber}.`,
          );
        }

        return response.data;
      };

      const firstData = await fetchPage(1);

      const total = Number(firstData.pagination?.total ?? 0);

      const totalPages = Math.ceil(total / EXPORT_LIMIT);

      const allBookings = [...firstData.bookings];

      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        const pageData = await fetchPage(currentPage);

        allBookings.push(...pageData.bookings);
      }

      if (allBookings.length !== total) {
        throw new Error(
          "Số lượng Booking thay đổi trong lúc xuất. " +
            "Vui lòng thử lại để tránh thiếu hoặc trùng dữ liệu.",
        );
      }

      // 5. Đưa dữ liệu vào Excel
      allBookings.forEach((booking, index) => {
        const row = worksheet.addRow({
          stt: index + 1,
          bookingCode: booking.bookingCode || "",
          customerName: booking.customer?.fullName || "",
          customerPhone: booking.customer?.phone || "",
          petName: booking.pet?.name || "",
          serviceName: booking.service?.name || "",
          branchName: booking.branch?.name || "",
          branchAddress: getBranchAddress(booking.branch?.address),
          bookingType:
            TYPE_LABELS[booking.bookingType] || booking.bookingType || "",
          createdAt: formatDateTime(booking.createdAt),
          schedule: getSchedule(booking),
          totalPrice: Number(booking.totalPrice ?? 0),
          bookingStatus:
            BOOKING_STATUS_LABELS[booking.status] || booking.status || "",
          paymentStatus:
            PAYMENT_STATUS_LABELS[booking.paymentStatus] ||
            booking.paymentStatus ||
            "",
          numberOfDays:
            booking.bookingType === "BOARDING"
              ? (booking.numberOfDays ?? "")
              : "",
        });

        row.height = 23;

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            bottom: {
              style: "hair",
              color: {
                argb: "FFE2E8F0",
              },
            },
          };

          if (index % 2 === 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: "FFF8FAFC",
              },
            };
          }
        });

        // Giữ số điện thoại dạng text,
        // tránh mất số 0 ở đầu.
        row.getCell(4).numFmt = "@";

        // Cột tổng tiền lưu dạng Number
        // để tính tổng trong Excel được.
        row.getCell(12).numFmt = '#,##0" ₫"';
        row.getCell(12).alignment = {
          horizontal: "right",
          vertical: "middle",
        };
      });

      // 6. Dòng tổng kết
      const summaryRow = worksheet.addRow({
        bookingCode: "TỔNG CỘNG",
        totalPrice: allBookings.reduce(
          (sum, booking) => sum + Number(booking.totalPrice ?? 0),
          0,
        ),
      });

      summaryRow.height = 28;

      summaryRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFD1FAE5",
          },
        };

        cell.font = {
          bold: true,
          color: {
            argb: "FF065F46",
          },
        };
      });

      summaryRow.getCell(12).numFmt = '#,##0" ₫"';

      // 7. Tạo file XLSX
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      link.href = url;
      link.download = `BaoCaoBooking_${timestamp}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setExportMessage(
        `Đã tạo báo cáo Excel gồm ${allBookings.length} Booking.`,
      );
    } catch (error) {
      console.error("Export Booking Excel:", error);

      setExportError(error.message || "Không thể xuất báo cáo Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  // ==============================
  // 11. RENDER
  // ==============================
  return (
    <div className="p-8 space-y-6 flex-1">
      {/* METRICS */}
      <BookingMetrics metrics={metrics} />

      {metricsError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {metricsError}
        </div>
      )}

      {/* FILTER */}
      <BookingFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        bookingTypeFilter={bookingTypeFilter}
        setBookingTypeFilter={setBookingTypeFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onFilter={handleFilter}
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

      {listError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {listError}

          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="ml-3 font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* BOOKING TABLE */}
      <BookingTable
        bookings={bookings}
        pagination={pagination}
        isLoading={listLoading}
        hasError={Boolean(listError)}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
