import { PawPrint, Star, Phone, CheckCircle2 } from 'lucide-react';
import { imageUrl } from '../../services/businessData.js';

const FacilityHero = ({ business }) => {
  if (!business) return null;
  const cover = imageUrl(business.images, business.logo);
  const name = business.name || 'Cơ sở thú cưng';
  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700"><CheckCircle2 size={14} />Đã được duyệt</span>
          <p className="flex items-center gap-2 text-sm"><Star size={16} className="text-amber-500" />
            {business.totalReviews > 0 ? Number(business.averageRating || 0).toFixed(1) + ' / 5 (' + business.totalReviews + ' đánh giá)' : 'Chưa có đánh giá'}
          </p>
          {business.phone && <a href={'tel:' + business.phone} className="flex items-center gap-2 text-sm text-emerald-700"><Phone size={15} />{business.phone}</a>}
          {business.email && <p className="text-sm text-slate-600">{business.email}</p>}
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{business.description || 'Cơ sở chưa cập nhật phần giới thiệu.'}</p>
        </div>
        <div className="min-h-56 bg-emerald-50 flex items-center justify-center">
          {cover ? <img src={cover} alt={name} className="h-64 w-full object-cover lg:h-full lg:max-h-96" /> : <PawPrint size={80} className="text-emerald-300" />}
        </div>
      </div>
    </section>
  );
};

export default FacilityHero;
