import {
  PawPrint,
  CheckCircle2,
  Star,
  Building2,
  CalendarDays,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  MapPin,
  Scissors,
  Bath,
  Sparkles,
  Home,
} from 'lucide-react';

export default function BusinessOverviewCard({ facility }) {
  const images = [
    {
      alt: 'Khu vực lễ tân',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMnqR4B-1rmXfDRgsGpAn5XhxMr81-1QOT8jPIzUiOC97x4Q-PnPqR1PkBTJ8NP8IJo2ItLP6DR9xsllWvrUck_qkLiTURj4J-UvjcvOf36Zz_BNCuZEPsQSkyrxujQI5KJOhje2u-fPfCfBbmwtbQD1nTuSkFZQPxa2_Xq1mT2IH5f3Xe9Yqe9SLhHgCQtBN5z-I6Gt3Oc_EeT84-u5YnM_Zq69ibuaTTwzYHuWU',
    },
    {
      alt: 'Khu vực tắm rửa thú cưng',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgMjT_nHpKtP5hiI2PvcUYvyNAgBCyDrFLAEsCoC0yoR6fsaHXdj4FzeWFaL64hq8NKvnGCfnmxiUu5m6ls-DYhzMHh4CJWjS0ZOCejOxzBhzVNnlJOR_v76ZymqGcAMm5-cic2RVfR04abFYR5qTR3jGIaoQ2E2n1WgJvPGUnaikQTMykuUBWibVMuM3Of0TgWEyd5eCwjjF9v-nVoZZ7nFLLIJyeH4FPYEZEBKg',
    },
    {
      alt: 'Khu vực vui chơi và lưu trú',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiLWX2WxmojodBOc7s_SE47XsrlOO41ys2BM7ka0RfCR-uscmrGHL3OiWKlkwdZ8UsYy4csVFghsUebecQ3C-0druRgMJfc4KUHo894mJlrJjQt3fbgLfE9XKAJFjv12hyDHr1xOqK6sRqvI8Psp4l7W6FSCGITeHnNzVnyNbfDkBLMSSYr7mtVN8aY_0I9V1ltccVYiqJSz68RBts2660xMBWaL0mNgf_bQ5cwU',
    },
    {
      alt: 'Mặt tiền cơ sở',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCubIagEcBNwJ52Qzey4Yq8SlStYWvrJf3vmvYQTzFvl59GoFHyqsuLm1GzwzIF-Fzxrtcq1L3E-b3Ga4480zvbdfTJIIGqo0WAhahGdfRSDd9_ECHmJE3osYTnVksep9v72ye8UAInjxVoJFHkvRcjauVWdUvfwursCXLG9JVJru6EmOAnD_tRl82mLI2uIVM_96Gl0-B1km9j-gobmpvxndZAlOQ7rNPCNe4fshQ',
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center justify-center text-emerald-600 shrink-0">
          {facility?.icon ? (
            <span className="text-3xl">{facility.icon}</span>
          ) : (
            <PawPrint className="w-8 h-8 fill-current" />
          )}

          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate max-w-[70px]">
            {facility?.name || 'HAPPY PET'}
          </span>
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {facility?.name || 'Happy Pet'}
            </h2>

            <span
              className="text-emerald-500"
              title="Đã chứng nhận"
            >
              <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Hệ thống chăm sóc thú cưng chuyên nghiệp với dịch vụ
            grooming, spa và lưu trú tiêu chuẩn cao.
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />

              <span>
                <strong className="font-bold text-slate-900">
                  {facility?.rating || 4.8}
                </strong>
                /5
              </span>

              <span className="text-slate-400">
                ({facility?.ratingCount || 126} đánh giá)
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{facility?.branches || 3} chi nhánh</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span>Ngày đăng ký: {facility?.registerDate || '22/05/2025'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
          Thông tin liên hệ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] text-slate-400">
                Email
              </div>

              <div className="text-xs font-semibold text-slate-800 truncate">
                {facility?.email || 'happypet.vn@gmail.com'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>

            <div>
              <div className="text-[11px] text-slate-400">
                Số điện thoại
              </div>

              <div className="text-xs font-semibold text-slate-800">
                {facility?.phone || '0901 234 567'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>

            <div>
              <div className="text-[11px] text-slate-400">
                Website
              </div>

              <a
                href="https://happypet.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                https://happypet.vn
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wider">
          Địa chỉ trụ sở
        </h3>

        <div className="flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />

          <span>
            {facility?.location
              ? `Tầng 2, Tòa nhà PetCare Center, 123 Nguyễn Khang, Phường Yên Hòa, ${facility.location}`
              : 'Tầng 2, Tòa nhà PetCare Center, 123 Nguyễn Khang, Phường Yên Hòa, Quận Cầu Giấy, Hà Nội'}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wider">
          Mô tả doanh nghiệp
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          Happy Pet cung cấp các dịch vụ chăm sóc thú cưng toàn diện:
          Grooming, Tắm, Spa, Boarding với đội ngũ nhân viên chuyên nghiệp
          và cơ sở vật chất hiện đại, đảm bảo sự an toàn và thoải mái cho
          thú cưng.
        </p>
      </div>

      {/* Services */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
          Dịch vụ chính
        </h3>

        <div className="flex flex-wrap gap-2.5">
          <ServiceTag icon={Scissors} label="Grooming" />
          <ServiceTag icon={Bath} label="Tắm" />
          <ServiceTag icon={Sparkles} label="Spa" />
          <ServiceTag icon={Home} label="Boarding" />
        </div>
      </div>

      {/* Photos */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
          Ảnh cơ sở
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden h-24 bg-slate-100 border border-slate-200 shadow-inner group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceTag({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}