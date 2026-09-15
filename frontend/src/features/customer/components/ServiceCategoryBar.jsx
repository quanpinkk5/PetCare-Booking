import {
  Bath,
  Scissors,
  Sparkles,
  Package,
  Moon,
} from "lucide-react";

const ServiceCategoryBar = () => {
  const services = [
    {
      icon: <Bath size={24} />,
      name: "Tắm & vệ sinh",
    },
    {
      icon: <Scissors size={24} />,
      name: "Grooming",
    },
    {
      icon: <Sparkles size={24} />,
      name: "Spa",
    },
    {
      icon: <Package size={24} />,
      name: "Gửi thú cưng",
    },
    {
      icon: <Moon size={24} />,
      name: "Lưu trú qua đêm",
    },
    {
      icon: <Sparkles size={24} />,
      name: "Cắt móng",
    },
  ];

  return (
    <section className="relative -mt-8 z-30 max-w-[1240px] mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 text-center">
          {services.map((service, index) => (
            <a
              key={index}
              href="#"
              className="group p-3 rounded-2xl hover:bg-emerald-50/80 transition-all flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                {service.icon}
              </div>

              <span className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                {service.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategoryBar;