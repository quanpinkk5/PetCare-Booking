import { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, ExternalLink, User, LogOut, ChevronDown, GitFork } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/business": "Dashboard",
  "/business/dashboard": "Dashboard",
  "/business/profile": "Hồ sơ cơ sở",
  "/business/branches": "Chi nhánh",
  "/business/services": "Dịch vụ",
  "/business/branch-services": "Dịch vụ chi nhánh",
  "/business/schedule": "Lịch làm việc",
  "/business/bookings": "Bookings",
  "/business/boarding": "Boarding",
  "/business/pet-diary": "Pet Diary",
  "/business/payments": "Thanh toán",
  "/business/messages": "Tin nhắn",
  "/business/reviews": "Đánh giá",
  "/business/notifications": "Thông báo",
};

export default function BusinessOwnerHeader({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const title = PAGE_TITLES[location.pathname] || "Business Portal";

  // Close dropdown on click outside
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
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Mở menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-slate-800">{title}</h2>
      </div>

      {/* <div className="relative hidden w-80 max-w-md md:block">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Tìm kiếm booking, thú cưng, khách hàng..."
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div> */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Link back to Customer storefront */}
        

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate("/business/notifications")}
          aria-label="Thông báo"
          className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Dropdown */}
        <div className="relative border-l border-slate-200 pl-2 sm:pl-3" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex cursor-pointer items-center gap-2 sm:gap-3 rounded-xl p-1 hover:bg-slate-50 transition"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "Avatar"}
                className="h-9 w-9 rounded-full object-cover border border-emerald-200 shadow-xs"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-amber-300 bg-amber-100 text-lg">
                🐶
              </div>
            )}

            <div className="hidden text-left leading-tight sm:block">
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {user?.name || "Happy Pet Cầu Giấy"}
              </p>
              <p className="text-[11px] text-slate-400">
                {user?.roleLabel || "Chủ cơ sở"}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.name || "Happy Pet"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || "petspa.caugiay@gmail.com"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <ExternalLink size={15} />
                  <span>Xem trang khách hàng</span>
                </Link>

                <Link
                  to="/business/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <User size={15} />
                  <span>Hồ sơ cơ sở</span>
                </Link>

                <Link
                  to="/business/branches"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <GitFork size={15} />
                  <span>Chi nhánh</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}