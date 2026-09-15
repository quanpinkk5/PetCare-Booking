import {
  Star,
  Heart,
  MapPin,
} from "lucide-react";

const BusinessCard = ({
  name,
  location,
  price,
  rating,
  tags,
  img,
}) => {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Image */}
      <div className="relative h-36 w-full">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Rating */}
        <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Star
            size={12}
            className="text-amber-300"
            fill="currentColor"
          />

          {rating}
        </div>

        {/* Favorite */}
        <button
          aria-label="Yêu thích"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <Heart size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-bold text-slate-800 text-sm">
          {name}
        </h3>

        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <MapPin
            size={12}
            className="text-emerald-600"
          />

          {location}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">
              Từ
            </span>

            <span className="text-sm font-bold text-slate-800 ml-1">
              {price}
            </span>
          </div>

          <button className="text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
            Xem chi tiết
          </button>
        </div>
      </div>
    </article>
  );
};

export default BusinessCard;