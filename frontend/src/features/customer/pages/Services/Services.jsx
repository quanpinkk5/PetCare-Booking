import React from "react";
import { Link } from "react-router-dom";

import {
  PawPrint,
  ChevronDown,
  Search,
  Tag,
  LayoutGrid,
  ArrowDownWideNarrow,
  Scissors,
  Bath,
  Home,
  Droplets,
  MapPin,
  ShieldHalf,
  CalendarClock,
  Zap,
  Award,
  Receipt,
  Headphones,
  MessageCircle,
  HeartPulse,
} from "lucide-react";

import ServiceCategoryBar from "../../components/Service/ServiceCategoryBar";
import ServiceCard from "../../components/Service/ServiceCard";

const SERVICES = [
  {
    id: 1,
    title: "Tắm & vệ sinh cơ bản",
    tag: "Tắm & vệ sinh",
    desc: "Tắm sạch, vệ sinh tai, cắt tỉa lông vùng cơ bản. Phù hợp cho thú cưng...",
    price: "Từ 150.000đ",
    time: "60 phút",
    rating: 4.9,
    reviews: 256,
    locations: 12,
    isPopular: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbU66EbJkheVY5HMflWJKpZBC09mcARBVbVWbMqsoiet23-hTGn7sKjSVclfUPrC8nFXtb9uzUiPviU2pWTvGBllvj7IyZeLoVR378es4yKtjgw6T91_re2tFm07OhHoRPFNFlwD7bazlaDVi3Kv4Unl49OrNashSmB_WQjktu7bspQOaMVyD9m41IBuun7TUmm_r5oM0ZndRx1Eud5p6xpQNdwu4gHgWRJAWTLYvzggpg2b5arO9X",
  },
  {
    id: 2,
    title: "Premium Grooming",
    tag: "Grooming",
    desc: "Cắt tỉa, tạo kiểu lông chuyên nghiệp, sấy, chải bóng và chăm sóc toàn diện.",
    price: "Từ 320.000đ",
    time: "90 phút",
    rating: 4.8,
    reviews: 184,
    locations: 18,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgVvTjn08FLdJ774PLMrYhq1o9Q35spPNk_V_g_LfbKKk2L_FS3_YGuYwB-AE7iqB2EpHcqoGuXb48D9PNfHYh1Cud1_oRcu4-jfSLUE94Nd2YkCddOdebLblCHY0WOVTO9lep379q_ZFiZlNv1asr2s2srtOUMrvzocKOLENIY-sdY-2u-rsNIG7L5EEGK3yYjH6azXUMnn_Jp1FPFQl_0XMS8FgGDUaMT8PgGrTyUgZgMeQiCLWh",
  },
  {
    id: 3,
    title: "Spa thư giãn",
    tag: "Spa thư giãn",
    desc: "Massage, tắm thảo dược, ủ dưỡng lông giúp thú cưng thư giãn sâu.",
    price: "Từ 280.000đ",
    time: "75 phút",
    rating: 4.9,
    reviews: 132,
    locations: 15,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYj-6Q9AzNPYz95yf9HHVwtLfo7SzGuehBApbQbn0HeN6ZkW-bzH8Ed079Q7q_dPbWBV5VJasduZjNRcxCcHi71QNqNEWUcg3ZPuhgo1nUyuXhoYvJDansh1g-m-QaICdwTDFzb2roQCTwsKgcxRqf5drxlxzupCtQVY613pWAIYbcgWg6N_PqY9XLkSTd0kjXuLd6ORl9a8lXCSPsumOgBZ49Cdj1mjEVvzrLGGjLVeeSbZtXUyEx",
  },
  {
    id: 4,
    title: "Lưu trú qua đêm",
    tag: "Lưu trú",
    desc: "Lưu trú thoải mái, có người chăm sóc 24/7, chơi đùa và dạo ngoài trời.",
    price: "Từ 200.000đ/ngày",
    time: "Theo ngày",
    rating: 4.9,
    reviews: 98,
    locations: 20,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGK_l3Yd4ZMQqd2luaGSthxlxJXsYnZA3W4Zm9-d7NrrhRCJBAQ-uiCL8Sj0PoOd4Y7Ro6mlJWkonx_3Xmunn1e3fFKljycwdpmfvwiPUtPgX0hykoItDxw4EQ1NIVCZniZUN5Cqkkl0O34u7QFXX7Wc9HnIJNaZ_E-i5jiOmB_bzFKC2wLQLBhoLYkQADMfEmfnsKvG-yLeGUWNqkjrNbuyGR3mq4zzaccSv-uz8o2sXRBLexxHwW",
  },
  {
    id: 5,
    title: "Pet Sitting theo giờ",
    tag: "Trông thú cưng",
    desc: "Chăm sóc thú cưng tại nhà theo giờ: cho ăn, dọn vệ sinh, chơi cùng.",
    price: "Từ 80.000đ/giờ",
    time: "60 phút",
    rating: 4.8,
    reviews: 76,
    locations: 12,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfegNOUmzF-sCmqIoT3A1VsYJmn8j8X_9R8CuVJWmQNZLifOy8BFYwgu4nl39lqNPXglgPu0pFH4axSpNarCqs8gse04CIzG7JeUiL4gDybtItqngULa0aq4R36z64ou3WAeLiPelKg2N7sIHAh9crUFNUj-Ugy56qlZCILQayWTu8vJ-9NU0vT4iGXrtdaXCfUGUDZCzOw8pDkpARo2ADNULjH7J2X7FA75YMSV3NdMJ_qk9C3Dun",
  },
  {
    id: 6,
    title: "Cắt móng & vệ sinh tai",
    tag: "Chăm sóc sức khỏe",
    desc: "Cắt móng, mài móng và vệ sinh tai an toàn, nhẹ nhàng, không gây đau.",
    price: "Từ 90.000đ",
    time: "30 phút",
    rating: 4.7,
    reviews: 63,
    locations: 14,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcWlC39Qg1Po1DP87PqaH0zVSEWPy53GAvU5IRrqVQaA5hDp1gXaYcjfnJOzn2Kl2Tp0vn065nzWf_mQ-fMyRqFK7NLv8bXffXPnmbjb4snfYswA_YlHt4pSRofRgN6CuReNvbXH2SdhzIfb8LUnFHlRlx1fKA0qJbGkqBmCSCEneV7dnN48qUjT4IZ-XmIhA4jKk_EXx0E7l4uEksBSXmMHqrYoA9Nm4PmhBkp36TpnCWBXvOUogm",
  },
  {
    id: 7,
    title: "Trông thú cưng qua đêm",
    tag: "Trông thú cưng",
    desc: "Nhận trông thú cưng tại nhà bạn qua đêm, đảm bảo an toàn, yêu thương.",
    price: "Từ 250.000đ/đêm",
    time: "Theo ngày",
    rating: 4.8,
    reviews: 51,
    locations: 9,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARWGemb8qGkejwABlM0lpzmUCYa0d4CGpvaSKrX91i2dDNCwsWeMTCC6M0Q0uWhjZ4HR2_MNMClVvRWpnn8tatfi86BHfMOn9iq1oWfbaDYGsYi9X9oIjLUcU7mSsV8bMe_N5Z1B7r1E8aaXvFybUGtKM2Sqc8fVFpzWglEESC-TOlo_UMbafsHjJwMNkQtdhvwlzBvAwk1dkzGyMhVfNh330PjJcMXgonUV2QgOWOrK51_qB2ho7K",
  },
  {
    id: 8,
    title: "Vận chuyển thú cưng",
    tag: "Dịch vụ khác",
    desc: "Đưa đón thú cưng đến spa, bệnh viện hoặc sân bay an toàn, đúng giờ.",
    price: "Từ 150.000đ/lượt",
    time: "Theo chuyến",
    rating: 4.7,
    reviews: 29,
    locations: 8,
    isPopular: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4irjg9uAQqoQDMbxfydSG968DA8kFepfdSFNOSTr8Iz8-7Ex9LVv86hlxku54yoF9aQrAsTjFt2fXNHqU2JtYzBVSLe9Qea8eKB_xsDid26tVyFjAJO1uGvWHFkO-xXQkBWI5tZEruPL2-f_PFinRd3wiqRMdhkOhvaS_cFAZxlY6OUff5wqX905NpcVZpJG8oLvVP1mj8QbGp3P9ELo2qDmlZh8BgL1G98z363J6WMect402lb_G",
  },
];

