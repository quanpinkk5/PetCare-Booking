import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  Clock,
  RotateCcw,
  ShieldCheck,
  X,
  FileText,
} from "lucide-react";

const BookingSidebar = () => {
  const navigate = useNavigate();
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const policyItems = [
    {
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
      text: "Vui lòng đến đúng giờ. Trễ quá 15 phút cơ sở có thể phải sắp xếp lại lịch hẹn.",
    },
    {
      icon: RotateCcw,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      text: "Hủy hoặc đổi lịch trước ít nhất 24h để được hoàn trả 100% chi phí.",
    },
    {
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      text: "Bé cần được tiêm phòng cơ bản đầy đủ trước khi sử dụng dịch vụ tại spa.",
    },
  ];

  return (
    <>
      <aside className="flex flex-col gap-5">
        {/* Appointment policy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileText size={15} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Chính sách lịch hẹn
              </h3>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
              Quy chuẩn PetCare
            </span>
          </div>

          <ul className="space-y-3 text-xs text-slate-600">
            {policyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="flex items-start gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-md ${item.bg} ${item.color} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon size={12} />
                  </div>
                  <span className="leading-relaxed text-[11px] text-slate-700">
                    {item.text}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPolicyModalOpen(true)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 group cursor-pointer transition-colors"
            >
              <span>Xem chi tiết quy chế & an toàn</span>
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-br from-amber-50/70 via-emerald-50/40 to-white rounded-2xl p-5 border border-emerald-100/80 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Hỗ trợ trực tuyến 24/7
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Cần hỗ trợ đơn này?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-[190px]">
                Đội ngũ chăm sóc khách hàng PetCare luôn túc trực hỗ trợ bạn.
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

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate("/messages")}
              className="w-full bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition text-xs shadow-2xs cursor-pointer"
            >
              <MessageCircle size={14} />
              <span>Chat với CSKH PetCare</span>
            </button>

            <a
              href="tel:19001234"
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition text-[11px] text-center"
            >
              <PhoneCall size={12} className="text-emerald-600" />
              <span>Hotline miễn cước: 1900 1234</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Policy Modal */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base leading-tight">
                    Chính sách & Quy định lịch hẹn
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hệ thống đặt lịch chăm sóc thú cưng PetCare
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100/70 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-amber-800">
                  <Clock size={14} className="text-amber-600" />
                  1. Quy định thời gian & giờ hẹn
                </h4>
                <p className="text-[11px] text-slate-600">
                  Vui lòng đưa bé đến trước giờ hẹn 5-10 phút. Trường hợp đến muộn quá 15 phút mà không thông báo trước, cơ sở có thể phải sắp xếp lại lịch sang ca tiếp theo để không ảnh hưởng đến thú cưng khác.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/70 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-emerald-800">
                  <RotateCcw size={14} className="text-emerald-600" />
                  2. Quy định đổi / hủy lịch & hoàn tiền
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>
                    <strong>Hủy trước 24 giờ:</strong> Hoàn trả 100% chi phí qua phương thức thanh toán ban đầu.
                  </li>
                  <li>
                    <strong>Hủy trong vòng 12 - 24 giờ:</strong> Miễn phí dời lịch hẹn sang ngày khác trong vòng 7 ngày.
                  </li>
                  <li>
                    <strong>Hủy dưới 12 giờ hoặc vắng mặt:</strong> Áp dụng phí giữ chỗ 30% để hỗ trợ ca trực của kỹ thuật viên.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/70 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-blue-800">
                  <ShieldCheck size={14} className="text-blue-600" />
                  3. Tiêu chuẩn an toàn & sức khỏe thú cưng
                </h4>
                <p className="text-[11px] text-slate-600">
                  Thú cưng cần được tiêm phòng tối thiểu 2 mũi cơ bản và ngừa dại. Cơ sở từ chối tiếp nhận các bé đang mắc bệnh truyền nhiễm cấp tính để bảo vệ môi trường an toàn chung cho toàn bộ thú cưng.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-600" />
                  4. Cam kết bảo đảm dịch vụ
                </h4>
                <p className="text-[11px] text-slate-600">
                  Tất cả quy trình tắm spa, cắt tỉa và lưu trú đều được camera giám sát 24/7 và thực hiện bởi chuyên viên có chứng chỉ hành nghề. PetCare chịu hoàn toàn trách nhiệm bảo đảm sức khỏe cho bé trong suốt thời gian dịch vụ.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
              >
                Đã hiểu & Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSidebar;