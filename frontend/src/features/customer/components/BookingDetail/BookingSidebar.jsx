import React from "react";
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const BookingSidebar = () => {
  const policies = [
    "Vui lòng đến đúng giờ. Trễ quá 15 phút có thể ảnh hưởng đến lịch của bạn.",
    "Hủy lịch trước ít nhất 24h để được hoàn tiền đầy đủ.",
    "Đọc kỹ chính sách trước khi đặt lịch.",
  ];

  return (
    <aside className="lg:col-span-4 flex flex-col gap-5">
      
      {/* Appointment policy */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-slate-800 text-[14px] mb-3">
          Chính sách lịch hẹn
        </h3>

        <ul className="space-y-2.5 text-xs text-slate-600">
          {policies.map((policy, index) => (
            <li
              key={index}
              className="flex items-start gap-2"
            >
              <CheckCircle2
                size={14}
                className="text-emerald-600 mt-0.5 shrink-0"
              />

              <span>{policy}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 group"
          >
            <span>Xem chi tiết chính sách</span>

            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>

      {/* Support */}
      <div className="bg-gradient-to-br from-amber-50/70 via-emerald-50/40 to-white rounded-2xl p-5 border border-emerald-100/80 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Cần hỗ trợ?
            </h3>

            <p className="text-xs text-slate-500 mt-0.5 max-w-[170px]">
              Đội ngũ PetCare luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
          </div>

          <div className="relative shrink-0 w-14 h-14">
            <img
              alt="Support Mascot"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMWnzENC1gwQvfxtXodt-VJLIcVjVkxevcHKRvcBBzq7pVHiaz7ZKpnu7QisQ6Z4QRI-ZiMM2UnH_9pZD7WKecCq3bbWaQDmSAvXa714tTs3tAWljSixs34UNe-37wn_EdCX3hfZX8kq_arWcOgCtzD_UBpshxK4dsIHUgQNHcDJM4eVGpCZ2bQLnVclyXbApI-5m0pjEXOlMSVvPY9j8gahuEvuDqxA2g-oWAtWU"
              className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-emerald-200"
            />

            <span className="absolute -top-1 -right-1 text-rose-500 text-xs animate-pulse">
              ❤️
            </span>
          </div>
        </div>

        <button className="w-full mt-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs shadow-sm">
          <MessageCircle size={14} />
          <span>Chat với PetCare</span>
        </button>
      </div>
    </aside>
  );
};

export default BookingSidebar;