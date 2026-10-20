import {
  PawPrint,
  Bath,
  Scissors,
  Sparkles,
  Home,
  HeartHandshake,
  HeartPulse,
  LayoutGrid
} from 'lucide-react';

const getCategoryIcon = (category) => {
  if (!category) return LayoutGrid;
  const key = `${category.name || ''} ${category.code || ''}`.toLowerCase();
  if (key.includes('tắm') || key.includes('vệ sinh') || key.includes('bath')) return Bath;
  if (key.includes('groom') || key.includes('cắt') || key.includes('tỉa')) return Scissors;
  if (key.includes('spa') || key.includes('massage') || key.includes('thư giãn')) return Sparkles;
  if (key.includes('lưu trú') || key.includes('khách sạn') || key.includes('hotel') || key.includes('stay')) return Home;
  if (key.includes('trông') || key.includes('sitting')) return HeartHandshake;
  if (key.includes('y tế') || key.includes('sức khỏe') || key.includes('care')) return HeartPulse;
  return PawPrint;
};

const ServiceCategoryBar = ({ categories = [], selectedId = '', onChange }) => {
  return (
    <section className="space-y-3" aria-label="Danh mục dịch vụ">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-xs">
            🐾
          </span>
          Khám phá theo danh mục
        </h2>
        {selectedId && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
          >
            Xem tất cả
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* All Categories Button */}
        <button
          type="button"
          aria-pressed={!selectedId}
          onClick={() => onChange('')}
          className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            !selectedId
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-600 ring-offset-2'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 shadow-2xs'
          }`}
        >
          <LayoutGrid size={16} className={!selectedId ? 'text-emerald-100' : 'text-slate-400 group-hover:text-emerald-600'} />
          <span>Tất cả dịch vụ</span>
        </button>

        {/* Dynamic Category Buttons */}
        {categories.map((category) => {
          const Icon = getCategoryIcon(category);
          const isSelected = selectedId === category._id;

          return (
            <button
              type="button"
              key={category._id}
              aria-pressed={isSelected}
              onClick={() => onChange(category._id)}
              className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-600 ring-offset-2'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 shadow-2xs'
              }`}
            >
              <Icon
                size={16}
                className={isSelected ? 'text-emerald-100' : 'text-emerald-600 group-hover:scale-110 transition-transform'}
              />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceCategoryBar;
