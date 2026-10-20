import { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Bell, ChevronDown, LogOut, UserRound } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { adminNotificationApi } from "../../features/admin/services/adminNotificationApi";

// Lưu ý:
// Nếu đường dẫn AuthContext trong dự án khác,
// chỉnh lại duy nhất dòng import useAuth phía trên.

export default function AdminHeader({ title = "Tổng quan hệ thống" }) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuRef = useRef(null);

  // ======================================
  // 1. ĐẾM THÔNG BÁO CHƯA ĐỌC
  // ======================================
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    const fetchUnreadCount = async () => {
      try {
        const response = await adminNotificationApi.getUnreadCount();

        if (cancelled) return;

        if (
          response?.success === false ||
          typeof response?.data?.unreadCount !== "number"
        ) {
          throw new Error(
            response?.message || "Không thể tải số thông báo chưa đọc.",
          );
        }

        setUnreadCount(Math.max(0, response.data.unreadCount));
      } catch (error) {
        if (!cancelled) {
          console.error("Get unread notification count:", error);

          setUnreadCount(0);
        }
      }
    };

    fetchUnreadCount();

    // Làm mới số thông báo khi Admin quay
    // lại tab trình duyệt.
    const handleFocus = () => {
      fetchUnreadCount();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?._id, user?.role, location.pathname]);

  // ======================================
  // 2. ĐÓNG MENU KHI CLICK RA NGOÀI
  // ======================================
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleMouseDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  // ======================================
  // 3. ĐĂNG XUẤT
  // ======================================
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();

      setIsMenuOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const adminName = user?.fullName?.trim() || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white px-8">
      {/* ==============================
          TIÊU ĐỀ TRANG
      =============================== */}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      {/* ==============================
          USER ACTIONS
      =============================== */}
      <div className="flex items-center gap-5">
        {/* CHUÔNG THÔNG BÁO */}
        <Link
          to="/admin/notifications"
          className="relative cursor-pointer p-2 text-slate-500 transition-colors hover:text-slate-700"
          title={
            unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Thông báo"
          }
          aria-label={`Thông báo: ${unreadCount} chưa đọc`}
        >
          <Bell className="h-6 w-6" />

          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-0.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* ADMIN PROFILE */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            className="flex cursor-pointer items-center gap-3 rounded-xl pl-2 transition-colors hover:bg-slate-50"
          >
            {/* AVATAR */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={adminName}
                className="h-9 w-9 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
                <UserRound className="h-5 w-5" />
              </div>
            )}

            {/* ADMIN NAME */}
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-sm font-semibold text-slate-800">
                {adminName}
              </div>

              <div className="text-xs text-slate-400">Quản trị viên</div>
            </div>

            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            >
              {/* ACCOUNT INFO */}
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {adminName}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {user?.email || "Quản trị viên"}
                </p>
              </div>

              {/* LOGOUT */}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />

                <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
