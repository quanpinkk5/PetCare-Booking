import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Eye,
  Gift,
  Coins,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";

const PendingReviewCard = ({ pendingItem, onWriteReview }) => {
  return (
    <article className="bg-white rounded-2xl border border-amber-200/90 hover:border-amber-400 shadow-sm transition-all p-5 sm:p-6 space-y-4 relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-teal-400" />

      {/* 1. Header: Facility & Booking Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={pendingItem.businessAvatar}
            alt={pendingItem.businessName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs shrink-0"
          />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {pendingItem.businessName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span>{pendingItem.businessAddress}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Hoàn thành dịch vụ</span>
          </span>

          <Link
            to={`/my-bookings/${pendingItem.bookingId}`}
            className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full transition-colors"
          >
            Mã: {pendingItem.bookingId}
          </Link>
        </div>
      </div>

      {/* 2. Pet & Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left pet & service info (8 cols) */}
        <div className="md:col-span-8 flex items-start gap-3.5">
          <img
            src={pendingItem.petImg}
            alt={pendingItem.petName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-100 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                {pendingItem.petName}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                ({pendingItem.petBreed})
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-teal-700">
              {pendingItem.serviceName}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              {pendingItem.serviceDesc}
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                Hoàn thành: {pendingItem.completedDate}
              </span>
              <span>•</span>
              <span className="font-bold text-slate-700">
                Giá: {pendingItem.servicePrice}
              </span>
            </div>
          </div>
        </div>

        {/* Right bonus reward box (4 cols) */}
        <div className="md:col-span-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold">
            <Coins size={15} className="text-amber-500 fill-amber-400" />
            <span>Phần thưởng đánh giá:</span>
          </div>
          <p className="text-[11px] text-amber-900 leading-snug">
            +{pendingItem.rewardPoints || 50} PetPoint tích lũy & {pendingItem.voucherPromo || "Voucher giảm 10%"}
          </p>
          <div className="text-[10px] text-amber-700/80 font-medium pt-0.5">
            ⏳ Còn {pendingItem.deadlineDays || 30} ngày để nhận thưởng
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500 italic">
          Chia sẻ trải nghiệm giúp người nuôi thú cưng khác chọn dịch vụ tốt hơn!
        </span>

        <div className="flex items-center gap-2">
          <Link
            to={`/my-bookings/${pendingItem.bookingId}`}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <Eye size={13} className="text-slate-500" />
            <span>Xem lịch đặt</span>
          </Link>

          <button
            type="button"
            onClick={() => onWriteReview(pendingItem)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-500/20 hover:shadow-md transition-all cursor-pointer"
          >
            <Star size={14} className="fill-white" />
            <span>Viết đánh giá ngay</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PendingReviewCard;
