import { useEffect, useState } from "react";

import { bookingApi } from "../../services/bookingApi.js";

import BookingFilterBar from "../../components/bookings/BookingFilterBar";
import BookingTable from "../../components/bookings/BookingTable";
import BookingDetailModal from "../../components/bookings/BookingDetailModal";

const PAGE_SIZE = 6;

// ==========================================
// BỘ LỌC MẶC ĐỊNH
// ==========================================

const DEFAULT_FILTERS = {
  keyword: "",
  status: "",
  branchId: "",
  branchServiceId: "",
  fromDate: "",
  toDate: "",
};

// ==========================================
// TRẠNG THÁI
// ==========================================

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-800",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-indigo-100 text-indigo-800",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-blue-100 text-blue-800",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-emerald-100 text-emerald-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-rose-100 text-rose-800",
  },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// ==========================================
// CHUYỂN BOOKING TỪ BACKEND SANG TABLE
// ==========================================

const normalizeBooking = (booking) => {
  const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;

  const branchName = booking.branchServiceId?.branchId?.name || "Chi nhánh";

  const serviceName = booking.branchServiceId?.serviceId?.name || "Dịch vụ";

  const isBoarding = booking.bookingType === "BOARDING";

  const appointmentTime =
    `${booking.startTime || "—"} - ` + `${booking.endTime || "—"}`;

  return {
    ...booking,

    _id: booking._id,

    id: booking.bookingCode || booking._id,

    customer:
      booking.customerId?.fullName || booking.customerId?.name || "Khách hàng",

    phone: booking.customerId?.phone || "",
    customerImg: booking.customerId?.avatar || "",

    pet: booking.petId?.name || "—",

    breed: booking.petId?.breed || "",
    petImg: booking.petId?.avatar || "",

    service: serviceName,
    branch: branchName,
    branchSub: branchName,

    date: isBoarding
      ? formatDate(booking.checkInDate)
      : formatDate(booking.bookingDate),

    timeStr: isBoarding ? "Lưu trú" : appointmentTime,

    time: isBoarding ? "Lưu trú" : appointmentTime,

    status: statusInfo.label,
    statusCode: booking.status,
    statusClass: statusInfo.className,

    isPendingAction: booking.status === "PENDING",

    bgHighlight: booking.status === "PENDING" ? "bg-amber-50/40" : "",

    raw: booking,
  };
};

// ==========================================
// BOOKINGS PAGE
// ==========================================

