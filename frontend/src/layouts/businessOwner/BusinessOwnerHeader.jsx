import CustomerAvatar from "../../features/customer/components/CustomerAvatar.jsx";
import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ExternalLink, User, LogOut, ChevronDown, GitFork } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBusinessNotifications } from "../../context/BusinessNotificationContext";

const PAGE_TITLES = {
  "/business": "Đặt lịch",
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
  const { user, logout, updateUser } = useAuth();
  const { unreadCount } = useBusinessNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarInputRef = useRef(null);
  const avatarSavingRef = useRef(false);
  const [isAvatarSaving, setIsAvatarSaving] = useState(false);
  const [avatarNotice, setAvatarNotice] = useState(null);

  const changeAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || avatarSavingRef.current) return;
    setAvatarNotice(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 256 * 1024) {
      setAvatarNotice({ error: true, message: 'Chọn ảnh PNG, JPEG hoặc WebP tối đa 256 KB.' });
      return;
    }
    avatarSavingRef.current = true;
    setIsAvatarSaving(true);
    try {
      const avatar = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Không thể đọc ảnh đã chọn.'));
        reader.readAsDataURL(file);
      });
      const result = await updateUser({ avatar });
      setAvatarNotice({ error: !result.success, message: result.success ? 'Đã lưu ảnh đại diện.' : result.error });
    } catch (error) {
      setAvatarNotice({ error: true, message: error.message || 'Không thể lưu ảnh đại diện.' });
    } finally {
      avatarSavingRef.current = false;
      setIsAvatarSaving(false);
    }
  };



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
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative border-l border-slate-200 pl-2 sm:pl-3" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex cursor-pointer items-center gap-2 sm:gap-3 rounded-xl p-1 hover:bg-slate-50 transition"
          >
            <CustomerAvatar user={user} className="h-9 w-9 border border-emerald-200 shadow-xs text-sm" />

            <div className="hidden text-left leading-tight sm:block">
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {user?.fullName || user?.name || "Chủ cơ sở"}
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

          <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Chọn ảnh đại diện chủ cơ sở" className="hidden" onChange={changeAvatar} />
          {avatarNotice && <div role={avatarNotice.error ? 'alert' : 'status'} className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-lg">
            <p>{avatarNotice.message}</p>
            <button type="button" onClick={() => setAvatarNotice(null)} className="mt-2 font-semibold text-emerald-700">Đóng</button>
          </div>}

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.fullName || user?.name || "Chủ cơ sở"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || ""}
                </p>
              </div>

              <div className="py-1">
                <button type="button" disabled={isAvatarSaving} onClick={() => {
                  setAvatarNotice(null);
                  setIsDropdownOpen(false);
                  avatarInputRef.current?.click();
                }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 disabled:opacity-50 cursor-pointer">
                  <User size={15} /><span>{isAvatarSaving ? 'Đang lưu ảnh...' : 'Đổi ảnh đại diện'}</span>
                </button>
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