const PROMOS = [
  {
    id: 1,
    title: "Combo Tắm & Grooming",
    badge: "Tiết kiệm 15%",
    desc: "Tiết kiệm hơn khi đặt combo tắm + cắt tỉa lông cho bé cưng.",
    price: "Từ 420.000đ",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcyNN6sA10cKL9qvvc4FaXjq26536zUrn0Se4e1bO_b1KbQMw9XpoR-G0Tlwe2_SrCCeTnzgohgRR27jc8moOfke5zl_FCK5ci-h_9xro3m2mdSO8QA1A_nnpzqUsTFW0PZL5L4mJNA9s0JN0qyIRBIv2XMJkrYjleP5gJNtTWBKsoLcqd4pLDwW3Pm8pnehfNEu_Ygyog_2rUB44d2hMC1L8rbzy9_Hn7oE1CJdt4IsPSqUogP0up",
  },
  {
    id: 2,
    title: "Gói Spa cao cấp",
    badge: "Thư giãn tối đa",
    desc: "Liệu trình spa cao cấp giúp bé thư giãn và lông mềm mượt.",
    price: "Từ 350.000đ",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNTsyfkCL2QIzdvgCmlkpUVWEXz6lzwxL5LyhjMh2iMZRCkvGNd30QQ9lD4_KViF6Uwsa1lTnTKnXmpIMMUOzipUWRoZwFzhF7U9egIeDRGK544xO-ahZ2GikfwWE8Hl-q4eAR0eovv6ysyId7RLSq4MEooeiDaALA9cfy7fLpxVD281qKaBicirWiV7D5KBHf4Kg_hOySAoSE1ABis7Zb7EO4Dj5pj9pJUh529jZUgrnqq-j1EEq9",
  },
  {
    id: 3,
    title: "Lưu trú dài ngày",
    badge: "Ưu đãi đến 20%",
    desc: "Ưu đãi khi lưu trú từ 3 ngày trở lên. An tâm khi đi xa.",
    price: "Từ 250.000đ/ngày",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdmKYUG8Qr0ISmS6W_V5sw6MyRcfd4-oy8myAx4SKtVDb6A-OQ-b3MvE4E0DnKbKgDGuCM6dsmUwdbSMCeA46Z1EyMKVhtarXYyMloJHdy0HFkn8QkU7zqAH8qRbq13N9Di9usH52l9G3C2uvifM3A0192wUZEh_66_jSITZFNcItdT99km7A-fBy4sqqyoEkPPBdYUDh_pCLjztcQRzveBNKR0LhBgFHfKhxJtDd6Yf5Boi84xtRh",
  },
];

