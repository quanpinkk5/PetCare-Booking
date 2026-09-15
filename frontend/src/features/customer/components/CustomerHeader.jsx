import {
  PawPrint,
  Bell,
  ChevronDown,
  CalendarCheck,
} from "lucide-react";

const CustomerHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <PawPrint size={24} />
          </div>

          <span className="text-2xl font-bold tracking-tight text-slate-800">
            PetCare <span className="text-emerald-600">Booking</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <a
            href="#"
            className="text-emerald-600 font-semibold relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:rounded-full"
          >
            Trang chủ
          </a>

          <a
            href="#"
            className="hover:text-emerald-600 transition-colors"
          >
            Dịch vụ
          </a>

          <a
            href="#"
            className="hover:text-emerald-600 transition-colors"
          >
            Cơ sở
          </a>

          <a
            href="#"
            className="hover:text-emerald-600 transition-colors"
          >
            Đặt lịch
          </a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button
            aria-label="Thông báo"
            className="relative w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Bell size={20} />

            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              3
            </span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy41SEghjD-Su0C0GIDKStQMA6XwhIz7_0OYuczV-ao5uFnR1gsVRb3EXzhrO95-UaVPo7bZv1SXgIrincJFkxhtbLAaFJOF64Abnq7U6WSP1fm6W20bYukp4qPUonnwxDJPbLdNzuXZCA52IxbGWfQlrgLu_vk9glp5yioJe4V_F9urI-KR1Uc2bmb27r8AODOGs99EaD5FJ5fLMReu4N7bIfg_Zq-1LLG_pnP_homvuDvPdy1dk_"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
            />

            <ChevronDown
              size={14}
              className="text-slate-400"
            />
          </div>

          {/* Booking Button */}
          <a
            href="#dat-lich"
            className="ml-2 hidden sm:inline-flex items-center gap-2 bg-[#f05252] hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/30 text-sm"
          >
            <CalendarCheck size={18} />
            <span>Đặt lịch ngay</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;