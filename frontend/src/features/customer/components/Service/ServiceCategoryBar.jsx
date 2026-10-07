import React from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    id: 1,
    icon: "🛁",
    label: "Tắm & vệ sinh",
    bg: "bg-sky-50",
  },
  {
    id: 2,
    icon: "✂️",
    label: "Grooming",
    bg: "bg-amber-50",
  },
  {
    id: 3,
    icon: "💆",
    label: "Spa thư giãn",
    bg: "bg-rose-50",
  },
  {
    id: 4,
    icon: "🏠",
    label: "Lưu trú qua đêm",
    bg: "bg-emerald-50",
  },
  {
    id: 5,
    icon: "🐾",
    label: "Trông thú cưng",
    bg: "bg-indigo-50",
  },
  {
    id: 6,
    icon: "💅",
    label: "Cắt móng & vệ sinh",
    bg: "bg-purple-50",
  },
];

const ServiceCategoryBar = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">
        Danh mục dịch vụ nổi bật
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to="/services"
            className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group"
          >
            <div
              className={`w-14 h-14 rounded-full ${category.bg} flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform`}
            >
              {category.icon}
            </div>

            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ServiceCategoryBar;