/* =========================
   HERO
========================= */

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#ebfaf3] via-[#e2f7ed] to-[#f4fcf8] rounded-3xl p-6 md:p-10 overflow-hidden border border-emerald-50">

      <div className="absolute -left-6 top-10 text-emerald-200/50 pointer-events-none select-none">
        <PawPrint size={140} strokeWidth={1} />
      </div>

      <div className="absolute right-1/3 bottom-2 text-emerald-100/60 pointer-events-none select-none">
        <PawPrint size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">

        <div className="max-w-xl space-y-3">

          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>

            <span>/</span>

            <span className="text-slate-700">
              Dịch vụ
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dịch vụ{" "}
            <span className="text-emerald-600 font-extrabold">
              chăm sóc thú cưng
            </span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Khám phá các dịch vụ chất lượng cao dành cho thú cưng của bạn.
            <br className="hidden sm:inline" />
            Chăm sóc tận tâm - Yêu thương trọn vẹn.
          </p>

        </div>

        <div className="relative flex items-center justify-center lg:justify-end">

          <div className="relative w-72 h-48 md:w-80 md:h-52 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80">
            <img
              alt="Thú cưng được chăm sóc"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDftV6C4EIAs4Hnwum30Z1R7V5d4pa62cxa3vi9GspOtqI0F4XYncWXpvW4iqkGvkJak3wIoN6PShvbJ_nYmgM492zrWd8d1d_f9XooA6QcHE27nj5gexjltW9wIFBTXP2h_ZoCdJuZQ4WZXfqN6PBMuhO5EAjTQ7pXkoCvnuEEkc6DHYhqXgINYPrqJa6wAW83fNbGiB2TAAbukDXvwD63nyLF8Dex2uE8K7w24vfo-pCkhDy-3ppl"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -top-3 -left-3 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Scissors className="w-4 h-4" />
          </div>

          <div className="absolute top-2 -right-3 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Bath className="w-4 h-4" />
          </div>

          <div className="absolute -bottom-3 left-4 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Home className="w-4 h-4" />
          </div>

          <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-md text-emerald-600 border border-emerald-50">
            <Droplets className="w-4 h-4" />
          </div>

        </div>
      </div>

      {/* Search */}
      <div className="mt-8 bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap items-center gap-2">

        <div className="flex-1 min-w-[200px] flex items-center px-3 py-2 text-sm">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />

          <input
            type="text"
            placeholder="Tìm dịch vụ..."
            className="w-full border-none p-0 focus:ring-0 text-slate-700 placeholder-slate-400 text-sm outline-none"
          />
        </div>

        <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

        {[
          { icon: PawPrint, label: "Loại thú cưng" },
          { icon: Tag, label: "Mức giá" },
          { icon: LayoutGrid, label: "Hình thức" },
          { icon: ArrowDownWideNarrow, label: "Phổ biến" },
        ].map((filter, index) => (
          <React.Fragment key={index}>

            <div className="flex items-center text-xs md:text-sm text-slate-600 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer gap-2">
              <filter.icon className="w-4 h-4 text-slate-400" />

              <span>{filter.label}</span>

              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </div>

            {index < 3 && (
              <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />
            )}

          </React.Fragment>
        ))}

      </div>
    </section>
  );
};

