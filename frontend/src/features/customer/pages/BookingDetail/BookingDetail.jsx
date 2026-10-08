import React from "react";

import HeroBanner from "../../components/BookingDetail/HeroBanner";
import BookingOverview from "../../components/BookingDetail/BookingOverview";
import BookingTimeline from "../../components/BookingDetail/BookingTimeline";
import BookingDetails from "../../components/BookingDetail/BookingDetails";
import CareJournal from "../../components/BookingDetail/CareJournal";
import BookingSidebar from "../../components/BookingDetail/BookingSidebar";

const BOOKING_DATA = {
  id: "BK20260825001",

  status: "Đang chờ xác nhận",

  statusStep: 2,

  date: "25/08/2026 (T3)",

  time: "14:00 - 16:00",

  totalPrice: "300.000đ",

  pet: {
    name: "Milo",
    gender: "♂",
    breed: "Golden Retriever",
    weight: "28kg",
    personality: "Thân thiện",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsM5tveS1PshRqyTmh4FGwNs79bGmbM5Sg4bjj0HRbRjRj6BEYL157-uy9pap8V6Pwuhwfli9rHUOPPZ3TxX2Y8FslKlWLDJr6n66NARGcg7XbcwijCXbBBjj0peLELthjK7n_cX61YGcly-cyfITGYWtHKb4roU20DnIoN1N-LXFX5_36U5Dhj9uPoDnpnfK1mnsucnwlb2VdNVjcZP0fP7Vdq0VcCUwrTsoOANU",
  },

  service: {
    name: "Grooming cắt tỉa",
    desc: "Cắt tỉa lông, tắm, vệ sinh tai",
    duration: "120 phút",
  },

  facility: {
    name: "Happy Pet - Cầu Giấy",
    address: "123 Trần Thái Tông, Cầu Giấy, Hà Nội",
    phone: "0988 123 456",
  },

  note: "Milo hơi sợ máy sấy. Không sử dụng nước hoa quá mạnh.",
};

const BookingDetail = () => {
  return (
    <main className="max-w-[1380px] w-full mx-auto px-6 py-5">
      <HeroBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <BookingOverview booking={BOOKING_DATA} />

          <BookingTimeline />

          <BookingDetails booking={BOOKING_DATA} />

          <CareJournal />
        </div>

        {/* Sidebar */}
        <BookingSidebar />
      </div>
    </main>
  );
};

export default BookingDetail;