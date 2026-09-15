import {
  PawPrint,
  Globe,
  Camera,
  Smartphone,
  Play,
  Phone,
  Mail,
  MapPin,
  Dog,
} from "lucide-react";

const CustomerFooter = () => {
  return (
    <footer className="bg-[#f7faf8] border-t border-slate-200/80 pt-12 pb-8 mt-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">

          {/* Brand */}
          <div className="md:col-span-4 pr-4">
            <a
              href="#"
              className="flex items-center gap-2 mb-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <PawPrint size={18} />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-800">
                PetCare <span className="text-emerald-600">Booking</span>
              </span>
            </a>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-4">
              Nền tảng đặt dịch vụ chăm sóc thú cưng uy tín, kết nối bạn với hàng trăm cơ sở chất lượng trên toàn quốc.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2.5 text-slate-500">
              {[Globe, Camera, Smartphone, Play].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <Icon size={14} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Hỗ trợ
            </h4>

            <ul className="space-y-2 text-xs text-slate-600">
              {[
                "Trung tâm hỗ trợ",
                "Hướng dẫn đặt lịch",
                "Chính sách bảo mật",
                "Điều khoản sử dụng",
                "Liên hệ hỗ trợ",
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Dịch vụ
            </h4>

            <ul className="space-y-2 text-xs text-slate-600">
              {[
                "Tắm & vệ sinh",
                "Grooming",
                "Spa",
                "Gửi thú cưng",
                "Lưu trú qua đêm",
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Liên hệ
            </h4>

            <div className="space-y-2 text-xs text-slate-600 mb-5">

              <p className="flex items-center gap-2">
                <Phone
                  size={14}
                  className="text-emerald-600"
                />

                <span className="font-bold text-slate-800">
                  1900 63 60 61
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Mail
                  size={14}
                  className="text-emerald-600"
                />

                <span>
                  support@petcarebooking.vn
                </span>
              </p>

              <p className="flex items-start gap-2">
                <MapPin
                  size={14}
                  className="text-emerald-600 mt-0.5"
                />

                <span>
                  123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </span>
              </p>
            </div>

            {/* App */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="pr-2">

                <p className="text-xs font-bold text-slate-800">
                  Tải ứng dụng PetCare Booking
                </p>

                <p className="text-[11px] text-slate-500 mb-2.5">
                  Đặt lịch mọi lúc mọi nơi!
                </p>

                <div className="flex items-center gap-2">

                  <a
                    href="#"
                    className="bg-slate-900 text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1.5 hover:bg-slate-800"
                  >
                    <Smartphone size={12} />
                    App Store
                  </a>

                  <a
                    href="#"
                    className="bg-slate-900 text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1.5 hover:bg-slate-800"
                  >
                    <Play size={12} />
                    Google Play
                  </a>

                </div>
              </div>

              <div className="w-14 h-14 bg-emerald-100/70 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                <Dog size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          © 2024 PetCare Booking. Tất cả quyền được bảo lưu.
        </div>

      </div>
    </footer>
  );
};

export default CustomerFooter;