/* =========================
   SERVICE LIST
========================= */

const ServiceList = () => {
  return (
    <section className="lg:col-span-8 space-y-6">

      <div className="flex items-center justify-between border-b border-slate-100 pb-3">

        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-bold text-slate-900">
            Tất cả dịch vụ
          </h2>

          <span className="text-xs text-slate-400 font-normal">
            | Hiển thị {SERVICES.length} dịch vụ
          </span>
        </div>

        <a
          href="#"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Xem tất cả
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </div>

      {/* Promotions */}
      <div className="space-y-3 pt-4">

        <h2 className="text-base font-bold text-slate-800">
          Dịch vụ được yêu thích
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {PROMOS.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col justify-between"
            >

              <div className="flex gap-2.5 items-start">

                <img
                  src={promo.img}
                  alt={promo.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {promo.title}
                  </span>

                  <span className="inline-block bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5">
                    {promo.badge}
                  </span>

                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {promo.desc}
                  </p>
                </div>

              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">

                <span className="text-xs font-bold text-slate-800">
                  {promo.price}
                </span>

                <Link
                  to="/booking"
                  className="text-[11px] font-semibold text-emerald-600 hover:underline border border-emerald-200 px-2 py-0.5 rounded-lg"
                >
                  Đặt ngay
                </Link>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

/* =========================
   SIDEBAR
========================= */

const Sidebar = () => {
  return (
    <aside className="lg:col-span-4 space-y-4">

      {/* Tips */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">

        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span className="text-emerald-600">
            💡
          </span>
          Mẹo lựa chọn dịch vụ
        </h3>

        <div className="space-y-3.5">

          {[
            {
              icon: PawPrint,
              title: "Chọn dịch vụ phù hợp",
              desc: "Xem xét nhu cầu và tính cách của thú cưng",
            },
            {
              icon: ShieldHalf,
              title: "Ưu tiên an toàn",
              desc: "Chọn cơ sở uy tín, có đánh giá tốt và quy trình rõ ràng",
            },
            {
              icon: HeartPulse,
              title: "Theo dõi sức khỏe",
              desc: "Thông báo tình trạng sức khỏe cho nhân viên trước khi sử dụng",
            },
            {
              icon: CalendarClock,
              title: "Đặt lịch trước",
              desc: "Giúp bạn chọn được khung giờ phù hợp và tránh chờ đợi",
            },
          ].map((tip, index) => {

            const Icon = tip.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <p className="font-bold text-slate-700">
                    {tip.title}
                  </p>

                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Why */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">

        <h3 className="font-bold text-slate-800 text-sm">
          Vì sao chọn PetCare Booking?
        </h3>

        <div className="space-y-3.5">

          {[
            {
              icon: Zap,
              title: "Đặt lịch nhanh chóng",
              desc: "Chọn dịch vụ và đặt lịch chỉ trong vài bước",
            },
            {
              icon: Award,
              title: "Nhiều cơ sở uy tín",
              desc: "Hơn 100+ đối tác được kiểm duyệt kỹ lưỡng",
            },
            {
              icon: Receipt,
              title: "Giá minh bạch",
              desc: "Hiển thị rõ ràng, không phát sinh chi phí ẩn",
            },
            {
              icon: Headphones,
              title: "Hỗ trợ 24/7",
              desc: "Đội ngũ hỗ trợ tận tâm, sẵn sàng giải đáp",
            },
          ].map((feature, index) => {

            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <p className="font-bold text-slate-700">
                    {feature.title}
                  </p>

                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Chat */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between gap-3 relative overflow-hidden">

        <div className="space-y-2 z-10">

          <h4 className="font-bold text-slate-800 text-sm">
            Bạn cần tư vấn?
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            Đội ngũ PetCare luôn sẵn sàng hỗ trợ và tư vấn dịch vụ phù hợp.
          </p>

          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm">
            <MessageCircle className="w-4 h-4" />
            <span>Chat với chúng tôi</span>
          </button>

        </div>

        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-4xl select-none z-10">
          🐶❤️
        </div>

      </div>

    </aside>
  );
};

/* =========================
   PAGE
========================= */

const Services = () => {
  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Hero */}
        <Hero />

        {/* Categories */}
        <ServiceCategoryBar />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <ServiceList />

          <Sidebar />

        </div>

      </div>
    </div>
  );
};

export default Services;