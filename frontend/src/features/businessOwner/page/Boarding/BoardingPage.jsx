import { useEffect, useMemo, useState } from "react";
import { LogIn, AlertCircle, CheckCircle2 } from "lucide-react";

import { boardingApi } from "../../services/boardingApi.js";
import { petDiaryApi } from "../../services/petDiaryApi.js";

import BoardingFilters from "../../components/boarding/BoardingFilters";
import BoardingTable from "../../components/boarding/BoardingTable";
import BoardingDetailModal from "../../components/boarding/BoardingDetailModal";
import AddDiaryModal from "../../components/boarding/AddDiaryModal";
import CheckoutModal from "../../components/boarding/CheckoutModal";

const PAGE_SIZE = 5;

// ========================================
// 1. CẤU HÌNH TRẠNG THÁI
// ========================================

const STATUS_CONFIG = {
  PENDING: {
    label: "CHỜ XÁC NHẬN",
    className: "bg-amber-100 text-amber-700",
  },
  CONFIRMED: {
    label: "CHỜ CHECK-IN",
    className: "bg-indigo-100 text-indigo-700",
  },
  IN_PROGRESS: {
    label: "ĐANG LƯU TRÚ",
    className: "bg-blue-100 text-blue-700",
  },
  COMPLETED: {
    label: "ĐÃ CHECK-OUT",
    className: "bg-slate-100 text-slate-600",
  },
  CANCELLED: {
    label: "ĐÃ HỦY",
    className: "bg-rose-100 text-rose-700",
  },
};

const STATUS_FILTER_MAP = {
  all: "",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  "CHỜ XÁC NHẬN": "PENDING",
  "CHỜ CHECK-IN": "CONFIRMED",
  "ĐANG LƯU TRÚ": "IN_PROGRESS",
  "ĐÃ CHECK-OUT": "COMPLETED",
  "ĐÃ HỦY": "CANCELLED",
};

// ========================================
// 2. FORMAT NGÀY GIỜ
// ========================================

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

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

// ========================================
// 3. NORMALIZE BOOKING CHO BOARDING TABLE
// ========================================

const normalizeBoarding = (booking) => {
  const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;

  const pet =
    booking.petId && typeof booking.petId === "object" ? booking.petId : {};

  const customer =
    booking.customerId && typeof booking.customerId === "object"
      ? booking.customerId
      : {};

  const boardingDetails =
    booking.boardingDetails &&
    typeof booking.boardingDetails === "object" &&
    !Array.isArray(booking.boardingDetails)
      ? booking.boardingDetails
      : {};

  const actualCheckInAt = boardingDetails.actualCheckInAt;

  const actualCheckOutAt = boardingDetails.actualCheckOutAt;

  const petType = [pet.species, pet.breed].filter(Boolean).join(" • ");

  const roomName =
    boardingDetails.roomName || boardingDetails.room || "Chưa cập nhật phòng";

  const checkInTime = actualCheckInAt
    ? `Đã nhận lúc ${formatTime(actualCheckInAt)}`
    : "Ngày nhận dự kiến";

  let checkoutStatus = "Ngày trả dự kiến";
  let checkoutColor = "text-slate-400";

  if (booking.status === "COMPLETED") {
    checkoutStatus = actualCheckOutAt
      ? `Đã trả lúc ${formatTime(actualCheckOutAt)}`
      : "Đã hoàn thành";

    checkoutColor = "text-emerald-600";
  } else if (booking.status === "IN_PROGRESS") {
    checkoutStatus = "Đang lưu trú";
    checkoutColor = "text-blue-600";
  } else if (booking.status === "CANCELLED") {
    checkoutStatus = "Đơn đã hủy";
    checkoutColor = "text-rose-500";
  }

  return {
    id: booking.bookingCode || booking._id,

    _id: booking._id,
    bookingId: booking._id,

    name: pet.name || "Thú cưng",

    type: petType || "Chưa cập nhật",

    img: pet.imageUrl || pet.avatar || pet.image || "",

    owner: customer.fullName || customer.name || "Khách hàng",

    phone: customer.phone || "—",

    email: customer.email || "",

    roomName,

    checkinDate: formatDate(booking.checkInDate),

    checkinTime: checkInTime,

    checkoutDate: formatDate(booking.checkOutDate),

    checkoutStatus,
    checkoutColor,

    status: statusInfo.label,
    statusCode: booking.status,
    statusClass: statusInfo.className,

    isActive: booking.status === "IN_PROGRESS",

    numberOfDays: booking.numberOfDays,

    customerNote: booking.customerNote || "",

    boardingDetails,

    actualCheckInAt,
    actualCheckOutAt,

    totalPrice: booking.totalPrice,

    paymentStatus: booking.paymentStatus,

    raw: booking,
  };
};

