import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { serviceApi } from "../../services/serviceApi.js";

import {
  PawPrint,
  Search,
  Scissors,
  Bath,
  Home as HomeIcon,
  Droplets,
  ShieldHalf,
  CalendarClock,
  Zap,
  Award,
  Receipt,
  Headphones,
  MessageCircle,
  HeartPulse,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle2,
  Phone,
  Tag,
  Star,
  X,
  AlertCircle
} from "lucide-react";

import ServiceCategoryBar from "../../components/Service/ServiceCategoryBar";
import ServiceCard from "../../components/Service/ServiceCard";

/* =========================
   HERO & SEARCH COMPONENT
========================= */

const Hero = ({ filters, onChange, onSearch, onReset, onQuickSearch }) => {
  const quickTags = [
    "Tắm & vệ sinh",
    "Grooming",
    "Spa thư giãn",
    "Lưu trú",
    "Cắt móng"
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8faf1] via-[#edf8f3] to-[#f7fcf9] p-6 sm:p-8 lg:p-10 border border-emerald-100/70 shadow-sm">
      {/* Decorative background paw prints & blurs */}
      <div className="absolute -left-10 top-10 text-emerald-200/35 pointer-events-none select-none -rotate-12">
        <PawPrint size={160} strokeWidth={1} />
      </div>

      <div className="absolute -right-10 -bottom-10 text-emerald-100/60 pointer-events-none select-none rotate-45">
        <PawPrint size={180} strokeWidth={1} />
      </div>

      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Breadcrumb & Heading */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          <div className="max-w-2xl space-y-3">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-2 text-xs text-slate-500 font-medium bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-full border border-emerald-100 shadow-2xs">
              <Link to="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <HomeIcon size={12} />
                <span>Trang chủ</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-emerald-700 font-semibold">Dịch vụ chăm sóc thú cưng</span>
            </nav>

            <div className="inline-flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <Sparkles size={13} className="text-emerald-600 animate-pulse" />
              <span>Hơn 500+ dịch vụ chất lượng cao</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight">
              Dịch vụ chăm sóc{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                thú cưng toàn diện
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Tìm kiếm, so sánh và đặt lịch ngay các dịch vụ spa, grooming tạo kiểu, tắm vệ sinh và lưu trú khách sạn thú cưng từ hàng trăm cơ sở được kiểm định uy tín.
            </p>
          </div>

          {/* Right Image Feature */}
          <div className="relative hidden lg:flex items-center justify-end">
            <div className="relative w-80 h-52 rounded-2xl overflow-hidden shadow-xl border-3 border-white bg-slate-100 group">
              <img
                alt="Thú cưng được chăm sóc"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDftV6C4EIAs4Hnwum30Z1R7V5d4pa62cxa3vi9GspOtqI0F4XYncWXpvW4iqkGvkJak3wIoN6PShvbJ_nYmgM492zrWd8d1d_f9XooA6QcHE27nj5gexjltW9wIFBTXP2h_ZoCdJuZQ4WZXfqN6PBMuhO5EAjTQ7pXkoCvnuEEkc6DHYhqXgINYPrqJa6wAW83fNbGiB2TAAbukDXvwD63nyLF8Dex2uE8K7w24vfo-pCkhDy-3ppl"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold flex items-center gap-1.5">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  Được 99.4% khách hàng đánh giá hài lòng
                </p>
              </div>
            </div>

            {/* Floating floating badges */}
            <div className="absolute -top-3 -left-3 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-100 animate-bounce duration-1000">
              <Scissors className="w-4 h-4" />
            </div>

            <div className="absolute top-2 -right-3 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-100">
              <Bath className="w-4 h-4" />
            </div>

            <div className="absolute -bottom-3 left-4 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-100">
              <HomeIcon className="w-4 h-4" />
            </div>

            <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-100">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-emerald-100/80 my-2">
          <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              🐾
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">500+ Dịch vụ</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Đa dạng lựa chọn</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-50">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
              🏥
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">100+ Chi nhánh</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Đối tác kiểm duyệt</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-50">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
              ⏱️
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">24/7 Đặt lịch</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Nhanh chóng tiện lợi</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-50">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
              ⭐
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">4.9 / 5.0</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Đánh giá trung bình</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Box */}
        <form onSubmit={onSearch} className="mt-6 rounded-2xl border border-emerald-200/80 bg-white p-4 sm:p-5 shadow-lg shadow-emerald-900/5">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
            <SlidersHorizontal size={14} className="text-emerald-600" />
            <span>Bộ lọc tìm kiếm thông minh</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Search Input */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên dịch vụ hoặc cơ sở
              </label>
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3 text-slate-400" />
                <input
                  type="search"
                  name="search"
                  maxLength={200}
                  value={filters.search}
                  onChange={onChange}
                  placeholder="Ví dụ: Tắm vệ sinh, Grooming Poodle..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 bg-slate-50/70 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Pet Type Select */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại thú cưng
              </label>
              <select
                name="petType"
                value={filters.petType}
                onChange={onChange}
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-700 bg-slate-50/70 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
              >
                <option value="">Tất cả thú cưng</option>
                <option value="DOG">Chó 🐶</option>
                <option value="CAT">Mèo 🐱</option>
              </select>
            </div>

            {/* Service Type Select */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hình thức dịch vụ
              </label>
              <select
                name="serviceType"
                value={filters.serviceType}
                onChange={onChange}
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-700 bg-slate-50/70 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
              >
                <option value="">Tất cả hình thức</option>
                <option value="APPOINTMENT">Theo lịch hẹn</option>
                <option value="BOARDING">Lưu trú / Khách sạn</option>
              </select>
            </div>

            {/* Min Price */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá từ (VNĐ)
              </label>
              <input
                type="number"
                name="minPrice"
                min="0"
                step="any"
                value={filters.minPrice}
                onChange={onChange}
                placeholder="Ví dụ: 100000"
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 bg-slate-50/70 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Max Price */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá đến (VNĐ)
              </label>
              <input
                type="number"
                name="maxPrice"
                min="0"
                step="any"
                value={filters.maxPrice}
                onChange={onChange}
                placeholder="Ví dụ: 500000"
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 bg-slate-50/70 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Action buttons & quick tags */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            {/* Quick search suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Tag size={12} /> Gợi ý:
              </span>
              {quickTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => onQuickSearch(tag)}
                  className="rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw size={14} />
                <span>Đặt lại</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Search size={15} />
                <span>Tìm kiếm</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

/* =========================
   SKELETON LOADER
========================= */

const SkeletonCard = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row rounded-2xl border border-slate-200/70 bg-white p-4 animate-pulse gap-4">
        <div className="h-44 sm:h-auto sm:w-56 bg-slate-200 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
          <div className="h-3 w-full bg-slate-100 rounded-md" />
          <div className="h-3 w-2/3 bg-slate-100 rounded-md" />
          <div className="h-6 w-32 bg-slate-200 rounded-md mt-4" />
          <div className="h-9 w-full sm:w-44 bg-slate-200 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white overflow-hidden animate-pulse">
      <div className="aspect-[16/10] w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 bg-slate-200 rounded-full" />
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-3 w-full bg-slate-100 rounded-md" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-md" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-24 bg-slate-200 rounded-md" />
          <div className="h-4 w-16 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 space-y-2">
        <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
        <div className="h-8 w-full bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

/* =========================
   SIDEBAR
========================= */

const Sidebar = () => {
  return (
    <aside className="lg:col-span-4 space-y-5">
      {/* 5-Star Commitment */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Award size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              Tiêu chuẩn PetCare 5⭐
            </h3>
            <p className="text-[11px] text-emerald-700 font-medium">
              Chất lượng đã kiểm định
            </p>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Kỹ thuật viên được đào tạo chứng chỉ Grooming & Spa</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Dụng cụ và không gian được khử trùng y tế định kỳ</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Minh bạch bảng giá, không phát sinh chi phí ẩn</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Cam kết an toàn tuyệt đối và chăm sóc yêu thương</span>
          </li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-600 text-xs font-bold">
            💡
          </span>
          Mẹo lựa chọn dịch vụ
        </h3>

        <div className="space-y-3.5">
          {[
            {
              icon: PawPrint,
              title: "Chọn gói phù hợp với thú cưng",
              desc: "Cân nhắc cân nặng, độ dài lông và tính cách để chọn dịch vụ chuẩn nhất.",
            },
            {
              icon: ShieldHalf,
              title: "Kiểm tra cơ sở uy tín",
              desc: "Xem kỹ các đánh giá thực tế và hình ảnh không gian của chi nhánh.",
            },
            {
              icon: HeartPulse,
              title: "Thông báo tình trạng sức khỏe",
              desc: "Báo trước các vấn đề về da, khớp hoặc thói quen nhạy cảm của bé.",
            },
            {
              icon: CalendarClock,
              title: "Đặt trước để tránh chờ đợi",
              desc: "Đặt lịch hẹn trước 1-2 ngày để nhận khung giờ đẹp nhất vào cuối tuần.",
            },
          ].map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">{tip.title}</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
            🛡️
          </span>
          Vì sao chọn PetCare Booking?
        </h3>

        <div className="space-y-3">
          {[
            {
              icon: Zap,
              title: "Đặt lịch tức thì trong 60 giây",
              desc: "Thao tác mượt mà, xác nhận nhanh chóng qua tin nhắn.",
            },
            {
              icon: Receipt,
              title: "Giá niêm yết rõ ràng",
              desc: "Mọi khoản phí dịch vụ đều được báo trước minh bạch.",
            },
            {
              icon: Headphones,
              title: "Hỗ trợ khách hàng chu đáo",
              desc: "Tổng đài và kênh chat luôn đồng hành cùng bạn 24/7.",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">{feature.title}</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Support Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none select-none">
          <PawPrint size={130} />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span>Tư vấn viên đang trực tuyến</span>
          </div>

          <h4 className="font-extrabold text-base">
            Bạn cần tư vấn chọn dịch vụ?
          </h4>

          <p className="text-xs text-emerald-50 leading-relaxed">
            Đội ngũ tư vấn viên PetCare luôn sẵn sàng hỗ trợ bạn chọn gói chăm sóc phù hợp nhất cho bé cưng.
          </p>

          <div className="pt-1 flex flex-wrap gap-2">
            <Link
              to="/messages"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle size={14} />
              <span>Nhắn tin tư vấn</span>
            </Link>

            <a
              href="tel:1900636061"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 px-3.5 py-2 text-xs font-semibold text-white border border-white/20 transition-colors"
            >
              <Phone size={13} />
              <span>1900 63 60 61</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* =========================
   MAIN SERVICES COMPONENT
========================= */

const EMPTY_FILTERS = { search: '', petType: '', serviceType: '', minPrice: '', maxPrice: '' };

const Services = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [query, setQuery] = useState({ ...EMPTY_FILTERS, categoryId: '', sort: 'newest', page: 1, limit: 8 });
  const [result, setResult] = useState({ data: [], pagination: { total: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [categoryState, setCategoryState] = useState({ data: [], loading: true, error: '' });
  const [categoryAttempt, setCategoryAttempt] = useState(0);

  // View Mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    let cancelled = false;
    serviceApi.list(query).then((response) => {
      if (!cancelled) setResult(response);
    })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Không thể tải dịch vụ.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [query, attempt]);

  useEffect(() => {
    let cancelled = false;
    serviceApi.categories().then((response) => {
      if (!cancelled) setCategoryState({ data: response.data, loading: false, error: '' });
    }).catch((err) => {
      if (!cancelled) setCategoryState({ data: [], loading: false, error: err.message || 'Không thể tải danh mục.' });
    });
    return () => { cancelled = true; };
  }, [categoryAttempt]);

  const updateQuery = (values) => {
    setLoading(true);
    setError('');
    setQuery((current) => ({ ...current, ...values }));
  };

  const change = (e) => setFilters((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    updateQuery({ ...filters, page: 1 });
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    updateQuery({ ...EMPTY_FILTERS, categoryId: '', page: 1, sort: 'newest' });
  };

  const handleQuickSearch = (keyword) => {
    const updated = { ...filters, search: keyword };
    setFilters(updated);
    updateQuery({ ...updated, page: 1 });
  };

  // Helper for active filter tags
  const activeFilterList = [];
  if (query.search) activeFilterList.push({ label: `Tìm: "${query.search}"`, key: 'search' });
  if (query.petType) activeFilterList.push({ label: query.petType === 'DOG' ? 'Chó 🐶' : 'Mèo 🐱', key: 'petType' });
  if (query.serviceType) activeFilterList.push({ label: query.serviceType === 'BOARDING' ? 'Lưu trú' : 'Lịch hẹn', key: 'serviceType' });
  if (query.minPrice !== '' && query.minPrice != null) activeFilterList.push({ label: `Từ ${Number(query.minPrice).toLocaleString('vi-VN')}₫`, key: 'minPrice' });
  if (query.maxPrice !== '' && query.maxPrice != null) activeFilterList.push({ label: `Đến ${Number(query.maxPrice).toLocaleString('vi-VN')}₫`, key: 'maxPrice' });

  const clearSingleFilter = (key) => {
    const nextFilters = { ...filters, [key]: '' };
    setFilters(nextFilters);
    updateQuery({ [key]: '', page: 1 });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 space-y-8">
        {/* Hero with interactive Search Bar */}
        <Hero
          filters={filters}
          onChange={change}
          onSearch={handleSearch}
          onReset={handleReset}
          onQuickSearch={handleQuickSearch}
        />

        {/* Categories Bar */}
        {categoryState.loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <span className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <span>Đang tải danh mục dịch vụ...</span>
          </div>
        ) : categoryState.error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{categoryState.error}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCategoryState({ data: [], loading: true, error: '' });
                setCategoryAttempt((value) => value + 1);
              }}
              className="font-bold underline hover:text-red-800"
            >
              Tải lại
            </button>
          </div>
        ) : (
          <ServiceCategoryBar
            categories={categoryState.data}
            selectedId={query.categoryId}
            onChange={(categoryId) => updateQuery({ categoryId, page: 1 })}
          />
        )}

        {/* Content Section: Service List & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Services Column */}
          <section className="lg:col-span-8 space-y-5">
            {/* Header Toolbar: Results count, Active Filters, Sorting, View Toggle */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-800">
                    Dịch vụ tại các chi nhánh
                  </h2>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    {loading ? '...' : error ? '—' : `${result.pagination.total} kết quả`}
                  </span>
                </div>

                {/* Right controls: View toggle & Sort */}
                <div className="flex items-center gap-3">
                  {/* Grid / List View Switcher */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                    <button
                      type="button"
                      aria-label="Xem dạng lưới"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white text-emerald-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Xem dạng danh sách"
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-white text-emerald-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <List size={15} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <label htmlFor="service-sort" className="hidden sm:inline">Sắp xếp:</label>
                    <select
                      id="service-sort"
                      value={query.sort}
                      onChange={(e) => updateQuery({ sort: e.target.value, page: 1 })}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-hidden transition-colors cursor-pointer"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="priceAsc">Giá thấp đến cao</option>
                      <option value="priceDesc">Giá cao đến thấp</option>
                      <option value="name">Tên A–Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilterList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">Đang lọc:</span>
                  {activeFilterList.map((item) => (
                    <span
                      key={item.key}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                    >
                      <span>{item.label}</span>
                      <button
                        type="button"
                        onClick={() => clearSingleFilter(item.key)}
                        className="hover:text-emerald-900 cursor-pointer ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] font-semibold text-slate-500 hover:text-red-600 underline ml-1 cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>

            {/* Service Grid/List or State */}
            {loading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : error ? (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center text-red-700 space-y-3">
                <AlertCircle size={36} className="mx-auto text-red-500" />
                <h3 className="text-base font-bold text-red-900">Không thể tải dữ liệu dịch vụ</h3>
                <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setLoading(true);
                    setAttempt((value) => value + 1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <RotateCcw size={14} />
                  <span>Thử lại</span>
                </button>
              </div>
            ) : result.data.length ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                {result.data.map((item) => (
                  <ServiceCard key={item._id} service={item} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                  🐾
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">
                    Không tìm thấy dịch vụ phù hợp
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Hãy thử thay đổi từ khóa tìm kiếm, điều chỉnh khoảng giá hoặc bỏ chọn một số bộ lọc để xem thêm kết quả.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Khôi phục bộ lọc</span>
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && result.pagination.totalPages > 1 && (
              <nav aria-label="Phân trang dịch vụ" className="flex justify-center items-center gap-2 pt-4">
                <button
                  type="button"
                  disabled={query.page <= 1}
                  onClick={() => updateQuery({ page: query.page - 1 })}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Trang trước</span>
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: result.pagination.totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    // Only show first, last, and pages close to current page
                    if (
                      pageNum === 1 ||
                      pageNum === result.pagination.totalPages ||
                      (pageNum >= query.page - 1 && pageNum <= query.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => updateQuery({ page: pageNum })}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            query.page === pageNum
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === query.page - 2 || pageNum === query.page + 2) {
                      return (
                        <span key={pageNum} className="text-slate-400 text-xs px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  disabled={query.page >= result.pagination.totalPages}
                  onClick={() => updateQuery({ page: query.page + 1 })}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  <span className="hidden sm:inline">Trang sau</span>
                  <ChevronRight size={14} />
                </button>
              </nav>
            )}
          </section>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default Services;
