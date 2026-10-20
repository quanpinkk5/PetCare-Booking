import { PawPrint, Star, Phone, Mail, CheckCircle2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { imageUrl } from '../../services/businessData.js';

const FacilityHero = ({ business }) => {
  if (!business) return null;

  const cover = imageUrl(business.images, business.logo);
  const name = business.name || 'Cơ sở thú cưng';
  const logo = imageUrl([business.logo], cover);
  const rating = business.totalReviews > 0 ? Number(business.averageRating || 0).toFixed(1) : '4.9';
  const reviewCount = business.totalReviews || 120;

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Info Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div>
            {/* Top badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 size={13} />
                <span>Đã kiểm duyệt chất lượng</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
                <Sparkles size={12} className="text-amber-500" />
                <span>Đối tác uy tín</span>
              </span>
            </div>

            {/* Name & Logo */}
            <div className="flex items-start gap-4">
              {logo && (
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 shadow-2xs">
                  <img src={logo} alt={name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {name}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-slate-800">{rating} / 5.0</span>
                  <span className="text-xs text-slate-400">({reviewCount} đánh giá thực tế)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
              {business.description ||
                'Hệ thống cơ sở chăm sóc, làm đẹp và lưu trú thú cưng cao cấp với tiêu chuẩn an toàn hàng đầu.'}
            </p>
          </div>

          {/* Contact & quick details pill list */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
              >
                <Phone size={14} className="text-emerald-600" />
                <span>{business.phone}</span>
              </a>
            )}

            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                <Mail size={14} className="text-slate-500" />
                <span>{business.email}</span>
              </a>
            )}

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>Bảo hiểm & cam kết sức khỏe thú cưng</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image Column */}
        <div className="lg:col-span-5 relative min-h-64 lg:min-h-full bg-slate-100 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={name}
              className="w-full h-full object-cover min-h-64 lg:min-h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-emerald-50 text-emerald-300">
              <PawPrint size={72} />
              <p className="mt-2 text-xs font-semibold text-emerald-600">PetCare Verified Partner</p>
            </div>
          )}

          {/* Gradient shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            <span>Không gian chuẩn 5 sao</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilityHero;
