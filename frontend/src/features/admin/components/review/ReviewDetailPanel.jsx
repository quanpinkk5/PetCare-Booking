import {
  ChevronRight,
  MapPin,
  EyeOff,
  RotateCcw,
  FileText,
  X,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  VISIBLE: {
    label: "HIỂN THỊ",
    className: "bg-emerald-100 text-emerald-700",
  },
  HIDDEN: {
    label: "ĐÃ ẨN",
    className: "bg-slate-100 text-slate-600",
  },
};

const SPECIES_LABELS = {
  DOG: "Chó",
  CAT: "Mèo",
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

const getPetType = (pet) => {
  if (!pet) return "—";

  const species = SPECIES_LABELS[pet.species] || pet.species || "";

  return [species, pet.breed].filter(Boolean).join(" - ") || "—";
};

export default function ReviewDetailPanel({
  review,
  isOpen,
  isLoading = false,
  isUpdating = false,
  error = "",
  onClose,
  onUpdateStatus,
}) {
  if (!isOpen || !review) return null;

  const status = STATUS_CONFIG[review.status] || {
    label: review.status || "—",
    className: "bg-slate-100 text-slate-600",
  };

  const customerName = review.customer?.fullName || "Không có thông tin";

  const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

  const canUpdate = !isLoading && !isUpdating && !error;

  const hasReply = Boolean(review.businessReply?.content?.trim());

  const images = Array.isArray(review.images) ? review.images : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết đánh giá"
    >
      {/* BACKDROP */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10 my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-base">
              Chi tiết đánh giá
            </h3>

            <p
              className="text-xs text-slate-400 font-medium mt-0.5 truncate"
              title={review._id}
            >
              ID: {review._id}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${status.className}`}
            >
              {status.label}
            </span>

            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors disabled:opacity-50"
              title="Đóng"
              aria-label="Đóng chi tiết đánh giá"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isLoading && (
            <p className="text-xs text-slate-500">
              Đang tải thông tin đánh giá...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
            >
              {error}
            </div>
          )}

          {/* CUSTOMER INFORMATION */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Thông tin khách hàng
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {review.customer?.avatar ? (
                  <img
                    src={review.customer.avatar}
                    alt={customerName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <UserRound className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-snug truncate">
                    {customerName}
                  </p>

                  <p className="text-[11px] text-slate-400 truncate">
                    {review.customer?.email || "—"}
                  </p>
                </div>
              </div>

              {review.customer?._id ? (
                <Link
                  to={`/admin/users/${review.customer._id}`}
                  className="flex items-center gap-2 text-slate-500 shrink-0 hover:text-emerald-600 transition-colors"
                  title="Xem hồ sơ khách hàng"
                >
                  <span className="text-xs font-medium">
                    {review.customer.phone || "—"}
                  </span>

                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-xs text-slate-400">
                  {review.customer?.phone || "—"}
                </span>
              )}
            </div>
          </div>

          {/* FACILITY INFORMATION */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Thông tin cơ sở
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {review.branch?.name || "—"}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {review.branch?.address || "—"}
                  </p>

                  {review.business?.name && (
                    <p className="text-[11px] text-emerald-600 mt-1">
                      {review.business.name}
                    </p>
                  )}
                </div>
              </div>

              {review.business?._id && (
                <Link
                  to={`/admin/facilities/${review.business._id}`}
                  className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  title="Xem chi tiết thương hiệu"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* SERVICE & RATING */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-400 font-medium shrink-0">
                Dịch vụ
              </span>

              <span className="font-semibold text-slate-800 text-right">
                {review.service?.name || "—"} ({getPetType(review.pet)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Số sao</span>

              <span className="text-amber-400 text-sm tracking-wide">
                {"★".repeat(rating)}

                <span className="text-slate-200">{"★".repeat(5 - rating)}</span>
              </span>
            </div>
          </div>

          {/* REVIEW CONTENT */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              Nội dung đánh giá
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-wrap break-words">
              {review.comment
                ? `"${review.comment}"`
                : "Không có nội dung đánh giá."}
            </div>
          </div>

          {/* REVIEW IMAGES */}
          {images.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Hình ảnh đính kèm
              </p>

              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 3).map((imageUrl, index) => (
                  <a
                    key={`${imageUrl}-${index}`}
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Xem ảnh ${index + 1}`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Ảnh đánh giá ${index + 1}`}
                      className="w-full h-16 rounded-lg object-cover border border-slate-200"
                    />
                  </a>
                ))}

                {images.length >= 4 && (
                  <a
                    href={images[3]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full h-16 rounded-lg overflow-hidden border border-slate-200"
                  >
                    <img
                      src={images[3]}
                      alt="Ảnh đánh giá 4"
                      className="w-full h-full object-cover"
                    />

                    {images.length > 4 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                        +{images.length - 4}
                      </div>
                    )}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* BUSINESS REPLY */}
          {hasReply && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">
                Phản hồi từ cơ sở
              </p>

              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-slate-700">
                <p className="leading-relaxed whitespace-pre-wrap break-words">
                  {review.businessReply.content}
                </p>

                <p className="text-[11px] text-slate-500 mt-2">
                  {review.businessReply.repliedBy?.fullName ||
                    "Cơ sở kinh doanh"}{" "}
                  • {formatDateTime(review.businessReply.repliedAt)}
                </p>
              </div>
            </div>
          )}

          {/* CREATED INFO */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4 text-[11px]">
            <div>
              <p className="text-slate-400">Ngày tạo</p>

              <p className="font-semibold text-slate-700 mt-0.5">
                {formatDateTime(review.createdAt)}
              </p>
            </div>

            <div className="text-right min-w-0">
              <p className="text-slate-400">ID đánh giá</p>

              <p
                className="font-semibold text-slate-700 mt-0.5 break-all"
                title={review._id}
              >
                {review._id}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-2 space-y-2.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hành động
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onUpdateStatus?.("HIDDEN")}
                disabled={!canUpdate || review.status === "HIDDEN"}
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>{isUpdating ? "Đang xử lý..." : "Ẩn đánh giá"}</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus?.("VISIBLE")}
                disabled={!canUpdate || review.status === "VISIBLE"}
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>{isUpdating ? "Đang xử lý..." : "Khôi phục"}</span>
              </button>
            </div>

            {review.booking?._id ? (
              <Link
                to={`/admin/bookings/${review.booking._id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-emerald-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Xem chi tiết booking</span>
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 text-white rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                <span>Xem chi tiết booking</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