export default function BookingsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(1);

  const [bookingsList, setBookingsList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    branches: [],
    services: [],
  });

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  // ======================================
  // 1. DEBOUNCE TÌM KIẾM
  // ======================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(filters.keyword.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [filters.keyword]);

  // ======================================
  // 2. LẤY DANH SÁCH CHI NHÁNH / DỊCH VỤ
  // ======================================

  useEffect(() => {
    let cancelled = false;

    const fetchOptions = async () => {
      try {
        const response = await bookingApi.getFilterOptions();

        if (!cancelled) {
          setFilterOptions({
            branches: response?.data?.branches || [],
            services: response?.data?.services || [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Không thể tải bộ lọc chi nhánh, dịch vụ.");
        }
      }
    };

    fetchOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  // ======================================
  // 3. LẤY DANH SÁCH BOOKING TỪ BACKEND
  // ======================================

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await bookingApi.getBookings({
          page,
          limit: PAGE_SIZE,

          search: keyword,

          status: filters.status,

          branchId: filters.branchId,

          branchServiceId: filters.branchServiceId,

          fromDate: filters.fromDate,

          toDate: filters.toDate,
        });

        if (cancelled) return;

        const data = response?.data || {};

        const normalizedBookings = (data.bookings || []).map(normalizeBooking);

        setBookingsList(normalizedBookings);

        setPagination(
          data.pagination || {
            page,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Không thể tải danh sách Booking.");

          setBookingsList([]);

          setPagination({
            page,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    keyword,
    filters.status,
    filters.branchId,
    filters.branchServiceId,
    filters.fromDate,
    filters.toDate,
    reloadKey,
  ]);

  // ======================================
  // 4. KIỂM TRA TRANG PHÂN TRANG HỢP LỆ
  // ======================================

  useEffect(() => {
    if (loading || page <= 1) {
      return;
    }

    const totalPages = pagination.totalPages || 0;

    if (page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [loading, page, pagination.totalPages]);

  // ======================================
  // 5. CẬP NHẬT BỘ LỌC
  // ======================================

  const handleFilterChange = (updater) => {
    setFilters(updater);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setKeyword("");
    setPage(1);
  };

  const reloadBookings = () => {
    setReloadKey((prev) => prev + 1);
  };

  const findBooking = (id) =>
    bookingsList.find((item) => item._id === id || item.id === id);

  // ======================================
  // 6. DUYỆT BOOKING
  // ======================================

  const handleApprove = async (id) => {
    const booking = findBooking(id);

    if (!booking || saving) return;

    if (booking.statusCode !== "PENDING") {
      setError("Chỉ được duyệt Booking đang chờ xác nhận.");
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn duyệt Booking ${booking.id}?`)) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await bookingApi.updateBookingStatus(
        booking._id,
        "CONFIRMED",
        "Business Owner đã duyệt lịch đặt",
      );

      setSuccess(`Đã duyệt Booking ${booking.id} thành công.`);

      reloadBookings();
    } catch (err) {
      setError(err.message || "Không thể duyệt Booking.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // 7. TỪ CHỐI BOOKING
  // ======================================

  const handleReject = async (id) => {
    const booking = findBooking(id);

    if (!booking || saving) return;

    if (booking.statusCode !== "PENDING") {
      setError("Chỉ được từ chối Booking đang chờ xác nhận.");
      return;
    }

    const reason = window.prompt(`Nhập lý do từ chối Booking ${booking.id}:`);

    if (reason === null) return;

    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await bookingApi.updateBookingStatus(
        booking._id,
        "CANCELLED",
        reason.trim(),
      );

      setSuccess(`Đã từ chối Booking ${booking.id}.`);

      reloadBookings();
    } catch (err) {
      setError(err.message || "Không thể từ chối Booking.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // 8. BẮT ĐẦU / HOÀN THÀNH
  //    CHỈ CHO APPOINTMENT
  // ======================================

  const handleProgress = async (id, status) => {
    const booking = findBooking(id);

    if (!booking || saving) return;

    // BOARDING phải xử lý qua
    // Check-in / Check-out tại Quản lý lưu trú.
    if (booking.bookingType === "BOARDING") {
      setError("Đơn lưu trú phải được Check-in/Check-out tại Quản lý lưu trú.");
      return;
    }

    const validTransition =
      (booking.statusCode === "CONFIRMED" && status === "IN_PROGRESS") ||
      (booking.statusCode === "IN_PROGRESS" && status === "COMPLETED");

    if (!validTransition) {
      setError("Trạng thái Booking không cho phép thao tác này.");
      return;
    }

    const label = status === "IN_PROGRESS" ? "bắt đầu" : "hoàn thành";

    if (
      !window.confirm(
        `Bạn có chắc muốn ${label} dịch vụ cho Booking ${booking.id}?`,
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await bookingApi.updateBookingProgress(booking._id, status);

      setSuccess(
        status === "IN_PROGRESS"
          ? "Bắt đầu dịch vụ thành công."
          : "Hoàn thành dịch vụ thành công.",
      );

      reloadBookings();
    } catch (err) {
      setError(err.message || "Không thể cập nhật tiến độ Booking.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // 9. GIAO DIỆN
  // ======================================

  return (
    <main className="w-full min-w-0 max-w-none space-y-5 px-5 py-6 xl:px-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Quản lý đặt lịch</h1>

        <p className="mt-1 text-sm text-slate-500">
          Theo dõi và xử lý các yêu cầu đặt lịch của khách hàng.
        </p>
      </div>

      {/* THÔNG BÁO LỖI */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* THÔNG BÁO THÀNH CÔNG */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* BỘ LỌC */}
      <BookingFilterBar
        filters={filters}
        branches={filterOptions.branches}
        services={filterOptions.services}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* BẢNG VÀ PHÂN TRANG CHUNG MỘT KHUNG */}
      <section className="w-full min-w-0">
        <BookingTable
          bookings={bookingsList}
          onViewBooking={setSelectedBooking}
          onApproveBooking={handleApprove}
          onRejectBooking={handleReject}
          onProgressBooking={handleProgress}
          saving={saving}
          // Phân trang Backend
          serverPagination={true}
          pagination={pagination}
          onPageChange={setPage}
          loading={loading}
        />
      </section>

      {/* MODAL CHI TIẾT */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onChanged={reloadBookings}
        />
      )}
    </main>
  );
}
