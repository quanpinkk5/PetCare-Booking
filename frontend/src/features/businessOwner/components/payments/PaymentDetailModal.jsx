import { X, CreditCard, User, Phone, MapPin, Calendar, Clock, CheckCircle2, FileText } from "lucide-react";
import { TIMELINE_DATA } from "../../data/paymentData";

export default function PaymentDetailModal({ payment, onClose }) {
  if (!payment) return null;

  const isPaid = payment.status === "Đã thanh toán";
  const bookingCode = getBookingCode(payment.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              <CreditCard size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Chi tiết thanh toán
                </h3>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${payment.statusClass}`}
                >
                  {payment.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mã giao dịch: <span className="font-mono font-semibold text-slate-700">{payment.id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label="Đóng chi tiết"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs">
          {/* Card số tiền nổi bật */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-medium text-emerald-800/80 block">
                Tổng số tiền thanh toán
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-0.5 block tracking-tight">
                {payment.amount}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block mb-1">Phương thức thanh toán</span>
              <span className="inline-flex items-center gap-1.5">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${payment.badgeClass}`}>
                  {payment.methodBadge}
                </span>
                <span className="font-semibold text-slate-800 text-xs">{payment.method}</span>
              </span>
            </div>
          </div>

          {/* Khách hàng & Dịch vụ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Khách hàng */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <User size={13} className="text-emerald-600" /> Thông tin khách hàng
              </span>

              <div className="flex items-center gap-3 pt-1">
                <img
                  src={payment.avatar}
                  alt={payment.customer}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs">{payment.customer}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone size={12} className="text-slate-400" /> {payment.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Dịch vụ & Cơ sở */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <FileText size={13} className="text-emerald-600" /> Thông tin dịch vụ
              </span>

              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{payment.icon}</span>
                  <span className="font-semibold text-slate-800 text-xs line-clamp-1">
                    {payment.service}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{payment.branch}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết hạch toán */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Chi tiết hạch toán hóa đơn
            </h4>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>Mã đặt lịch liên kết (Booking)</span>
                <span className="font-mono font-semibold text-slate-800">{bookingCode}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Thời gian thanh toán</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" /> {payment.date}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính dịch vụ</span>
                <span className="font-medium text-slate-800">{payment.amount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí nền tảng & dịch vụ</span>
                <span className="font-medium text-slate-700">0 đ</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Giảm giá khuyến mãi</span>
                <span className="font-medium text-emerald-600">0 đ</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
                <span>Thực thu cơ sở</span>
                <span className="text-emerald-700">{payment.amount}</span>
              </div>
            </div>
          </div>

          {/* Lịch sử giao dịch */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock size={13} className="text-slate-500" /> Tiến trình xử lý thanh toán
            </h4>

            <div className="relative space-y-3 pl-2 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {TIMELINE_DATA.map((item) => (
                <div key={item.id} className="relative pl-6">
                  <span
                    className={`absolute left-2 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${item.color}`}
                  />
                  <div className="text-[10px] font-medium text-slate-400">
                    {item.date}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {isPaid ? item.title : item.id === 1 ? payment.status : item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/70">
          <div className="text-[11px] text-slate-400">
            Trạng thái đối soát: <strong className="text-emerald-700 font-semibold">Đã khớp hóa đơn</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getBookingCode(paymentId) {
  const bookingCodes = {
    "PAY250522-001": "BK250522-031",
    "PAY250522-002": "BK250522-032",
    "PAY250522-003": "BK250522-033",
    "PAY250522-004": "BK250522-034",
    "PAY250522-005": "BK250522-035",
    "PAY250521-001": "BK250521-018",
  };

  return bookingCodes[paymentId] || "BK250522-099";
}
