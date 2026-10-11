import React from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Star,
  MessageSquareQuote,
  Clock,
  Sparkles,
  ShieldCheck,
  Award
} from "lucide-react";

const ReviewsHero = ({ stats }) => {
  return (
    <section className="relative bg-gradient-to-b from-[#E7F8F2] via-[#EEF9F5] to-[#F6FAF8] pt-8 pb-10 overflow-hidden border-b border-teal-50/60">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Paws */}
      <div className="absolute top-10 left-8 text-teal-200/40 pointer-events-none select-none -rotate-12">
        <PawPrint size={90} />
      </div>
      <div className="absolute right-12 bottom-6 text-teal-200/30 pointer-events-none select-none rotate-45">
        <PawPrint size={75} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
          {/* Left Text */}
          <div className="flex-1 space-y-3">
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link to="/" className="hover:text-teal-600 transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/profile" className="hover:text-teal-600 transition-colors">
                Tài khoản
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-semibold">
                Đánh giá của tôi
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-800 text-xs font-semibold shadow-2xs">
              <Award size={14} className="text-emerald-600" />
              <span>Huy hiệu: Người nuôi thú cưng chu đáo & Tích cực</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Đánh giá{" "}
              <span className="text-teal-600">
                của tôi
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              Xem lại những trải nghiệm làm đẹp, chăm sóc thú cưng bạn đã chia sẻ và phản hồi tận tâm từ các cơ sở spa, bệnh viện thú y.
            </p>
          </div>

          {/* Right Mascot Card */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="relative bg-white/70 p-2.5 rounded-3xl backdrop-blur-sm border border-white shadow-xl shadow-teal-900/5">
              <img
                alt="Đánh giá thú cưng"
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80"
                className="w-64 sm:w-80 h-44 sm:h-48 rounded-2xl object-cover shadow-inner"
              />

              {/* Floating review rating badge */}
              <div className="absolute -top-3 -right-3 bg-white p-3 rounded-2xl shadow-lg border border-teal-50 flex items-center gap-2 text-amber-500 animate-pulse">
                <Star size={20} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-black text-slate-800">{stats.averageRating} / 5.0</span>
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-3 -left-3 bg-white px-3 py-2 rounded-xl shadow-lg border border-teal-50 flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>100% Đánh giá thực tế</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default ReviewsHero;
