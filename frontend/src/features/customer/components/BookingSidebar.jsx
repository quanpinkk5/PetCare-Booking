import React from "react";
import {
  PawPrint,
  MapPin,
  BriefcaseMedical,
  Calendar,
  Clock,
  ArrowRight,
  MessageCircle,
  Zap,
  Star,
  Headphones,
} from "lucide-react";

const BookingSidebar = ({ business }) => {
  const currentName = business?.name || "Happy Pet Cầu Giấy";

  return (
    <aside className="lg:col-span-4 space-y-4">

      {/* Đặt lịch nhanh */}
      <div
        id="quick-book"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs"
      >
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <span className="text-emerald-600 text-base">⚡</span>

          <h3 className="text-sm font-bold text-slate-900">
            Đặt lịch nhanh
          </h3>
        </div>

        <form className="space-y-3.5">

          {/* Thú cưng */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chọn thú cưng
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600 text-xs">
                <PawPrint className="w-3.5 h-3.5" />
              </span>

              <select className="w-full text-xs pl-8 pr-7 py-2 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-500 bg-white">
                <option value="">
                  Chọn thú cưng của bạn
                </option>
                <option value="pet1">
                  Chó Corgi (Mochi)
                </option>
                <option value="pet2">
                  Mèo Ba Tư (Bơ)
                </option>
              </select>
            </div>
          </div>

          {/* Chi nhánh */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chọn chi nhánh
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                <MapPin className="w-3.5 h-3.5" />
              </span>

              <select
                defaultValue="current"
                className="w-full text-xs pl-8 pr-7 py-2 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-800 bg-white font-medium"
              >
                <option value="current">
                  {currentName}
                </option>

                {currentName !== "Happy Pet Cầu Giấy" && (
                  <option value="cau-giay">
                    Happy Pet Cầu Giấy
                  </option>
                )}

                <option value="hoan-kiem">
                  Happy Pet Hoàn Kiếm
                </option>

                <option value="dong-da">
                  Happy Pet Đống Đa
                </option>
              </select>
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chọn dịch vụ
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                <BriefcaseMedical className="w-3.5 h-3.5" />
              </span>

              <select className="w-full text-xs pl-8 pr-7 py-2 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-500 bg-white">
                <option value="">Chọn dịch vụ</option>
                <option value="tam">Tắm & vệ sinh</option>
                <option value="grooming">Premium Grooming</option>
                <option value="spa">Spa thư giãn</option>
                <option value="luu-tru">Lưu trú qua đêm</option>
              </select>
            </div>
          </div>

          {/* Ngày */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chọn ngày
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                <Calendar className="w-3.5 h-3.5" />
              </span>

              <input
                type="text"
                placeholder="Chọn ngày"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Giờ */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chọn giờ
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
              </span>

              <input
                type="text"
                placeholder="Chọn giờ"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Tạm tính */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Tạm tính
              </span>

              <span className="block text-[10px] text-amber-700 font-medium">
                Chưa chọn dịch vụ
              </span>
            </div>

            <span className="text-base font-extrabold text-slate-900">
              0đ
            </span>
          </div>

          {/* Tiếp tục */}
          <button
            type="button"
            className="w-full bg-[#179768] hover:bg-[#128359] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <span>Tiếp tục đặt lịch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Chat */}
          <button
            type="button"
            className="w-full bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-500 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat với cơ sở</span>
          </button>

        </form>
      </div>

      {/* Vì sao chọn Happy Pet */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 mb-3.5">
          Vì sao chọn {currentName}?
        </h3>

        <div className="space-y-3 text-xs">

          <Feature
            icon={Zap}
            iconBg="bg-emerald-50 text-emerald-600"
            title="Xác nhận nhanh"
            desc="Đặt lịch dễ dàng, xác nhận ngay lập tức"
          />

          <Feature
            icon={Star}
            iconBg="bg-amber-50 text-amber-600"
            title="Đánh giá thực tế"
            desc="Hơn 256 đánh giá từ khách hàng thật"
          />

          <Feature
            icon={Headphones}
            iconBg="bg-blue-50 text-blue-600"
            title="Hỗ trợ tận tâm"
            desc="Đội ngũ tư vấn 24/7, hỗ trợ tận tình"
          />

        </div>
      </div>

    </aside>
  );
};

const Feature = ({
  icon: Icon,
  iconBg,
  title,
  desc,
}) => {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      <div>
        <h4 className="font-bold text-slate-800 leading-tight">
          {title}
        </h4>

        <p className="text-[11px] text-slate-400">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default BookingSidebar;