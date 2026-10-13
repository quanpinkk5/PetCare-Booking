import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CreditCard,
  HeartPulse,
  Tag,
  Star,
  ShieldCheck,
  Clock,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  Circle,
  Trash2,
  Eye,
  AlertCircle
} from "lucide-react";
import { NOTIFICATION_TYPE_CONFIG } from "../../data/notificationsData";

const TYPE_ICONS = {
  booking: CalendarCheck,
  pet_care: HeartPulse,
  payment: CreditCard,
  promotion: Tag,
  review: Star,
  system: ShieldCheck,
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onOpenDetail,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.system;
  const Icon = TYPE_ICONS[notification.type] || ShieldCheck;

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const handleCardClick = (e) => {
    // If clicking on an action button, link or menu, ignore card click
    if (e.target.closest("button") || e.target.closest("a")) return;
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onOpenDetail(notification);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer p-4 sm:p-5 ${
        !notification.isRead
          ? "bg-emerald-50/40 border-emerald-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md"
          : "bg-white border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Type Icon / Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105 ${
              typeConfig.bgColor
            } ${typeConfig.borderColor} ${typeConfig.color}`}
          >
            <Icon size={22} />
          </div>

          {/* Unread Glowing Dot */}
          {!notification.isRead && (
            <span
              title="Chưa đọc"
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 ring-2 ring-white rounded-full animate-pulse"
            />
          )}
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Top metadata tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category tag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium border text-[11px] ${typeConfig.badgeClass}`}
            >
              {typeConfig.label}
            </span>

            {/* High priority badge */}
            {notification.priority === "high" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] bg-rose-100 text-rose-700 border border-rose-200">
                <AlertCircle size={11} />
                Quan trọng
              </span>
            )}

            {/* Pet info tag */}
            {notification.petName && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/70">
                {notification.petAvatar ? (
                  <img
                    src={notification.petAvatar}
                    alt={notification.petName}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                ) : (
                  <span>🐾</span>
                )}
                <span>Bé {notification.petName}</span>
              </span>
            )}

            {/* Time */}
            <span className="inline-flex items-center gap-1 text-slate-400 text-xs ml-auto">
              <Clock size={12} />
              <span>{notification.timeAgo}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base tracking-tight font-bold transition-colors ${
              !notification.isRead
                ? "text-slate-900 group-hover:text-emerald-700"
                : "text-slate-700 group-hover:text-slate-900"
            }`}
          >
            {notification.title}
          </h3>

          {/* Message summary */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          {/* Extra metadata preview snippet if present */}
          {notification.metadata?.appointmentTime && (
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                ⏰ {notification.metadata.appointmentTime}
              </span>
              {notification.metadata.facility && (
                <span className="truncate text-slate-500">
                  📍 {notification.metadata.facility}
                </span>
              )}
            </div>
          )}

          {notification.metadata?.couponCode && (
            <div className="pt-1 flex items-center gap-2 text-xs">
              <span className="font-mono font-bold tracking-wider px-2 py-0.5 bg-amber-100/80 text-amber-800 border border-dashed border-amber-300 rounded-md">
                🎟️ {notification.metadata.couponCode}
              </span>
              <span className="text-slate-500">
                HSD: {notification.metadata.expiryDate}
              </span>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {notification.actionUrl && (
                <Link
                  to={notification.actionUrl}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!notification.isRead) onMarkAsRead(notification.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-2xs hover:shadow-sm transition-all"
                >
                  <span>{notification.actionLabel || "Xem ngay"}</span>
                  <ExternalLink size={12} />
                </Link>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(notification);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
              >
                <Eye size={12} />
                <span>Chi tiết</span>
              </button>
            </div>

            {/* Quick Status Pill */}
            <span
              className={`text-[11px] font-medium hidden sm:inline-flex items-center gap-1 ${
                notification.isRead ? "text-slate-400" : "text-emerald-600 font-semibold"
              }`}
            >
              {notification.isRead ? "Đã đọc" : "Chưa đọc"}
            </span>
          </div>
        </div>

        {/* Options 3-dots Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Tùy chọn thông báo"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(notification);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Eye size={14} className="text-slate-400" />
                <span>Xem chi tiết</span>
              </button>

              {notification.isRead ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsUnread(notification.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Circle size={14} className="text-emerald-600" />
                  <span>Đánh dấu chưa đọc</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>Đánh dấu đã đọc</span>
                </button>
              )}

              <div className="h-px bg-slate-100 my-1" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Xóa thông báo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
