import React from "react";
import {
  PawPrint,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
} from "lucide-react";

const FacilityHero = ({ business }) => {
  const name = business?.name || "Happy Pet Cầu Giấy";
  const rating = business?.rating || 4.9;
  const reviewsCount = business?.reviewsCount || 256;
  const location = business?.address || business?.location || "Cầu Giấy, Hà Nội";
  const phone = business?.phone || "0912 345 678";
  const description =
    business?.description ||
    "Happy Pet Cầu Giấy là hệ thống spa & pet hotel cao cấp với đội ngũ chuyên nghiệp, yêu thương thú cưng như chính gia đình.";
  const image =
    business?.image ||
    business?.img ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxIGzmwx5SBrvWdR_hvekMup3V34RL7weVtIFI4g15SRjvrgHNjzG3U5iTG15i2vqnK_Q94FB4nU3jsn0SaLpJl0m2vFNUvCOMioWSUa00CVdcA_1lnFtFWvywh7sHJWWDItGsEPxQL1YNrXAenYBVCHOYaVsase59pm7DJju-AmqAKddLsQd_KQFPfW5jIcjpjRi0brZCykj12Zs5teVMhhXA5sNYvmLbe2G5aCF9idcTXn9gKf2W";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[290px]">

        {/* Thông tin cơ sở */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {name}
              </h1>

              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Đã xác minh
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 flex-wrap">
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />

                <span className="text-slate-800 font-bold">
                  {rating}
                </span>

                <span className="text-slate-400 font-normal">
                  ({reviewsCount} đánh giá)
                </span>
              </div>

              <span className="text-slate-300">•</span>

              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-3.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">
                  {phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>08:00 - 20:00 (T2 - CN)</span>
              </div>
            </div>

            <p className="text-[12.5px] leading-relaxed text-slate-500 mb-4">
              {description}
            </p>
          </div>

          {/* Đặc điểm */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-emerald-50/70 text-emerald-700 font-medium rounded-lg">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Grooming chuyên nghiệp
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-blue-50/80 text-blue-700 font-medium rounded-lg">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Phòng lưu trú sạch sẽ
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-amber-50/80 text-amber-700 font-medium rounded-lg">
              <Award className="w-3 h-3 text-amber-600" />
              Nhân viên giàu kinh nghiệm
            </span>
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="lg:col-span-7 relative h-56 lg:h-auto overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

          <div className="absolute top-4 left-6 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 uppercase">
              <PawPrint className="w-3 h-3 text-emerald-400" />
              {name}
            </span>
          </div>

          <button
            aria-label="Lưu vào yêu thích"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-red-500 shadow-md backdrop-blur-sm flex items-center justify-center transition"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FacilityHero;