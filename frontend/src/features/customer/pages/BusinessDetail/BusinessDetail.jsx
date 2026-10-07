import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Bath,
  Scissors,
  Flower2,
  Building2,
  Calendar,
  Star,
  Dog,
  Cat,
  PawPrint,
} from "lucide-react";

import FacilityHero from "../../components/BusinessDetail/FacilityHero";
import InPageTabs from "../../components/BusinessDetail/InPageTabs";
import BookingSidebar from "../../components/BusinessDetail/BookingSidebar";
import { getBusinessById } from "../../services/mockBusinesses";

const BusinessDetail = () => {
  const { id } = useParams();
  const business = getBusinessById(id);

  return (
    <div className="font-sans text-slate-800 antialiased relative">

      {/* Background Paw */}
      <div className="fixed top-24 left-4 text-emerald-800 opacity-[0.035] pointer-events-none -z-10 select-none">
        <PawPrint size={100} />
      </div>

      <div className="fixed bottom-16 right-6 text-emerald-800 opacity-[0.035] pointer-events-none -z-10 select-none">
        <PawPrint size={150} />
      </div>

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4 w-full">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium"
        >
          <Link
            to="/"
            className="hover:text-emerald-600 transition"
          >
            Trang chủ
          </Link>

          <span className="text-slate-300">/</span>

          <Link
            to="/businesses"
            className="hover:text-emerald-600 transition"
          >
            Cơ sở
          </Link>

          <span className="text-slate-300">/</span>

          <span className="text-slate-600 font-semibold">
            {business?.name || "Happy Pet Cầu Giấy"}
          </span>
        </nav>

        {/* Hero */}
        <FacilityHero business={business} />

        {/* Tabs */}
        <InPageTabs />

        {/* Nội dung */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left */}
          <div className="lg:col-span-8 space-y-6">

            <IntroductionSection business={business} />

            <FeaturedServices />

            <AvailableSlots />

            <Reviews />

          </div>

          {/* Right */}
          <BookingSidebar business={business} />

        </div>
      </main>
    </div>
  );
};

/* =========================
   GIỚI THIỆU
========================= */

