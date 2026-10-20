import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";

import HeroBanner from "../../components/BookingDetail/HeroBanner";
import BookingTimeline from "../../components/BookingDetail/BookingTimeline";
import BookingDetails from "../../components/BookingDetail/BookingDetails";
import CareJournal from "../../components/BookingDetail/CareJournal";
import BookingOverview from "../../components/BookingDetail/BookingOverview";
import BookingSidebar from "../../components/BookingDetail/BookingSidebar";
import { bookingApi } from "../../services/bookingApi.js";
import { bookingDetailData } from "../../services/bookingData.js";
import { useAuth } from "../../../../context/AuthContext";

const BookingDetail = () => {
  const { id } = useParams();
  const { user, isAuthLoading } = useAuth();
  const [result, setResult] = useState({ id: null, data: null, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (isAuthLoading || !user || user.role !== 'CUSTOMER') return;
    let cancelled = false;
    bookingApi.detail(id).then((response) => {
      if (!cancelled) setResult({ id, data: response.data, error: '' });
    }).catch((error) => {
      if (!cancelled) setResult({ id, data: null, error: error.message || 'Không thể tải chi tiết lịch đặt.' });
    });
    return () => { cancelled = true; };
  }, [id, user, isAuthLoading, attempt]);
  const booking = result.id === id && result.data ? bookingDetailData(result.data) : null;
  const cancelBooking = async (reason) => {
    const response = await bookingApi.cancel(id, reason);
    setResult((current) => ({ ...current, data: { ...current.data, status: response.data.status, paymentStatus: response.data.paymentStatus, statusHistory: response.data.statusHistory } }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!isAuthLoading && !user) return <Navigate to="/login" replace />;
  if (user && user.role !== 'CUSTOMER') return <Navigate to="/" replace />;
  if (!booking) return <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6">
    <p role={result.error ? 'alert' : 'status'} className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm">{result.error || 'Đang tải chi tiết lịch đặt...'}</p>
    {result.error && <button type="button" onClick={() => { setResult({ id: null, data: null, error: '' }); setAttempt((value) => value + 1); }} className="mt-3 text-sm text-teal-700">Thử lại</button>}
    <Link to="/my-bookings" className="ml-4 text-sm text-teal-700">Lịch đặt của tôi</Link>
  </main>;

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
          <BookingOverview booking={booking} onCancel={cancelBooking} />
          <BookingSidebar />
        </div>
      </div>
    </main>
  );
};

export default BookingDetail;
