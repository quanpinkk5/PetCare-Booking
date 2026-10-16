import { useState } from "react";
import { BOOKINGS as INITIAL_BOOKINGS } from "../../data/bookingData";
import BookingHeader from "../../components/bookings/BookingHeader";
import BookingStatCards from "../../components/bookings/BookingStatCards";
import BookingFilterBar from "../../components/bookings/BookingFilterBar";
import BookingTable from "../../components/bookings/BookingTable";
import TodayStatsWidget from "../../components/bookings/TodayStatsWidget";
import PendingAlertsWidget from "../../components/bookings/PendingAlertsWidget";
import BookingDetailModal from "../../components/bookings/BookingDetailModal";

const DEFAULT_FILTERS = {
  keyword: "",
  status: "Tất cả trạng thái",
  branch: "Tất cả chi nhánh",
  service: "Tất cả dịch vụ",
};

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState(INITIAL_BOOKINGS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Xử lý duyệt đặt lịch
  const handleApprove = (id) => {
    setBookingsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Đã xác nhận",
              statusClass: "bg-indigo-100 text-indigo-800",
              isPendingAction: false,
              bgHighlight: "",
            }
          : item
      )
    );
  };

  // Xử lý từ chối đặt lịch
  const handleReject = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn từ chối lịch hẹn ${id}?`)) {
      setBookingsList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "Đã hủy",
                statusClass: "bg-rose-100 text-rose-800",
                isPendingAction: false,
                bgHighlight: "",
              }
            : item
        )
      );
    }
  };

  // Lọc danh sách booking
  const filteredBookings = bookingsList.filter((booking) => {
    const keyword = filters.keyword.trim().toLowerCase();

    const matchesKeyword =
      !keyword ||
      [
        booking.id,
        booking.customer,
        booking.phone,
        booking.pet,
        booking.service,
      ].some((value) => value.toLowerCase().includes(keyword));

    const matchesStatus =
      filters.status === "Tất cả trạng thái" ||
      booking.status === filters.status;

    const matchesBranch =
      filters.branch === "Tất cả chi nhánh" ||
      booking.branchSub === filters.branch;

    const matchesService =
      filters.service === "Tất cả dịch vụ" ||
      booking.service === filters.service;

    return (
      matchesKeyword &&
      matchesStatus &&
      matchesBranch &&
      matchesService
    );
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header trang đặt lịch */}
      <BookingHeader
        onNewBooking={() =>
          window.alert("Chức năng tạo lịch hẹn mới cho khách hàng đang được kết nối!")
        }
      />

      {/* Thẻ thống kê & Bộ lọc trạng thái nhanh */}
      <BookingStatCards
        activeStatus={filters.status}
        onSelectStatus={(status) =>
          setFilters((prev) => ({ ...prev, status }))
        }
      />

      {/* Khu vực nội dung chính & Sidebar */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* Cột trái: Bộ lọc & Bảng danh sách đặt lịch */}
        <div className="space-y-4 xl:col-span-9">
          <BookingFilterBar
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />

          <BookingTable
            bookings={filteredBookings}
            onViewBooking={setSelectedBooking}
            onApproveBooking={handleApprove}
            onRejectBooking={handleReject}
          />
        </div>

        {/* Cột phải: Widget bổ trợ */}
        <div className="space-y-4 xl:col-span-3">
          <TodayStatsWidget />
          <PendingAlertsWidget
            onSelectAlert={(alert) => {
              const matched = bookingsList.find((b) => b.customer === alert.customer);
              if (matched) setSelectedBooking(matched);
            }}
          />
        </div>
      </div>

      {/* Modal xem chi tiết lịch hẹn */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={(id, newStatus) => {
            if (newStatus === "Đã xác nhận") handleApprove(id);
            if (newStatus === "Từ chối") handleReject(id);
          }}
        />
      )}
    </div>
  );
}
