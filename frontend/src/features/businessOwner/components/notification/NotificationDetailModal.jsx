import {
  X,
  CalendarCheck,
  Home,
  CreditCard,
  Star,
  MessageSquare,
  ShieldAlert,
  Clock,
  Building2,
  User,
  ArrowRight,
  CheckCircle2,
  Circle,
  Trash2,
  AlertTriangle,
  Phone,
  FileText
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

export default function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onToggleRead,
  onDelete,
}) {
  const navigate = useNavigate();

  if (!isOpen || !notification) return null;

  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const TypeIcon = config.icon;

  const handleAction = () => {
    if (notification.actionUrl) {
      if (!notification.isRead) {
        onToggleRead(notification.id);
      }
      onClose();
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="custom-scrollbar relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 bg-slate-50/50">
          <div className="flex items-start gap-3.5 pr-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${config.bg} ${config.color} ${config.border}`}
            >
              <TypeIcon size={22} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${config.bg} ${config.color} ${config.border}`}
                >
                  <TypeIcon size={12} />
                  <span>{config.label}</span>
                </span>

                {notification.branch && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    <Building2 size={11} className="text-slate-400" />
                    <span>{notification.branch}</span>
                  </span>
                )}

                {notification.priority === "high" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    <AlertTriangle size={11} />
                    <span>Khẩn cấp</span>
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {notification.title}
              </h3>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <Clock size={12} />
                <span>{notification.timeAgo}</span>
                {notification.createdAt && (
                  <span>
                    • {new Date(notification.createdAt).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 p-5 sm:p-6 text-sm">
          {/* Main Content Box */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nội dung thông báo
            </h4>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {notification.message}
            </p>
            {notification.detail && (
              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                {notification.detail}
              </p>
            )}
          </div>

          {/* Customer & Pet Details */}
          {(notification.customer || notification.petName) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Customer Box */}
              {notification.customer && (
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <User size={13} className="text-slate-400" />
                    <span>Khách hàng</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {notification.customerAvatar ? (
                      <img
                        src={notification.customerAvatar}
                        alt={notification.customer}
                        className="h-10 w-10 rounded-full object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                        {notification.customer.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {notification.customer}
                      </p>
                      {notification.customerPhone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone size={11} className="text-slate-400" />
                          <span>{notification.customerPhone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pet Box */}
              {notification.petName && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <span>🐾 Thú cưng phục vụ</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-emerald-200 text-xl shadow-2xs">
                      {notification.petAvatar || "🐶"}
                    </div>
                    <div>
                      <p className="font-bold text-emerald-950 text-sm">
                        {notification.petName}
                      </p>
                      {notification.petType && (
                        <p className="text-xs text-emerald-700 mt-0.5">
                          {notification.petType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata Breakdown */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <FileText size={13} className="text-slate-400" />
                <span>Chi tiết tham chiếu</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(notification.metadata).map(([key, val]) => {
                  const labels = {
                    bookingId: "Mã lịch hẹn",
                    service: "Dịch vụ",
                    appointmentTime: "Thời gian hẹn",
                    deposit: "Tiền đặt cọc",
                    totalPrice: "Tổng hóa đơn",
                    note: "Ghi chú của khách",
                    roomId: "Mã phòng lưu trú",
                    checkInDate: "Thời gian nhận phòng",
                    checkOutDate: "Thời gian trả phòng",
                    status: "Trạng thái",
                    totalCost: "Tổng chi phí",
                    specialCare: "Chăm sóc đặc biệt",
                    transactionId: "Mã giao dịch",
                    amount: "Số tiền",
                    method: "Phương thức",
                    gateway: "Cổng thanh toán",
                    time: "Thời gian GD",
                    rating: "Điểm đánh giá",
                    reviewId: "Mã đánh giá",
                    staffAssigned: "Nhân viên tiếp nhận",
                    checkInTime: "Thời điểm check-in",
                    currentBookings: "Số booking hiện tại",
                    maxCapacity: "Công suất tối đa",
                    utilizationRate: "Tỷ lệ lấp đầy",
                    recommendation: "Khuyến nghị xử lý",
                  };

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100"
                    >
                      <span className="text-slate-500">{labels[key] || key}:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {typeof val === "string" || typeof val === "number"
                          ? String(val)
                          : JSON.stringify(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(notification.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {notification.isRead ? (
                <>
                  <Circle size={14} className="text-slate-400" />
                  <span>Đánh dấu chưa đọc</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Đánh dấu đã đọc</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Xóa</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {notification.actionLabel && (
              <button
                type="button"
                onClick={handleAction}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
              >
                <span>{notification.actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
