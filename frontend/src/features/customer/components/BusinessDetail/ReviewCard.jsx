import {
  Star,
  Quote,
} from "lucide-react";

const ReviewCard = ({
  name,
  review,
  img,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative">

      <div className="flex items-center gap-3">
        <img
          src={img}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <h4 className="text-xs font-bold text-slate-800">
            {name}
          </h4>

          <div className="text-amber-400 flex gap-0.5 mt-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={10}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-2.5 italic leading-relaxed">
        "{review}"
      </p>

      <Quote
        size={20}
        className="absolute top-4 right-4 text-emerald-100 pointer-events-none"
      />
    </div>
  );
};

export default ReviewCard;