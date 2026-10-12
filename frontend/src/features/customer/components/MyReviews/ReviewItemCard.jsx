import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  Calendar,
  MapPin,
  ShieldCheck,
  ThumbsUp,
  Edit3,
  Trash2,
  RotateCcw,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Check,
  Scissors
} from "lucide-react";

const ReviewItemCard = ({
  review,
  onLikeToggle,
  onEdit,
  onDelete,
  onOpenLightbox
}) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <Star
            key={starIndex}
            size={16}
            className={`${
              starIndex <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200 fill-slate-100"
            }`}
          />
        ))}
      </div>
    );
  };

  const getSubRatingLabel = (key) => {
    switch (key) {
      case "cleanliness":
        return "Vệ sinh cơ sở";
      case "staff":
        return "Thái độ nhân viên";
      case "care":
        return "Chăm sóc bé";
      case "price":
        return "Giá dịch vụ";
      default:
        return key;
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-teal-200 hover:shadow-md transition-all p-5 sm:p-6 space-y-4">
      {/* 1. Header: Facility info & Booking Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={review.businessAvatar}
            alt={review.businessName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/businesses/${review.businessId}`}
                className="text-sm sm:text-base font-bold text-slate-900 hover:text-teal-600 transition-colors flex items-center gap-1 group"
              >
                <span>{review.businessName}</span>
                <ExternalLink size={13} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span className="truncate max-w-xs">{review.businessAddress}</span>
            </div>
          </div>
        </div>

        {/* Right tags */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Đã xác thực dịch vụ</span>
          </div>

          <Link
            to={`/my-bookings/${review.bookingId}`}
            className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full transition-colors"
            title="Xem chi tiết đơn đặt"
          >
            Mã: {review.bookingId}
          </Link>
        </div>
      </div>

      {/* 2. Service & Pet Snapshot Mini Box */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <img
            src={review.petImg}
            alt={review.petName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-2xs shrink-0"
          />
          <div>
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>{review.petName}</span>
              <span className={review.petGender === "♂" ? "text-blue-500 font-semibold" : "text-pink-500 font-semibold"}>
                {review.petGender}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">({review.petBreed})</span>
            </div>
            <div className="text-slate-600 flex items-center gap-1 font-medium mt-0.5">
              <Scissors size={12} className="text-teal-600" />
              <span>{review.serviceName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500 text-[11px] shrink-0 sm:border-l sm:border-slate-200 sm:pl-4">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-slate-400" />
            <span>Ngày làm: <strong>{review.serviceDate}</strong></span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-teal-700">{review.servicePrice}</span>
        </div>
      </div>

      {/* 3. Rating score & Sub-scores */}
      <div className="space-y-2 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {renderStars(review.rating)}
            <span className="text-sm font-extrabold text-slate-900">
              {review.rating}.0 / 5.0
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
              {review.ratingLabel || "Tuyệt vời"}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Đăng lúc: {review.createdAt}</span>
            {review.updatedAt && (
              <span className="text-teal-600 font-medium">(Đã chỉnh sửa)</span>
            )}
          </div>
        </div>

        {/* Sub-ratings breakdown */}
        {review.subRatings && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            {Object.entries(review.subRatings).map(([key, val]) => (
              <div
                key={key}
                className="bg-slate-50/60 border border-slate-100 rounded-lg px-2.5 py-1.5 flex items-center justify-between"
              >
                <span className="text-slate-500 font-medium">{getSubRatingLabel(key)}</span>
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {val}.0
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sentiment tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {review.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50/70 text-teal-700 border border-teal-100 text-[11px] font-medium"
              >
                <Sparkles size={11} className="text-teal-600" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Review Comment text */}
      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-1">
        {review.comment}
      </p>

      {/* 5. Photos Gallery */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {review.images.map((imgUrl, imgIdx) => (
            <button
              type="button"
              key={imgIdx}
              onClick={() => onOpenLightbox(review.images, imgIdx)}
              className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-pointer aspect-square w-20 sm:w-24 shrink-0 hover:border-teal-400 transition-all shadow-2xs"
            >
              <img
                src={imgUrl}
                alt={`Ảnh đánh giá ${imgIdx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                Phóng to
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 6. Business Reply Box */}
      {review.businessReply && (
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 space-y-1.5 mt-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
            <div className="flex items-center gap-1.5">
              <MessageCircle size={15} className="text-emerald-600" />
              <span>Phản hồi từ cơ sở: {review.businessReply.staffName}</span>
              {review.businessReply.staffRole && (
                <span className="text-[10px] text-emerald-700 font-normal bg-emerald-100/80 px-1.5 py-0.2 rounded">
                  {review.businessReply.staffRole}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-normal">
              {review.businessReply.repliedAt}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic pl-5">
            "{review.businessReply.content}"
          </p>
        </div>
      )}

      {/* 7. Footer: Actions & Engagement */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Like button */}
        <button
          type="button"
          onClick={() => onLikeToggle(review.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            review.isLiked
              ? "bg-teal-50 text-teal-700 border-teal-300 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ThumbsUp size={13} className={review.isLiked ? "fill-teal-600 text-teal-600" : "text-slate-400"} />
          <span>Hữu ích ({review.likesCount})</span>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(review)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 size={13} className="text-slate-500" />
            <span>Chỉnh sửa</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(review)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Xóa</span>
          </button>

          {/* Re-book */}
          <button
            type="button"
            onClick={() => navigate(`/booking?service=${encodeURIComponent(review.serviceName)}`)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ReviewItemCard;
