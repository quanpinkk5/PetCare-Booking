import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle, AlertCircle } from "lucide-react";

export default function BookingDetailModal({ booking, onClose, onUpdateStatus }) {
  if (!booking) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
              BK
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Chi tiết đặt lịch: {booking.id}
              </h3>
              <p className="text-[11px] text-slate-500">
                Đặt lúc: {booking.time}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Trạng thái & Thanh toán */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] font-medium text-slate-400 block mb-1">
                Trạng thái đặt lịch
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${booking.statusClass}`}>
                {booking.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block mb-1">
                Tình trạng thanh toán
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${booking.paymentClass}`}>
                {booking.payment}
              </span>
            </div>
          </div>

          {/* Khách hàng & Thú cưng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Khách hàng */}
            <div className="rounded-xl border border-slate-100 p-3.5 space-y-2 bg-white">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <User size={14} className="text-emerald-600" /> Thông tin khách hàng
              </span>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={booking.customerImg}
                  alt={booking.customer}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h4 className="font-semibold text-slate-800">{booking.customer}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone size={12} className="text-slate-400" /> {booking.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Thú cưng */}
            <div className="rounded-xl border border-slate-100 p-3.5 space-y-2 bg-white">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                🐶 Thú cưng phục vụ
              </span>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={booking.petImg}
                  alt={booking.pet}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h4 className="font-semibold text-slate-800">{booking.pet}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{booking.breed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dịch vụ & Chi nhánh */}
          <div className="rounded-xl border border-slate-100 p-3.5 space-y-2.5 bg-white">
            <h4 className="font-bold text-slate-800 text-[11px]">Thông tin dịch vụ & Thời gian</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-600 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Dịch vụ đã chọn</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{booking.service}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Chi nhánh</span>
                <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-emerald-600" />
                  {booking.branch} - {booking.branchSub}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Ngày hẹn</span>
                <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar size={12} className="text-blue-500" />
                  {booking.date} {booking.dateSub && `(${booking.dateSub})`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Khung giờ</span>
                <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock size={12} className="text-amber-500" />
                  {booking.timeStr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/60">
          <div className="text-[11px] text-slate-400">
            Mã tham chiếu: <span className="font-mono text-slate-600">{booking.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {booking.status === "Chờ xác nhận" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus?.(booking.id, "Từ chối");
                    onClose();
                  }}
                  className="rounded-xl border border-rose-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Từ chối
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus?.(booking.id, "Đã xác nhận");
                    onClose();
                  }}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer"
                >
                  Xác nhận duyệt
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
