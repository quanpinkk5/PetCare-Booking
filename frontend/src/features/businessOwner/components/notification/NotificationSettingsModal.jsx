import { useState } from "react";
import {
  X,
  Volume2,
  VolumeX,
  Bell,
  Mail,
  CalendarCheck,
  CalendarX,
  Home,
  Star,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  Check
} from "lucide-react";

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) {
  const [formData, setFormData] = useState(settings || {});
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const toggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const toggleItems = [
    {
      group: "Kênh nhận thông báo",
      items: [
        {
          key: "soundEnabled",
          title: "Âm thanh thông báo",
          desc: "Phát chuông thông báo khi có đặt lịch hoặc tin nhắn mới",
          icon: formData.soundEnabled ? Volume2 : VolumeX,
          color: "text-emerald-600 bg-emerald-50",
        },
        {
          key: "desktopAlert",
          title: "Thông báo đẩy trên trình duyệt",
          desc: "Hiển thị pop-up góc màn hình kể cả khi đang ở tab khác",
          icon: Bell,
          color: "text-blue-600 bg-blue-50",
        },
        {
          key: "emailDigest",
          title: "Báo cáo tóm tắt qua Email",
          desc: "Gửi email tổng kết doanh thu và lịch hẹn vào cuối mỗi ngày",
          icon: Mail,
          color: "text-amber-600 bg-amber-50",
        },
      ],
    },
    {
      group: "Sự kiện kích hoạt thông báo",
      items: [
        {
          key: "notifyNewBooking",
          title: "Lịch hẹn mới",
          desc: "Nhận thông báo ngay khi có khách hàng hoàn tất đặt lịch",
          icon: CalendarCheck,
          color: "text-emerald-600 bg-emerald-50",
        },
        {
          key: "notifyBookingCancel",
          title: "Hủy / Dời lịch hẹn",
          desc: "Nhận cảnh báo khi khách hàng xin dời lịch hoặc hủy lịch",
          icon: CalendarX,
          color: "text-rose-600 bg-rose-50",
        },
        {
          key: "notifyBoardingCheckout",
          title: "Nhắc nhở lưu trú & Check-out",
          desc: "Thông báo trước 2 giờ khi thú cưng sắp tới giờ trả phòng",
          icon: Home,
          color: "text-amber-600 bg-amber-50",
        },
        {
          key: "notifyPaymentReceived",
          title: "Thanh toán thành công",
          desc: "Nhận biến động số dư khi khách chuyển khoản hoặc cọc tiền",
          icon: CreditCard,
          color: "text-teal-600 bg-teal-50",
        },
        {
          key: "notifyNewReview",
          title: "Đánh giá mới từ khách hàng",
          desc: "Nhận thông báo để phản hồi kịp thời cho khách",
          icon: Star,
          color: "text-purple-600 bg-purple-50",
        },
        {
          key: "notifyCustomerMessage",
          title: "Tin nhắn khách hàng",
          desc: "Thông báo khi phụ huynh gửi tin nhắn trong phòng chat",
          icon: MessageSquare,
          color: "text-indigo-600 bg-indigo-50",
        },
        {
          key: "notifySystemMaintenance",
          title: "Cảnh báo hệ thống & Quá tải",
          desc: "Nhận cảnh báo khi chi nhánh vượt 90% công suất hoặc có nâng cấp",
          icon: ShieldAlert,
          color: "text-rose-600 bg-rose-50",
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="custom-scrollbar relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6 bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Cài đặt thông báo cơ sở
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Tùy chỉnh các loại cảnh báo và phương thức nhận tin phù hợp với bạn
            </p>
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 text-sm">
          {toggleItems.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {section.group}
              </h4>

              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isChecked = Boolean(formData[item.key]);

                  return (
                    <div
                      key={item.key}
                      onClick={() => toggle(item.key)}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 pr-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Switch control */}
                      <div
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                          isChecked ? "bg-emerald-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                            isChecked ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-80"
          >
            {isSaved ? (
              <>
                <Check size={15} />
                <span>Đã lưu thành công!</span>
              </>
            ) : (
              <span>Lưu cấu hình</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
