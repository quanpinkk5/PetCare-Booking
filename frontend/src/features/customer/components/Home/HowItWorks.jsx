import {
  Store,
  ListChecks,
  CalendarDays,
  PawPrint,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      icon: <Store size={18} />,
      title: "Chọn cơ sở",
      desc: "Tìm và chọn cơ sở yêu thích gần bạn với đầy đủ thông tin minh bạch.",
    },
    {
      num: 2,
      icon: <ListChecks size={18} />,
      title: "Chọn dịch vụ",
      desc: "Chọn gói dịch vụ phù hợp nhất cho cân nặng và nhu cầu của thú cưng.",
    },
    {
      num: 3,
      icon: <CalendarDays size={18} />,
      title: "Đặt lịch",
      desc: "Chọn khung thời gian rảnh và nhận xác nhận lịch hẹn tức thì.",
    },
    {
      num: 4,
      icon: <PawPrint size={18} />,
      title: "Theo dõi chăm sóc",
      desc: "Cập nhật tình trạng & hình ảnh trong suốt quá trình chăm sóc thú cưng.",
    },
  ];

  return (
    <section className="lg:col-span-4">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Cách hoạt động
      </h2>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="space-y-6 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">

          {steps.map((step) => (
            <div
              key={step.num}
              className="relative flex items-start gap-4"
            >
              {/* Number */}
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-700 font-bold flex items-center justify-center text-sm z-10 shrink-0 bg-white">
                {step.num}
              </div>

              <div>
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                  {step.icon}
                </div>

                <h4 className="text-sm font-bold text-slate-800">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;