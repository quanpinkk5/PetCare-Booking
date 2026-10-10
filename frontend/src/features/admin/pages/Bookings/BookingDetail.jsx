import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import BookingOverviewCard from '../../components/booking/BookingOverviewCard';
import BookingStepperSection from '../../components/booking/BookingStepperSection';
import BookingInfoCard from '../../components/booking/BookingInfoCard';
import PaymentInfoCard from '../../components/booking/PaymentInfoCard';
import CustomerInfoCard from '../../components/booking/CustomerInfoCard';
import PetInfoCard from '../../components/booking/PetInfoCard';
import FacilityInfoCard from '../../components/booking/FacilityInfoCard';

export default function BookingDetail() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const bookingCode = id || 'BIZ250522-0987';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(bookingCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Không thể sao chép mã booking:', error);
    }
  };

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
        {/* Booking Overview */}
        <BookingOverviewCard
          bookingCode={bookingCode}
          onCopy={handleCopyCode}
          copied={copied}
        />

        {/* Booking Stepper */}
        <BookingStepperSection />

        {/* Booking Details */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <BookingInfoCard />
            <PaymentInfoCard />
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <CustomerInfoCard />
            <PetInfoCard />
            <FacilityInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}