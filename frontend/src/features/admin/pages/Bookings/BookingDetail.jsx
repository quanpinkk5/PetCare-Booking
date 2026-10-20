import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import BookingOverviewCard from "../../components/booking/BookingOverviewCard";
import BookingStepperSection from "../../components/booking/BookingStepperSection";
import BookingInfoCard from "../../components/booking/BookingInfoCard";
import PaymentInfoCard from "../../components/booking/PaymentInfoCard";
import CustomerInfoCard from "../../components/booking/CustomerInfoCard";
import PetInfoCard from "../../components/booking/PetInfoCard";
import FacilityInfoCard from "../../components/booking/FacilityInfoCard";

import { adminBookingApi } from "../../services/adminBookingApi";

export default function BookingDetail() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const copyTimerRef = useRef(null);

  // ==============================
  // 1. GỌI API CHI TIẾT BOOKING
  // ==============================
  useEffect(() => {
    let cancelled = false;

    const loadBooking = async () => {
      setLoading(true);
      setError("");
      setBooking(null);

      try {
        const response = await adminBookingApi.getBookingDetail(id);

        if (cancelled) return;

        if (response?.success === false || !response?.data?.booking) {
          throw new Error(
            response?.message || "Không thể tải chi tiết booking.",
          );
        }

        setBooking(response.data.booking);
      } catch (err) {
        if (cancelled) return;

        setError(err.message || "Không thể tải chi tiết booking.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadBooking();
    } else {
      setLoading(false);
      setError("Không tìm thấy ID booking.");
    }

    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  // ==============================
  // 2. SAO CHÉP MÃ BOOKING
  // ==============================
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyCode = async () => {
    if (!booking?.bookingCode) return;

    try {
      await navigator.clipboard.writeText(booking.bookingCode);

      setCopied(true);

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Không thể sao chép mã booking:", err);
    }
  };

  // ==============================
  // 3. LOADING
  // ==============================
  if (loading) {
    return (
      <div className="p-8 space-y-6 flex-1">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách booking
        </Link>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-sm text-slate-500 text-center">
          Đang tải chi tiết booking...
        </div>
      </div>
    );
  }

  // ==============================
  // 4. ERROR
  // ==============================
  if (error || !booking) {
    return (
      <div className="p-8 space-y-6 flex-1">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách booking
        </Link>

        <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-4">
          <p role="alert" className="text-sm text-rose-600">
            {error || "Không tìm thấy booking."}
          </p>

          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // 5. RENDER CHI TIẾT
  // ==============================
  return (
    <div className="p-8 space-y-6 flex-1">
      {/* Back button */}
      <div>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách booking</span>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Booking Overview - API THẬT */}
        <BookingOverviewCard
          bookingCode={booking.bookingCode}
          bookingStatus={booking.status}
          paymentStatus={booking.paymentStatus}
          onCopy={handleCopyCode}
          copied={copied}
        />

        {/* Booking Stepper - API THẬT */}
        <BookingStepperSection
          status={booking.status}
          statusHistory={booking.statusHistory || []}
          createdAt={booking.createdAt}
        />

        {/* Booking Details */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <BookingInfoCard booking={booking} />
            <PaymentInfoCard booking={booking} />
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <CustomerInfoCard customer={booking.customer} />

            <PetInfoCard pet={booking.pet} />

            <FacilityInfoCard
              branch={booking.branch}
              business={booking.business}
              service={booking.service}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