// ========================================
// 4. BOARDING PAGE
// ========================================

export default function BoardingPage() {
  // ======================================
  // FILTER
  // ======================================

  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const invalidDateRange = Boolean(fromDate && toDate && fromDate > toDate);

  const apiStatus = STATUS_FILTER_MAP[statusFilter] ?? statusFilter;

  // ======================================
  // BACKEND DATA
  // ======================================

  const [petsList, setPetsList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  // ======================================
  // THÚ CƯNG ĐƯỢC CHỌN
  // ======================================

  const [selectedPetId, setSelectedPetId] = useState(null);

  // ======================================
  // MODAL
  // ======================================

  const [selectedDetailPet, setSelectedDetailPet] = useState(null);

  const [diaryModalPet, setDiaryModalPet] = useState(null);

  const [checkoutModalPet, setCheckoutModalPet] = useState(null);

  // ======================================
  // 5. DEBOUNCE SEARCH
  // ======================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // ======================================
  // 6. LẤY DANH SÁCH LƯU TRÚ
  // ======================================

  useEffect(() => {
    let cancelled = false;

    const fetchBoardings = async () => {
      if (invalidDateRange) {
        setLoading(false);
        setPetsList([]);

        setPagination({
          page: currentPage,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        });

        setError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");

        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await boardingApi.getBoardings({
          page: currentPage,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status: apiStatus,
          fromDate,
          toDate,
        });

        if (cancelled) return;

        const data = response?.data || {};

        const normalized = (data.bookings || []).map(normalizeBoarding);

        setPetsList(normalized);

        setPagination(
          data.pagination || {
            page: currentPage,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Không thể tải danh sách lưu trú.");

          setPetsList([]);

          setPagination({
            page: currentPage,
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

    fetchBoardings();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    debouncedSearch,
    apiStatus,
    fromDate,
    toDate,
    invalidDateRange,
    reloadKey,
  ]);

  // ======================================
  // 7. ĐỒNG BỘ THÚ CƯNG ĐƯỢC CHỌN
  // ======================================

  useEffect(() => {
    if (petsList.length === 0) {
      setSelectedPetId(null);
      return;
    }

    setSelectedPetId((previousId) => {
      const exists = petsList.some((pet) => pet.id === previousId);

      if (exists) {
        return previousId;
      }

      const activePet = petsList.find((pet) => pet.isActive);

      return activePet?.id || petsList[0].id;
    });
  }, [petsList]);

  const selectedPet = useMemo(
    () => petsList.find((pet) => pet.id === selectedPetId) || null,
    [petsList, selectedPetId],
  );

  // ======================================
  // 8. FILTER HANDLERS
  // ======================================

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setSuccess("");
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setSuccess("");
  };

  const handleFromDateChange = (value) => {
    setFromDate(value);
    setCurrentPage(1);
    setSuccess("");
  };

  const handleToDateChange = (value) => {
    setToDate(value);
    setCurrentPage(1);
    setSuccess("");
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    setError("");
    setSuccess("");
  };

  const reloadBoardings = () => {
    setReloadKey((prev) => prev + 1);
  };

  // ======================================
  // 9. XEM CHI TIẾT
  // ======================================

  const handleSelectPet = (pet) => {
    setSelectedPetId(pet.id);
  };

  const handleViewDetail = (pet) => {
    setSelectedPetId(pet.id);
    setSelectedDetailPet(pet);
  };

  // ======================================
  // 10. CHECK-IN
  // ======================================

  const handleCheckIn = async (pet) => {
    if (!pet || saving) return;

    if (pet.statusCode !== "CONFIRMED") {
      setError("Chỉ có thể Check-in đơn lưu trú đã xác nhận.");
      return;
    }

    const confirmed = window.confirm(
      `Xác nhận Check-in thú cưng ${pet.name} (${pet.id})?`,
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await boardingApi.checkIn(
        pet.bookingId,
        "Business Owner đã tiếp nhận thú cưng",
      );

      setSuccess(`Check-in thú cưng ${pet.name} thành công.`);

      setSelectedDetailPet(null);
      reloadBoardings();
    } catch (err) {
      setError(err.message || "Không thể Check-in thú cưng.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // 11. MỞ MODAL CHECK-OUT
  // ======================================

  const handleCheckout = (pet) => {
    const targetPet = pet || selectedPet;

    if (!targetPet) return;

    if (targetPet.statusCode !== "IN_PROGRESS") {
      setError("Chỉ có thể Check-out thú cưng đang lưu trú.");
      return;
    }

    setCheckoutModalPet(targetPet);
    setSelectedDetailPet(null);
  };

  // ======================================
  // 12. XÁC NHẬN CHECK-OUT
  // ======================================

  const handleConfirmCheckout = async (petToCheckout, handoverData = {}) => {
    const targetPet = petToCheckout || checkoutModalPet;

    if (!targetPet) {
      throw new Error("Không tìm thấy đơn lưu trú cần Check-out.");
    }

    if (saving) {
      throw new Error("Hệ thống đang xử lý một thao tác khác.");
    }

    if (targetPet.statusCode !== "IN_PROGRESS") {
      throw new Error("Chỉ có thể Check-out thú cưng đang lưu trú.");
    }

    const bookingId = targetPet.bookingId;

    if (!bookingId) {
      throw new Error("Không tìm thấy Booking ID.");
    }

    const { returnItems = false, healthStatus = "", notes = "" } = handoverData;

    if (!returnItems) {
      throw new Error("Vui lòng xác nhận bàn giao đầy đủ vật dụng cá nhân.");
    }

    if (!String(healthStatus).trim()) {
      throw new Error("Vui lòng nhập tình trạng sức khỏe khi bàn giao.");
    }

    // Backend hiện nhận { note }.
    // Ghép biên bản thành ghi chú lịch sử trạng thái.
    const checkoutNote = [
      "Business Owner đã bàn giao thú cưng cho chủ nuôi.",
      "Vật dụng cá nhân: Đã bàn giao đầy đủ.",
      `Tình trạng sức khỏe: ${String(healthStatus).trim()}`,
      `Ghi chú khi bàn giao: ${String(notes).trim() || "Không có"}`,
    ].join("\n");

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await boardingApi.checkOut(bookingId, checkoutNote);

      if (response?.success === false) {
        throw new Error(response.message || "Check-out thất bại.");
      }

      // Chỉ đóng sau khi Backend thành công
      setCheckoutModalPet(null);
      setSelectedDetailPet(null);

      setSuccess(`Check-out thú cưng ${targetPet.name} thành công.`);

      reloadBoardings();

      return response;
    } catch (err) {
      // Đưa lỗi về CheckoutModal để hiển thị.
      // KHÔNG đóng modal khi Check-out thất bại.
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // 13. MỞ MODAL THÊM NHẬT KÝ
  // ======================================

  const handleAddDiary = (pet) => {
    const targetPet = pet || selectedPet;

    if (!targetPet) return;

    if (targetPet.statusCode !== "IN_PROGRESS") {
      setError("Chỉ có thể thêm nhật ký khi thú cưng đang lưu trú.");
      return;
    }

    setError("");
    setSuccess("");

    setDiaryModalPet(targetPet);
    setSelectedDetailPet(null);
  };

  // ======================================
  // 14. LƯU NHẬT KÝ THẬT VÀO DATABASE
  // ======================================

  const handleSaveDiary = async (diaryData) => {
    if (!diaryModalPet) {
      throw new Error("Không tìm thấy thú cưng cần thêm nhật ký.");
    }

    if (diaryModalPet.statusCode !== "IN_PROGRESS") {
      throw new Error("Chỉ có thể thêm nhật ký khi thú cưng đang lưu trú.");
    }

    const bookingId = diaryModalPet.bookingId;

    if (!bookingId) {
      throw new Error("Không tìm thấy Booking ID.");
    }

    try {
      // API đã test thành công trên Postman
      const response = await petDiaryApi.createDiary(bookingId, diaryData);

      if (response?.success === false) {
        throw new Error(response.message || "Không thể lưu nhật ký chăm sóc.");
      }

      // Chỉ đóng modal khi API thành công
      setDiaryModalPet(null);

      setError("");

      setSuccess(
        `Đã lưu nhật ký chăm sóc cho ${diaryModalPet.name} vào hệ thống.`,
      );

      // Cập nhật danh sách Booking nếu cần
      reloadBoardings();

      return response;
    } catch (err) {
      // Giữ modal mở.
      // AddDiaryModal sẽ hiển thị lỗi.
      throw err;
    }
  };

  // ======================================
  // 15. PHÂN TRANG
  // ======================================

  const totalPages = pagination.totalPages || 0;

  useEffect(() => {
    if (
      !loading &&
      !invalidDateRange &&
      currentPage > 1 &&
      currentPage > totalPages
    ) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [loading, invalidDateRange, currentPage, totalPages]);

  // ======================================
  // 16. GIAO DIỆN
  // ======================================

  return (
    <main className="w-full min-w-0 max-w-none space-y-5 px-5 py-6 xl:px-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý lưu trú</h1>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi thú cưng đang lưu trú và quản lý hoạt động chăm sóc tại cơ
            sở.
          </p>
        </div>
      </div>

      {/* THÔNG BÁO LỖI */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* THÔNG BÁO THÀNH CÔNG */}
      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

          <span>{success}</span>
        </div>
      )}

      {/* BỘ LỌC */}
      <section className="w-full min-w-0">
        <BoardingFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          fromDate={fromDate}
          setFromDate={handleFromDateChange}
          toDate={toDate}
          setToDate={handleToDateChange}
          onReset={handleReset}
        />
      </section>

      {/* CHECK-IN */}
      {selectedPet?.statusCode === "CONFIRMED" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <div>
            <p className="text-xs font-bold text-indigo-800">
              Thú cưng chờ Check-in
            </p>

            <p className="mt-1 text-xs text-indigo-600">
              {selectedPet.name}
              {" — "}
              {selectedPet.id}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleCheckIn(selectedPet)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn size={15} />
            Xác nhận Check-in
          </button>
        </div>
      )}

      {/* BẢNG + PHÂN TRANG BACKEND */}
      <section className="w-full min-w-0">
        <BoardingTable
          pets={petsList}
          selectedPetId={selectedPetId}
          onSelectPet={handleSelectPet}
          onViewDetail={handleViewDetail}
          pagination={pagination}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </section>

      {/* CHI TIẾT BOARDING */}
      {selectedDetailPet && (
        <BoardingDetailModal
          pet={selectedDetailPet}
          onClose={() => setSelectedDetailPet(null)}
          onCheckIn={handleCheckIn}
          onAddDiary={handleAddDiary}
          onCheckout={handleCheckout}
        />
      )}

      {/* THÊM NHẬT KÝ */}
      {diaryModalPet && (
        <AddDiaryModal
          pet={diaryModalPet}
          onClose={() => setDiaryModalPet(null)}
          onSave={handleSaveDiary}
        />
      )}

      {/* CHECK-OUT */}
      {checkoutModalPet && (
        <CheckoutModal
          pet={checkoutModalPet}
          onClose={() => {
            if (!saving) {
              setCheckoutModalPet(null);
            }
          }}
          onConfirm={handleConfirmCheckout}
        />
      )}
    </main>
  );
}
