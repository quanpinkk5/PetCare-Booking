import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import HeroBanner from "../../components/BookingDetail/HeroBanner";
import BookingTimeline from "../../components/BookingDetail/BookingTimeline";
import BookingDetails from "../../components/BookingDetail/BookingDetails";
import CareJournal from "../../components/BookingDetail/CareJournal";
import BookingOverview from "../../components/BookingDetail/BookingOverview";
import BookingSidebar from "../../components/BookingDetail/BookingSidebar";
import { getBookingById } from "../../services/mockBookings";

const BookingDetail = () => {
  const { id } = useParams();
  const booking = getBookingById(id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  return (
    <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6">
      {/* 1. Header Banner */}
      <HeroBanner booking={booking} />

      {/* 2. Timeline tiến trình xử lý toàn màn hình - Trực quan & nổi bật */}
      <BookingTimeline
        statusStep={booking.statusStep}
        statusType={booking.statusType}
      />

      {/* 3. Lưới nội dung 2 cột cân xứng hoàn hảo (8 cột Trái / 4 cột Phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột Trái (8 cột) - Thông tin thú cưng, dịch vụ, cơ sở & nhật ký chăm sóc */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <BookingDetails booking={booking} />
          <CareJournal booking={booking} />
        </div>

        {/* Cột Phải (4 cột) - Thanh toán, Cụm nút hành động 4 giai đoạn, Chính sách & Hỗ trợ (Sticky) */}
        <div className="lg:col-span-4 sticky top-6 self-start flex flex-col gap-5">
          <BookingOverview booking={booking} />
          <BookingSidebar />
        </div>
      </div>
    </main>
  );
};

export default BookingDetail;