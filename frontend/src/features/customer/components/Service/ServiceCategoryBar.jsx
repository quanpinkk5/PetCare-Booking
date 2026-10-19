import { PawPrint } from 'lucide-react';

const ServiceCategoryBar = ({ categories = [], selectedId = '', onChange }) => (
  <section className="space-y-4" aria-label="Danh mục dịch vụ">
    <h2 className="text-base font-bold text-slate-800">Danh mục dịch vụ</h2>
    <div className="flex flex-wrap gap-3">
      <button type="button" aria-pressed={!selectedId} onClick={() => onChange('')}
        className={'rounded-xl border px-4 py-3 text-sm font-semibold ' + (!selectedId ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600')}>Tất cả</button>
      {categories.map((category) => (
        <button type="button" key={category._id} aria-pressed={selectedId === category._id} onClick={() => onChange(category._id)}
          className={'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ' + (selectedId === category._id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300')}>
          <PawPrint size={16} />{category.name}
        </button>
      ))}
    </div>
  </section>
);

export default ServiceCategoryBar;
