import { Link } from 'react-router-dom';
import {
  Star,
  Quote,
  CheckCircle2,
  User,
} from "lucide-react";

const ReviewCard = ({
  name,
  review,
  img,
  rating = 0,
  date = "",
  service = "Dịch vụ chăm sóc",
  businessId,
  businessName,
  verified = false,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group">
      <div>
        {/* Header with avatar, user info and rating */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative">
            {img ? <img src={img} alt={name} loading="lazy" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-xs" />
              : <div className="w-12 h-12 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-600 flex items-center justify-center"><User size={24} /></div>}
            {verified && <span title="Đánh giá từ lịch đặt đã hoàn thành" aria-label="Đánh giá từ lịch đặt đã hoàn thành" className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
              <CheckCircle2 size={12} />
            </span>}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 truncate">
                {name}
              </h4>
              <Quote
                size={22}
                className="text-emerald-100 group-hover:text-emerald-200 transition-colors shrink-0 pointer-events-none"
              />
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <div className="text-amber-400 flex gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    fill={index < rating ? "currentColor" : "none"}
                    className={index < rating ? "text-amber-400" : "text-slate-200"}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Review body */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 italic">
          "{review}"
        </p>
      </div>

      {businessId && <Link to={'/businesses/' + encodeURIComponent(businessId) + '#danh-gia'} className="mt-3 text-xs font-semibold text-emerald-700 hover:underline">{businessName}</Link>}
      {/* Footer tag */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md font-medium">
          🐾 {service}
        </span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default ReviewCard;