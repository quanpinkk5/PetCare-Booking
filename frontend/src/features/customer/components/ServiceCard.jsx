import React from "react";
import { MapPin } from "lucide-react";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">

      {/* Main */}
      <div className="flex gap-3">

        {/* Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={service.img}
            alt={service.title}
            className="w-full h-full object-cover"
          />

          {service.isPopular && (
            <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              Phổ biến
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
            {service.tag}
          </span>

          <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-600 truncate">
            {service.title}
          </h3>

          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
            {service.desc}
          </p>

        </div>
      </div>

      {/* Price */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-slate-900 text-sm">
            {service.price}
          </span>

          <span className="text-slate-400 text-[11px] ml-1">
            ⏱ {service.time}
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">

        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 font-semibold">
            ★ {service.rating}
          </span>

          <span className="text-slate-400">
            ({service.reviews})
          </span>

          <span className="text-slate-300">
            •
          </span>

          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {service.locations} cơ sở
          </span>
        </div>

        <a
          href="#"
          className="text-emerald-600 font-semibold hover:underline text-[11px] border border-emerald-200 px-2 py-0.5 rounded-lg"
        >
          Xem chi tiết
        </a>

      </div>
    </div>
  );
};

export default ServiceCard;