import {
  ChevronRight,
  MapPin,
  EyeOff,
  RotateCcw,
  FileText,
  X,
} from 'lucide-react';

export default function ReviewDetailPanel({ review, isOpen, onClose }) {
  if (!isOpen || !review) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Modal Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Chi tiết đánh giá
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Mã: {review.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {review.status === 'HIỂN THỊ' && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                HIỂN THỊ
              </span>
            )}

            {review.status === 'BỊ BÁO CÁO' && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-600">
                BỊ BÁO CÁO
              </span>
            )}

            {review.status === 'ĐÃ ẨN' && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                ĐÃ ẨN
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Customer Information */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Thông tin khách hàng
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 truncate">
                <img
                  src={review.customer.avatar}
                  alt={review.customer.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                />

                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {review.customer.name}
                  </p>

                  <p className="text-[11px] text-slate-400 truncate">
                    {review.customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                <span className="text-xs font-medium text-slate-600">
                  {review.customer.phone}
                </span>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Facility Information */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Thông tin cơ sở
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {review.facility.name}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {review.facility.location}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Service & Rating */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-slate-400 font-medium">
                Dịch vụ
              </span>

              <span className="font-semibold text-slate-800 text-right">
                {review.service} ({review.petType})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">
                Số sao
              </span>

              <span className="text-amber-400 text-sm tracking-wide">
                {'★'.repeat(review.rating)}
                <span className="text-slate-200">
                  {'★'.repeat(5 - review.rating)}
                </span>
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              Nội dung đánh giá
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs leading-relaxed text-slate-700 font-medium">
              "{review.content}"
            </div>
          </div>

          {/* Media */}
          {review.media && review.media.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Hình ảnh đính kèm
              </p>

              <div className="grid grid-cols-4 gap-2">
                {review.media.slice(0, 3).map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Ảnh đính kèm ${index + 1}`}
                    className="w-full h-16 rounded-lg object-cover border border-slate-200"
                  />
                ))}

                {review.media.length >= 4 && (
                  <div className="relative w-full h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={review.media[3]}
                      alt="Ảnh đính kèm 4"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                      +{review.extraMediaCount}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Created Information */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div>
              <p className="text-slate-400">Ngày tạo</p>

              <p className="font-semibold text-slate-700 mt-0.5">
                {review.createdDate} {review.createdTime}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-400">ID đánh giá</p>

              <p className="font-semibold text-slate-700 mt-0.5">
                {review.id}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hành động
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>Ẩn đánh giá</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Khôi phục</span>
              </button>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-emerald-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Xem chi tiết booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}