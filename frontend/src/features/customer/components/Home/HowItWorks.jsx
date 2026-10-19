import {
  Store,
  ListChecks,
  CalendarDays,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: <Store size={22} className="text-emerald-600" />,
      title: "Chọn cơ sở uy tín",
      desc: "Tìm kiếm spa, grooming, phòng khám thú cưng gần bạn với đầy đủ đánh giá và giấy phép kiểm định.",
      bg: "bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      step: "02",
      icon: <ListChecks size={22} className="text-teal-600" />,
      title: "Chọn gói dịch vụ",
      desc: "Xem bảng giá chi tiết, các gói tắm sấy, tỉa lông, spa thảo dược theo cân nặng và giống thú cưng.",
      bg: "bg-teal-50 group-hover:bg-teal-600 group-hover:text-white",
    },
    {
      step: "03",
      icon: <CalendarDays size={22} className="text-amber-600" />,
      title: "Đặt lịch hẹn online",
      desc: "Chọn ngày và khung giờ thuận tiện, xác nhận lịch hẹn tức thì 24/7 mà không lo phải chờ đợi.",
      bg: "bg-amber-50 group-hover:bg-amber-600 group-hover:text-white",
    },
    {
      step: "04",
      icon: <HeartHandshake size={22} className="text-rose-600" />,
      title: "An tâm theo dõi",
      desc: "Nhận cập nhật hình ảnh, video của bé trong quá trình làm dịch vụ và thanh toán tiện lợi, an toàn.",
      bg: "bg-rose-50 group-hover:bg-rose-600 group-hover:text-white",
    },
  ];

  return (
    <section className="py-10 lg:py-12 bg-gradient-to-b from-white via-emerald-50/20 to-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header - Căn lề trái */}
        <div className="text-left max-w-2xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2.5">
            <span>🐾</span>
            <span>Quy trình nhanh chóng & tiện lợi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Chăm sóc thú cưng chỉ với{" "}
            <span className="text-emerald-600 underline decoration-emerald-200 decoration-wavy underline-offset-4">
              4 bước đơn giản
            </span>
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Nền tảng giúp bạn kết nối với các chuyên gia chăm sóc thú cưng uy tín nhất một cách dễ dàng và minh bạch.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Step indicator top right */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-2xs ${item.bg}`}
                >
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-slate-200 group-hover:text-emerald-500/40 transition-colors tracking-tighter">
                  {item.step}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Decorative bottom bar on hover */}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Chi tiết bước</span>
                <ArrowRight size={13} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;