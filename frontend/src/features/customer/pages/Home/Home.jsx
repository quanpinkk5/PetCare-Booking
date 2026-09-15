import {
  Calendar,
  Check,
  Clock,
  ShieldCheck,
  Shield,
  HeartHandshake,
  Star,
  Users,
  ChevronDown,
  MapPin,
  Search,
  Cat,
} from "lucide-react";

import CustomerHeader from "../../components/CustomerHeader";
import CustomerFooter from "../../components/CustomerFooter";
import ServiceCategoryBar from "../../components/ServiceCategoryBar";
import HowItWorks from "../../components/HowItWorks";
import ReviewCard from "../../components/ReviewCard";
import BusinessCard from "../../components/BusinessCard";

const Home = () => {
  const businesses = [
    {
      name: "Puppy Love Pet Spa",
      location: "Quận 1, TP. Hồ Chí Minh",
      price: "150.000đ",
      rating: "4.9",
      tags: ["Tắm & vệ sinh", "Grooming", "Spa"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxJAKpJxzroTUY5rGOZQ9Ux9UIVSC9Y8i3d4j4KCJNlBx_nd6jc7SRytqtIRVx8eX3MSqWo_6iu0pB__rO4C4iSDMKKvSgz9tPVzmIA8r5Trmgs4Pr3uuCyabdqxVLqZMX9vP_ZDbnpe70FpndVw58SNXloCJHJFmm23NoJI71JLi-9XTGyxZwgrefCk7714E2gJnAxWVhlexSYlVICwVaWtfJwL1A9u693nnMBMmGcgCW75qcYdow",
    },
    {
      name: "Meow House Quận 3",
      location: "Quận 3, TP. Hồ Chí Minh",
      price: "120.000đ",
      rating: "4.8",
      tags: ["Spa", "Gửi thú cưng", "Cắt móng"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7xDQ-G2o-KLwfTFtFYv3YTDSFH9oJLkFCSYatlC38-22-lhq8pfrmCa-q5df8dzajnCXUckSiP3wQQlpfuEAhVmGiVwhg2fBjNRvhgJ802owve2OUGP7yYhDWQ9jcMIe0ZTNYLMVPSFgccNfqJ3Jb0p96TKdkQe-jXb1xbZ75JZw3K-w5-c5KsTWJDZqbLnFLJodVYhvDif8vkBQO8EVE9IWsV56Au36HwATA6PJmeNQZjNfhlquG",
    },
    {
      name: "Lucky Pet Hotel",
      location: "Phú Nhuận, TP. Hồ Chí Minh",
      price: "200.000đ",
      rating: "4.8",
      tags: ["Lưu trú qua đêm", "Spa", "Tắm"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK1aGGM6S0GpQBkjoy3WtYH7S8VEvVLg8psnjCziVQ2KFPUWlzmcz9ZzwKN3Dsif1F__B0zPwRDQU0ZnoqOXjBywZrU8jpEaOvzutsYf4a2pGYP_qjySjODvSDkvlXk_AgX013qvWc_V3ZYCSpRoZyXJEqO5VhKv8c1FJvytBV_tLIh9SipZuZa8OjwtnM5wF8a0sw4d8f5pqQfBcIx24nFHiSmliOe7-Y4wiCtqzDNyGl6ru9IBbR",
    },
  ];

  const reviews = [
    {
      name: "Nguyễn Minh Khoa",
      review:
        "Dịch vụ tuyệt vời! Bé cún nhà mình được tắm rất sạch sẽ và thơm tho.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCISqoZPaU9q1RIMO0fLohmhhICAvoiCw_shvfaMZixYuzW0zBaofb0Bo42HDdf40P49Hn3_KCihM-ao_n3hBIOJXpb7umT3X_UhGv-2mZbJjidbgIYYwA__Nhy6UD__CVRpf_MBAUakP1Wyf8MSkU-AuVAszc59Ogx8AwQ8ZLVavcdWJIu5ZgVt_Qc2-IVTVpxDuCGPv3qcYloeRtpfu8R4YR2w5r5UoeGI7YcU-_NXns5vhUZxYeg",
    },
    {
      name: "Trần Thùy Linh",
      review:
        "Đặt lịch nhanh chóng, nhân viên thân thiện, không gian sạch sẽ.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpyhLL8E6bUGL3fRRkzgi076k9xUcdJVlP254hQU9VxuyXOT7tp_jbAiiyXPAOeCf6UNG9LquhgKjO8GU6kRZtAHyclArCD1NO7em3iRyQQzlg6xVodhJTPsp3ZFneiakeWMoYMmoiKJzO4JLDXYvbruVvzcRf8AMCb8gphbQiSGBY0G6jBlVK_pBShbli3A-4D1pIg-eQf0EUy2Gj3h58aOkEEdcSFg7TpWXRo-WuLViCJdPj6sd",
    },
    {
      name: "Phạm Quốc Bảo",
      review:
        "Mình rất yên tâm khi gửi bé mèo ở đây. Sẽ ủng hộ dài dài!",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGZGi5Mpj0bG5fmNCoL_n4_a8c7tkcF17mCn_Mail-bpME9bifPAesWBOHqCXsZWUVk3N2TrcTLWFVaZGCgrLCL6G7YDzMb3r1TPs4VcEMq7v0z4sW2VaHarD3FQVdBhWWkui0VGpBGFogLiVanT8qjthl15MALoCxkxvZk1dnEvJB0LSb6ZfquA5VlO3JIue-yOW582rfKKNIrkoU55qbUZZJEcwNN3OOnOeQqCOpP5Ixd4x0QSY",
    },
  ];

  return (
    <div className="bg-[#fcfdfd] text-[#1e293b] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800 min-h-screen">

      <CustomerHeader />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden hero-gradient pt-8 pb-16 lg:pb-24 border-b border-slate-100">

        <div className="absolute inset-0 paw-pattern pointer-events-none"></div>

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute top-20 right-10 w-80 h-80 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Hero Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                Đặt dịch vụ chăm sóc thú cưng tại{" "}
                <span className="text-emerald-600 inline-block underline decoration-emerald-200 decoration-wavy underline-offset-8">
                  hàng trăm cơ sở uy tín
                </span>
              </h1>

              <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Tìm kiếm, so sánh và đặt lịch dễ dàng các dịch vụ tắm rửa, grooming, spa, lưu trú cho thú cưng của bạn.
              </p>

              {/* Search */}
              <div className="mt-8 bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {/* Service */}
                  <div className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-500 transition-colors bg-slate-50/50 flex items-center justify-between group cursor-pointer">

                    <div className="flex items-center gap-3">

                      <div className="text-emerald-600 flex justify-center w-7">
                        <Cat size={20} />
                      </div>

                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400">
                          Dịch vụ
                        </span>

                        <span className="text-sm font-semibold text-slate-800">
                          Chọn dịch vụ
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-600"
                    />
                  </div>

                  {/* Location */}
                  <div className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-500 transition-colors bg-slate-50/50 flex items-center justify-between group cursor-pointer">

                    <div className="flex items-center gap-3">

                      <div className="text-emerald-600 flex justify-center w-7">
                        <MapPin size={20} />
                      </div>

                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400">
                          Địa điểm
                        </span>

                        <span className="text-sm font-semibold text-slate-800">
                          Chọn khu vực
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-600"
                    />
                  </div>

                  {/* Date */}
                  <div className="flex gap-2">

                    <div className="flex-1 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-500 transition-colors bg-slate-50/50 flex items-center justify-between group cursor-pointer">

                      <div className="flex items-center gap-2">

                        <div className="text-emerald-600 flex justify-center w-6">
                          <Calendar size={20} />
                        </div>

                        <div>
                          <span className="block text-[11px] uppercase font-bold text-slate-400">
                            Ngày
                          </span>

                          <span className="text-sm font-semibold text-slate-800">
                            Chọn ngày
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        size={14}
                        className="text-slate-400 group-hover:text-emerald-600"
                      />
                    </div>

                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 sm:px-5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]">
                      <Search size={18} />

                      <span className="text-sm font-bold hidden sm:block">
                        Tìm
                      </span>
                    </button>

                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-slate-600">

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>Hơn 500+ cơ sở uy tín</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Clock size={12} strokeWidth={3} />
                  </span>
                  <span>Dễ dàng đặt lịch 24/7</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck size={12} strokeWidth={3} />
                  </span>
                  <span>Đội ngũ chuyên nghiệp</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Shield size={12} strokeWidth={3} />
                  </span>
                  <span>Thanh toán an toàn</span>
                </div>

              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">

              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">

                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOZOwmq0SJr_OnbWxVp-jR7dLwPwsyWcazXDezZVAFkV5M2ZkpaQoKPeE10jPE_ezFYnjMTyBjFNbDoXkQt9zrec_gTFuu8ZTt5fUHWxJtGvC7b6hhnrINWk8qzUNTwbvxHvnsjbGuL8L7CK-kbayM20QcVt_vR3Vnd32HxH10ktpizaTKwwf8nwOGNcGTexLhOOA2vhi3UJwzpkAibdH0M5R-W4lYRtHOdtg4D0YRsoBba0VrCVBI"
                  alt="Spa thú cưng"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Trust */}
              <div className="absolute top-4 -right-2 sm:-right-6 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-3 border border-slate-100 flex items-center gap-3 animate-pulse">

                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <HeartHandshake size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    An toàn & tin cậy
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Được kiểm duyệt kỹ
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="absolute top-1/2 -right-3 sm:-right-8 -translate-y-1/2 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-3 border border-slate-100 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center">
                  <Star
                    size={20}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    4.9 / 5.0
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Đánh giá trung bình
                  </p>
                </div>
              </div>

              {/* Customers */}
              <div className="absolute bottom-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-3 border border-slate-100 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-teal-100 text-emerald-600 flex items-center justify-center">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    100.000+
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Khách hàng tin tưởng
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICE CATEGORY ================= */}
      <ServiceCategoryBar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Featured Businesses */}
          <section className="lg:col-span-5">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Cơ sở nổi bật
              </h2>

              <a
                href="#"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Xem tất cả
              </a>
            </div>

            <div className="space-y-4">
              {businesses.map((business, index) => (
                <BusinessCard
                  key={index}
                  {...business}
                />
              ))}
            </div>

          </section>

          {/* How It Works */}
          <HowItWorks />

          {/* Reviews */}
          <section className="lg:col-span-3">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Khách hàng nói gì
              </h2>

              <a
                href="#"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Xem tất cả
              </a>
            </div>

            <div className="space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  {...review}
                />
              ))}
            </div>

          </section>

        </div>
      </main>

      <CustomerFooter />

    </div>
  );
};

export default Home;