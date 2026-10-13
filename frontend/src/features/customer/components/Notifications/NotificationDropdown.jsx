import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  CalendarCheck,
  HeartPulse,
  CreditCard,
  Tag,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Settings
} from "lucide-react";
import { useNotifications } from "../../../../context/NotificationContext";
import { NOTIFICATION_TYPE_CONFIG } from "../../data/notificationsData";

const TYPE_ICONS = {
  booking: CalendarCheck,
  pet_care: HeartPulse,
  payment: CreditCard,
  promotion: Tag,
  review: Star,
  system: ShieldCheck,
};

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [tab, setTab] = useState("all"); // 'all' | 'unread'
  const navigate = useNavigate();

  const filteredItems = notifications.filter((item) => {
    if (tab === "unread") return !item.isRead;
    return true;
  });

  const previewItems = filteredItems.slice(0, 5);

  const handleItemClick = (item) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    onClose();
    if (item.actionUrl) {
      navigate(item.actionUrl);
    } else {
      navigate("/notifications");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
    >
      {/* Header */}
      <div className="p-3.5 px-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-sm">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
              {unreadCount} mới
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              title="Đánh dấu tất cả đã đọc"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CheckCheck size={14} />
              <span className="hidden sm:inline">Đã đọc tất cả</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-100 px-3 pt-2 text-xs font-medium text-slate-500 gap-1 bg-white">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
            tab === "all"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("unread")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            tab === "unread"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          Chưa đọc ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/70">
        {previewItems.length === 0 ? (
          <div className="py-10 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <Bell size={20} />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {tab === "unread" ? "Không có thông báo chưa đọc nào" : "Chưa có thông báo nào"}
            </p>
          </div>
        ) : (
          previewItems.map((item) => {
            const typeConfig = NOTIFICATION_TYPE_CONFIG[item.type] || NOTIFICATION_TYPE_CONFIG.system;
            const Icon = TYPE_ICONS[item.type] || Bell;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                  !item.isRead ? "bg-emerald-50/30" : "bg-white"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border text-xs ${typeConfig.bgColor} ${typeConfig.borderColor} ${typeConfig.color}`}
                >
                  <Icon size={17} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {typeConfig.label}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {item.timeAgo}
                    </span>
                  </div>

                  <h4
                    className={`text-xs leading-snug font-bold line-clamp-1 ${
                      !item.isRead ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {/* Unread indicator */}
                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 px-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          to="/profile"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] transition-colors"
        >
          <Settings size={12} />
          <span>Cài đặt</span>
        </Link>

        <Link
          to="/notifications"
          onClick={onClose}
          className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors group"
        >
          <span>Xem tất cả thông báo</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
