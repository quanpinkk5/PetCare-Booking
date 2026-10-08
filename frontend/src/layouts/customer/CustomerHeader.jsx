import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  PawPrint,
  Bell,
  ChevronDown,
  CalendarCheck,
  User,
  LogOut,
  Clock,
  CreditCard,
  Star,
  Dog
} from "lucide-react";

const CustomerHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <PawPrint size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            PetCare <span className="text-emerald-600">Booking</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          {["/", "/businesses", "/services", "/booking"].map((path, index) => {
            const labels = ["Trang chủ", "Cơ sở", "Dịch vụ", "Đặt lịch"];
            return (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-emerald-600 font-semibold relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:rounded-full"
                    : "hover:text-emerald-600 transition-colors py-1"
                }
              >
                {labels[index]}
              </NavLink>
            );
          })}
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

          {/* User Dropdown */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-1 cursor-pointer focus:outline-none hover:bg-slate-50 p-1 rounded-lg transition-colors"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy41SEghjD-Su0C0GIDKStQMA6XwhIz7_0OYuczV-ao5uFnR1gsVRb3EXzhrO95-UaVPo7bZv1SXgIrincJFkxhtbLAaFJOF64Abnq7U6WSP1fm6W20bYukp4qPUonnwxDJPbLdNzuXZCA52IxbGWfQlrgLu_vk9glp5yioJe4V_F9urI-KR1Uc2bmb27r8AODOGs99EaD5FJ5fLMReu4N7bIfg_Zq-1LLG_pnP_homvuDvPdy1dk_"
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
              />
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu Items */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <User size={16} /> Thông tin cá nhân
                </Link>
                <Link
                  to="/my-pets"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <Dog size={16} /> Thú cưng của tôi
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <Clock size={16} /> Lịch đặt của tôi
                </Link>
                <Link
                  to="/billing"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <CreditCard size={16} /> Lịch sử thanh toán
                </Link>
                <Link
                  to="/reviews"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <Star size={16} /> Đánh giá của tôi
                </Link>
                
                <div className="h-px bg-slate-100 my-1 mx-4"></div>
                
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Booking Button */}
          <Link
            to="/booking"
            className="ml-2 hidden sm:inline-flex items-center gap-2 bg-[#f05252] hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/30 text-sm"
          >
            <CalendarCheck size={18} />
            <span>Đặt lịch ngay</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;