const IntroductionSection = ({ business }) => {
  const images = [
    {
      label: "Không gian spa",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4P6l0Yxim_ax0Dfst6-CXH7Xoshfxunv3EE1Uekd0jzZu4u0cAPz40v7YQIRrggcw--j20E6SDMKl-n5x6s-tfQhlW8CS9aBQUL7zWtoSpxbX_1EwzvQeGXOwDMFYHCglZU-YPdtIYbgRCbEENLdm8W7Xrsj-YVPIw1HDAQr-KK4A-VtYTX1nGhPAyfwOQOiC7um2Wy4jjUa1cLRv1rWG5G8xmtiLS_61ypJeMlKlSPElLiXdd2AK",
    },
    {
      label: "Khu grooming",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBacuK5g7qSESwVEU4Qao4zbHkC0hytgMfS35n09QvfY97G1cRGwdN3z18i9FGdHl1nMwOuy6BaBfk918Ce77gRRP7SJjm4oD6p25w9KkdV_zdceUtywlpyXlF7wSUyfoB8rIXN0kOYKS_KOez11wt9yoGzOerCv2GEwcl_9HrkfCKqB9mFRnGmUWEehMoCQeLB2UoNvfyhQAujmvnDv3KJZQcuXMKYPmjN_M0wzAzbPvIz4UM3qQSs",
    },
    {
      label: "Phòng lưu trú",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2x-oYrvl4mW1v6NNzTnsV0MGMSgHT1DJgBwHz9Aws5t-83Y5agMyyB0oRlErskVYpEsLH4Tgn4mDtTO6Yoq5ZFg0g2rcnnnmX8yM7TSKmLjX8yVP60rL_D6CswUKBGczRAmqrRCMW7PW5pDrU7MP2eL79O3sIe8G7xEPNLTaHgE2x9-Rl2MRwLQLkg1NiUNYtvKmUUb7lVtiS8VwZEAvpzYW4e_AIChclEMSZKZt1D6jd_Rh2FC6u",
    },
    {
      label: "Nhân viên chăm sóc",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQOc89tQ84M3Kglug3j8ZUDeHKZ3_YM5jAvykPeajeMGYKc0veUHp1d2v4QCljRNOkLzYanQ6pq8WlAGL50h2xigyVLUOPv30xjxrR7i0SWzBxdl047hXdBOP9uQCIosdD7KsV9juDLjt7fmhv_VXk00LBNiBxzsRNmh4pkmcsuEaPM47P-bZjvCT-i7IyFvPs2x-EExRC1oUC9cJG32pJ7FJhkcw-j3P-l7iGRZP_xiQdcjKbxZln",
    },
  ];

  return (
    <section
      id="tong-quan"
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs"
    >
      <h2 className="text-sm font-bold text-slate-900 mb-2">
        Giới thiệu về {business?.name || "Happy Pet Cầu Giấy"}
      </h2>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        {business?.description ||
          "Chúng tôi cung cấp các dịch vụ chăm sóc thú cưng toàn diện từ tắm & vệ sinh, grooming, spa thư giãn đến lưu trú qua đêm. Không gian hiện đại, thiết bị tiêu chuẩn quốc tế cùng đội ngũ nhân viên tận tâm sẽ mang lại trải nghiệm tốt nhất cho các bé cưng."}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((item) => (
          <div
            key={item.label}
            className="group cursor-pointer"
          >
            <div className="h-24 rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-100">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <span className="block text-[11px] font-medium text-slate-600 text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

/* =========================
   DỊCH VỤ
========================= */

const FeaturedServices = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: Bath,
      iconColor: "text-blue-500",
      title: "Tắm & vệ sinh",
      price: "150.000đ",
      time: "60 phút",
      tags: ["Cơ bản", "Phổ biến"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOlxaLQ9WvGMIc-DaffDmbBqa0SoJ8DUeXxG9-KRoBGcYrkNZ-LXlPcg-JBrwaiuZSJwreKXQwmjxMoUYrWJAE4RinYIT6VYcTeSein01MRib4C-7ETsMmygUfKiHHYh0Dd5xhWSpmRgW7Mm5NB9VZH5cUOnMXvFpM22mOn44pofFBanJ-JKWhQ40QaeOa5bZH3tXGc4w1-5_u-NwYAckbtfSmgrU2U4ySW7ruFoRsucekwGpXB6Oo",
    },
    {
      icon: Scissors,
      iconColor: "text-red-500",
      title: "Premium Grooming",
      price: "200.000đ",
      time: "90 phút",
      tags: ["Cao cấp", "Phổ biến"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJtr6H0Mu0xriiLIaq9fu8RAh3RyhyEYAJRn5MUedeyip8gVFX04FI1dzR2zL91xQ9NG44Uwyj3yP6GEACVzpuiqSnUg81Z9GaCHUMFbOY-5uE9PV6A0vG2H_MmS192Ua96Roghm4YezBq_jTrmRveeexMfxOFMwa8sGpSti_iDY-z9XTX78835Lk6ZAQdI0SfDM1lNHx6iLL8FnRA-Na46Hg7tmaq4H-ozzzihqLvc3E5_BzRtPs1",
    },
    {
      icon: Flower2,
      iconColor: "text-emerald-500",
      title: "Spa thư giãn",
      price: "250.000đ",
      time: "75 phút",
      tags: ["Thư giãn", "Yêu thích"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmxYbcr5pty_iNqg1rH415dspynf7YXvsI0_GnIp5ZFiAvWHh2Js6kuVRS1aznciQbyXvu9J9dvsA_D-xWxmPHlPsyaJJCOL03dSKt7SizLtgjYVctv3jVWzW0RdXsTs7WjeZkdkHzBAcTO8eGsx4aILW9VH-HkLVZE917cja4KY_Hh1TUYZa-Yk-GpUANpyTDWRYS8fNPUqyWbRsxByQa9rtCc6aArCo7KnrnsMhoP3MKFavtbsny",
    },
    {
      icon: Building2,
      iconColor: "text-amber-500",
      title: "Lưu trú qua đêm",
      price: "280.000đ/ngày",
      time: "Ngày",
      tags: ["Lưu trú", "An toàn"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7k_DL_-ed7wkRfrlHTkI6xn1iu7llkkHhg7WIRbO6zNfYMfATohV8ZTqtkM7n0I-ZSxyOpruy2UmEp-g2adWeC8DOgSyDOdGrOuEQziAG0nH32WAAu8cpyrwkkZEEHLdAmW1W6o_9rqIBUHdjr_jIgQPggj8-vQl7_riYwXhnsyBwYxL7X-dfRdNV9hY4OU4dU6Vp74TZLS0hI6zjxz_sQi4QTPd26PqBSb44zgtBShk12oesFBhj",
    },
  ];

  return (
    <section
      id="dich-vu"
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs"
    >
      <h2 className="text-sm font-bold text-slate-900 mb-4">
        Dịch vụ nổi bật
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.title}
              className="border border-slate-200/90 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start gap-3">

                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-50 relative">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />

                  <span
                    className={`absolute top-1 left-1 bg-white/90 p-0.5 rounded text-[10px] ${service.iconColor} font-bold leading-none`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 truncate">
                    {service.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Từ{" "}
                    <span className="text-emerald-700 font-semibold">
                      {service.price}
                    </span>
                    {" • "}
                    {service.time}
                  </p>

                  <div className="flex gap-1.5 mt-1.5">
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-medium rounded">
                      {service.tags[0]}
                    </span>

                    <span className="text-[9.5px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 font-medium rounded">
                      {service.tags[1]}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/booking")}
                className="mt-2.5 w-full py-1.5 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-[11px] font-semibold transition"
              >
                Chọn dịch vụ
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* =========================
   LỊCH TRỐNG
========================= */

const AvailableSlots = () => {
  const navigate = useNavigate();
  const slots = [
    { time: "09:00", status: "Còn trống", available: true },
    { time: "10:30", status: "Còn trống", available: true },
    { time: "12:00", status: "Đã kín", available: false },
    { time: "14:00", status: "Còn trống", available: true },
    { time: "15:30", status: "Còn trống", available: true },
    { time: "17:00", status: "Còn trống", available: true },
  ];

  return (
    <section
      id="lich-trong"
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs"
    >
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-900">
          Lịch trống hôm nay
        </h2>

        <button
          type="button"
          onClick={() => navigate("/booking")}
          className="text-xs text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1 transition"
        >
          <Calendar className="w-3 h-3" />
          <span>Xem lịch đầy đủ</span>
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => slot.available && navigate("/booking")}
            className={`rounded-xl p-2 text-center transition ${slot.available
                ? "border border-emerald-400 bg-emerald-50/40 hover:bg-emerald-100 text-slate-800 cursor-pointer"
                : "border border-slate-200 bg-slate-50/80 cursor-not-allowed opacity-60 text-slate-400"
              }`}
          >
            <span className="block text-xs font-bold">
              {slot.time}
            </span>

            <span
              className={`block text-[10px] mt-0.5 ${slot.available
                  ? "text-emerald-700 font-medium"
                  : ""
                }`}
            >
              {slot.status}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

/* =========================
   ĐÁNH GIÁ
========================= */

const Reviews = () => {
  const reviews = [
    {
      name: "Minh Anh",
      time: "2 tuần trước",
      comment:
        "Dịch vụ rất tốt, bé nhà mình đi spa về thơm tho và sạch sẽ. Nhân viên nhiệt tình, chu đáo!",
      pet: "Bé Momo",
      type: Dog,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4A6fhVwO7mG_nRf3uNa9g7jFgHRkeFw8SSDJHgep9Q1jaAmphzDAKojkD_M-QLwks-KETsp-TDxozwbDZbQfa5N3teuTIYRlGp8CDrAC9cnKuNaY4_AhDrktRgtFutEx3-LH6DAlezrJAilDWsFFRe4qcIykV7yD6kBTFm9r59cgd0uWX98fsmbd50EmFMAGAPiIV35nMKj9gRo6N3VOcvtBE7ofM-ifL1YOAyfRyvqS0A6jUB1-k",
    },
    {
      name: "Quốc Bảo",
      time: "1 tháng trước",
      comment:
        "Phòng lưu trú sạch sẽ, bé được chăm sóc rất kỹ. Mình rất yên tâm khi gửi bé ở đây.",
      pet: "Bé Bơ",
      type: Cat,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDpJFEMPIXBrr1cSmAM9oKLVbQG5bKrFzMWk8qtu2GkI8Cg-mjSSFV-oVKUxpTIe5EzhvJlJmEXATXp7mIKjlqiETvRHv1umMB755CDtjDfTt2A0SZYc9kOnGqvjNELEIQswamaXHPy3GHbYdzFDjTucKxAaNXmv0dkEuL3E8VkrlBZCEiPwNYMiQTA2rsltfu7RJ1fwsp3kdFK1EOQdQn-VSgHPdmegR2L5wlijshhP9DewHmyE_Q",
    },
    {
      name: "Thu Trang",
      time: "1 tháng trước",
      comment:
        "Grooming đẹp xuất sắc! Bé nhà mình trông rất xinh sau khi được tỉa lông.",
      pet: "Bé Nâu",
      type: Dog,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTza-zj8htWTXQlD881YcrNmCXbbYOfsmIz2o25oYMoZ2KZDCuWjGqcU0OzcUEsHh9KTo4sgmqng56lWf8zFasafgBW0tN0PTXS67n8KuLDs3jSCCzF4CSwcPnH4Db5t1N9FDTIHmxBSM_D3p2X8o5LX2dQR2HQohiVt7OociHwS0zwbhaQ-bQTSHk4fVG_7wtvB-ObuC8t2nv1Bi8t0YSX9tle5cZDw3z5P6vIno8n9jlJ-_vOS2i",
    },
  ];

  return (
    <section
      id="danh-gia"
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs"
    >
      <h2 className="text-sm font-bold text-slate-900 mb-4">
        Đánh giá khách hàng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-5 pb-5 border-b border-slate-100">

        <div className="md:col-span-3 text-center md:text-left md:border-r md:border-slate-100 pr-4">
          <div className="text-3xl font-extrabold text-slate-800">
            4.9
            <span className="text-base text-slate-400 font-medium">
              /5
            </span>
          </div>

          <div className="flex justify-center md:justify-start text-amber-400 text-xs my-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className="w-3.5 h-3.5 fill-current"
              />
            ))}
          </div>

          <p className="text-[11px] text-slate-400">
            Dựa trên 256 đánh giá
          </p>
        </div>

        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {reviews.map((review) => {
            const PetIcon = review.type;

            return (
              <div
                key={review.name}
                className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight">
                        {review.name}
                      </h4>

                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className="w-2.5 h-2.5 fill-current"
                          />
                        ))}
                      </div>
                    </div>

                    <span className="ml-auto text-[9px] text-slate-400">
                      {review.time}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-600 leading-normal line-clamp-2">
                    {review.comment}
                  </p>
                </div>

                <div className="mt-2 text-[9.5px] text-slate-500 flex items-center gap-1">
                  <PetIcon className="w-3 h-3 text-slate-400" />
                  {review.pet}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button className="inline-flex items-center justify-center border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50 px-5 py-2 rounded-lg text-xs font-semibold transition">
          Xem tất cả 256 đánh giá
        </button>
      </div>
    </section>
  );
};

export default BusinessDetail;