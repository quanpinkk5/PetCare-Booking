import { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  CalendarCheck,
  CreditCard,
  HeartPulse,
  Tag,
  Star,
  ShieldCheck,
  Clock,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  Circle,
  Trash2,
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

const NotificationDetailModal = ({
  notification,
  isOpen,
  onClose,
  onToggleRead,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !notification) return null;

  const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.system;
  const Icon = TYPE_ICONS[notification.type] || ShieldCheck;

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${typeConfig.bgColor} ${typeConfig.borderColor} ${typeConfig.color}`}
            >
              <Icon size={24} />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeConfig.badgeClass}`}>
                  {typeConfig.label}
                </span>
                {notification.priority === "high" && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <AlertCircle size={10} />
                    Quan trọng
                  </span>
                )}
                {notification.petName && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    🐾 Bé {notification.petName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                <span>{notification.timeAgo}</span>
                {notification.createdAt && (
                  <span className="text-slate-400 ml-1">
                    • {new Date(notification.createdAt).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Main Title */}
          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {notification.title}
          </h2>

          {/* Message & Detailed explanation */}
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
            <p className="font-medium text-slate-800">{notification.message}</p>
            {notification.detail && (
              <p className="text-slate-600 text-xs sm:text-sm pt-2 border-t border-slate-200/60 leading-relaxed">
                {notification.detail}
              </p>
            )}
          </div>

          {/* Metadata Display Cards */}
          {notification.metadata && (
            <div className="space-y-2 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/80">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Thông tin chi tiết liên quan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {notification.metadata.bookingId && (
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[11px]">Mã lịch hẹn:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {notification.metadata.bookingId}
                    </span>
                  </div>
                )}

                {notification.metadata.facility && (
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100 sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Cơ sở thực hiện:</span>
                    <span className="font-semibold text-slate-800">
                      {notification.metadata.facility}
                    </span>
                  </div>
                )}

                {notification.metadata.appointmentTime && (
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100 sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Thời gian hẹn:</span>
                    <span className="font-semibold text-emerald-700">
                      {notification.metadata.appointmentTime}
                    </span>
                  </div>
                )}

                {notification.metadata.transactionId && (
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[11px]">Mã giao dịch:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {notification.metadata.transactionId}
                    </span>
                  </div>
                )}

                {notification.metadata.amount && (
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[11px]">Số tiền:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {notification.metadata.amount}
                    </span>
                  </div>
                )}

                {notification.metadata.vaccineName && (
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100 sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Loại vắc-xin:</span>
                    <span className="font-semibold text-slate-800">
                      {notification.metadata.vaccineName}
                    </span>
                  </div>
                )}

                {/* Voucher code special box */}
                {notification.metadata.couponCode && (
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-amber-800 font-medium block text-[11px]">Mã ưu đãi:</span>
                      <span className="text-base font-bold font-mono tracking-wider text-amber-900">
                        {notification.metadata.couponCode}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(notification.metadata.couponCode)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium text-xs shadow-xs hover:bg-amber-100/50 cursor-pointer transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleRead(notification.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              {notification.isRead ? (
                <>
                  <Circle size={14} className="text-emerald-600" />
                  <span>Đổi thành Chưa đọc</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>Đã đọc</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onDelete(notification.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-100/60 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Xóa</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              Đóng
            </button>

            {notification.actionUrl && (
              <Link
                to={notification.actionUrl}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>{notification.actionLabel || "Truy cập"}</span>
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
