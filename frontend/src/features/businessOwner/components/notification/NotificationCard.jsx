import {
  CalendarCheck,
  Home,
  CreditCard,
  Star,
  MessageSquare,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Trash2,
  Building2,
  User,
  Check,
  AlertTriangle,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG = {
  booking: {
    icon: CalendarCheck,
    label: "Đặt lịch & Dịch vụ",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  boarding: {
    icon: Home,
    label: "Khách sạn lưu trú",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  payment: {
    icon: CreditCard,
    label: "Thanh toán & Doanh thu",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  review: {
    icon: Star,
    label: "Đánh giá của khách",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  message: {
    icon: MessageSquare,
    label: "Tin nhắn khách hàng",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  system: {
    icon: ShieldAlert,
    label: "Cảnh báo hệ thống",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
};

export default function NotificationCard({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onOpenDetail,
}) {
  const navigate = useNavigate();
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const TypeIcon = config.icon;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (notification.actionUrl) {
      if (!notification.isRead) {
        onMarkAsRead(notification.id);
      }
      navigate(notification.actionUrl);
    }
  };

  const handleToggleRead = (e) => {
    e.stopPropagation();
    if (notification.isRead) {
      onMarkAsUnread(notification.id);
    } else {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      onClick={() => onOpenDetail(notification)}
      className={`group relative flex flex-col sm:flex-row items-start gap-4 rounded-3xl border p-4 sm:p-5 transition-all cursor-pointer ${
        notification.isRead
          ? "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs"
          : "border-emerald-200/90 bg-emerald-50/25 shadow-xs hover:border-emerald-300 hover:bg-emerald-50/40"
      } ${isSelected ? "ring-2 ring-emerald-500 bg-emerald-50/40" : ""}`}
    >
      {/* Checkbox & Type Icon container */}
      <div className="flex sm:flex-col items-center gap-2.5 shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(notification.id);
          }}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          aria-label="Chọn thông báo"
        />

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${config.bg} ${config.color} ${config.border}`}
        >
          <TypeIcon size={20} />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 min-w-0 space-y-2.5 w-full">
        {/* Header tags & time */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category tag */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${config.bg} ${config.color} ${config.border}`}
            >
              <TypeIcon size={12} />
              <span>{config.label}</span>
            </span>

            {/* Branch pill */}
            {notification.branch && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <Building2 size={11} className="text-slate-400" />
                <span>{notification.branch}</span>
              </span>
            )}

            {/* Priority tag */}
            {notification.priority === "high" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                <AlertTriangle size={11} />
                <span>Khẩn cấp</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              <span>{notification.timeAgo}</span>
            </span>

            {!notification.isRead && (
              <span
                className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
                title="Chưa đọc"
              />
            )}
          </div>
        </div>

        {/* Title & Message */}
        <div>
          <h4
            className={`text-sm sm:text-base leading-snug transition-colors ${
              notification.isRead
                ? "font-semibold text-slate-800 group-hover:text-emerald-700"
                : "font-bold text-slate-900 group-hover:text-emerald-700"
            }`}
          >
            {notification.title}
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        </div>

        {/* Customer & Pet Snippet / Metadata details */}
        {(notification.customer || notification.petName || notification.metadata) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {notification.customer && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-1 text-slate-700">
                {notification.customerAvatar ? (
                  <img
                    src={notification.customerAvatar}
                    alt={notification.customer}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                ) : (
                  <User size={13} className="text-slate-400" />
                )}
                <span className="font-semibold">{notification.customer}</span>
                {notification.customerPhone && (
                  <span className="text-slate-400 font-normal">
                    ({notification.customerPhone})
                  </span>
                )}
              </div>
            )}

            {notification.petName && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50/50 px-2.5 py-1 text-emerald-800">
                <span className="text-sm">{notification.petAvatar || "🐾"}</span>
                <span className="font-semibold">{notification.petName}</span>
                {notification.petType && (
                  <span className="text-emerald-600/80 font-normal">
                    • {notification.petType}
                  </span>
                )}
              </div>
            )}

            {notification.metadata?.bookingId && (
              <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
                #{notification.metadata.bookingId}
              </span>
            )}

            {notification.metadata?.amount && (
              <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                {notification.metadata.amount}
              </span>
            )}

            {notification.metadata?.rating && (
              <span className="inline-flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                <span>{notification.metadata.rating}</span>
                <Star size={11} className="fill-amber-500 text-amber-500" />
              </span>
            )}
          </div>
        )}

        {/* Action button row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100/80">
          <div className="flex flex-wrap items-center gap-2">
            {notification.actionLabel && (
              <button
                type="button"
                onClick={handleActionClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                <span>{notification.actionLabel}</span>
                <ArrowRight size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(notification);
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Info size={13} className="text-slate-400" />
              <span>Xem chi tiết</span>
            </button>
          </div>

          {/* Quick Item Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleRead}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                notification.isRead
                  ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  : "text-emerald-600 hover:bg-emerald-100/70"
              }`}
              title={notification.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
            >
              {notification.isRead ? <Circle size={15} /> : <CheckCircle2 size={16} />}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
              title="Xóa thông báo này"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
