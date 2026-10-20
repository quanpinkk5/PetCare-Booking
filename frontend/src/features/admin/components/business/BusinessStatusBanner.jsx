import { Clock, Calendar, FileCheck2, Copy } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ duyệt",
    iconBg: "bg-amber-50 text-amber-500",
    textColor: "text-amber-500",
  },
  APPROVED: {
    label: "Đã duyệt",
    iconBg: "bg-emerald-50 text-emerald-600",
    textColor: "text-emerald-600",
  },
  REJECTED: {
    label: "Từ chối",
    iconBg: "bg-rose-50 text-rose-500",
    textColor: "text-rose-500",
  },
  SUSPENDED: {
    label: "Tạm khóa",
    iconBg: "bg-rose-50 text-rose-500",
    textColor: "text-rose-500",
  },
};

function formatDateTime(value) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export default function BusinessStatusBanner({
  onCopyCode,
  copied = false,
  facility,
  code = "",
}) {
  const status = STATUS_CONFIG[facility?.status] || {
    label: "Không xác định",
    iconBg: "bg-slate-50 text-slate-500",
    textColor: "text-slate-500",
  };

  const registerDate = formatDateTime(facility?.createdAt);

  const displayCode = code || facility?._id || "—";

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* TRẠNG THÁI */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status.iconBg}`}
        >
          <Clock className="w-5 h-5" />
        </div>

        <div>
          <div className="text-xs text-slate-400 font-medium">
            Trạng thái hồ sơ
          </div>

          <div className={`text-base font-bold ${status.textColor}`}>
            {status.label}
          </div>
        </div>
      </div>

      {/* NGÀY ĐĂNG KÝ */}
      <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>

        <div>
          <div className="text-xs text-slate-400 font-medium">Ngày đăng ký</div>

          <div className="text-sm font-semibold text-slate-800">
            {registerDate}
          </div>
        </div>
      </div>

      {/* MÃ HỒ SƠ */}
      <div className="flex items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium">Mã hồ sơ</div>

            <div
              className="text-sm font-semibold text-slate-800 break-all"
              title={displayCode}
            >
              {displayCode}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCopyCode}
          disabled={!code && !facility?._id}
          title="Sao chép mã hồ sơ"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shrink-0 disabled:opacity-50"
        >
          {copied ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              Đã chép
            </span>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </section>
  );
}
