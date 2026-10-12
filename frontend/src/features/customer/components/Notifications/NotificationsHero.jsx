import { Link } from "react-router-dom";
import {
  PawPrint,
  Bell,
  CheckCheck,
  Settings,
  Sparkles,
  CalendarCheck,
  HeartPulse
} from "lucide-react";

const NotificationsHero = ({
  totalCount = 0,
  unreadCount = 0,
  bookingCount = 0,
  petCareCount = 0,
  onMarkAllAsRead,
  onResetNotifications,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-[#E7F8F2] via-[#EEF9F5] to-[#F6FAF8] pt-8 pb-10 overflow-hidden border-b border-teal-50/60">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Paws */}
      <div className="absolute top-10 left-8 text-teal-200/40 pointer-events-none select-none -rotate-12">
        <PawPrint size={90} />
      </div>
      <div className="absolute right-12 bottom-6 text-teal-200/30 pointer-events-none select-none rotate-45">
        <PawPrint size={75} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
          {/* Left Text */}
          <div className="flex-1 space-y-3">
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link to="/" className="hover:text-teal-600 transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/profile" className="hover:text-teal-600 transition-colors">
                Tài khoản
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-semibold">
                Thông báo
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-800 text-xs font-semibold shadow-2xs">
              <Bell size={14} className="text-emerald-600 animate-pulse" />
              <span>Trung tâm cập nhật thời gian thực</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Thông báo{" "}
              <span className="text-emerald-600">
                của bạn
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              Theo dõi sát sao lịch hẹn, lời nhắc sức khỏe định kỳ cho thú cưng, trạng thái hóa đơn thanh toán và các chương trình ưu đãi đặc quyền.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium text-sm shadow-xs transition-all hover:shadow-md cursor-pointer"
              >
                <CheckCheck size={16} />
                <span>Đánh dấu đã đọc tất cả</span>
              </button>
            )}

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm shadow-xs transition-all hover:shadow-md"
            >
              <Settings size={16} className="text-slate-500" />
              <span>Cài đặt thông báo</span>
            </Link>

            <button
              onClick={onResetNotifications}
              title="Khôi phục thông báo mặc định ban đầu"
              className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 ml-1 cursor-pointer"
            >
              Làm mới mẫu
            </button>
          </div>
        </div>

        {/* Stats Row */}
        
      </div>
    </section>
  );
};

export default NotificationsHero;
