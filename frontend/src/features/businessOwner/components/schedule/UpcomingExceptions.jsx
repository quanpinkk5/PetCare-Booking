import { ArrowRight, CalendarOff, Clock3, Ban } from "lucide-react";

const TYPE_CONFIG = {
  CLOSED: {
    title: "Nghỉ cả ngày",
    Icon: CalendarOff,
    bg: "bg-red-50",
    color: "text-red-600",
  },
  CUSTOM_HOURS: {
    title: "Giờ làm việc đặc biệt",
    Icon: Clock3,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  BLOCK_SLOT: {
    title: "Khóa khung giờ",
    Icon: Ban,
    bg: "bg-amber-50",
    color: "text-amber-600",
  },
};

// Backend trả date dưới dạng ISO, ví dụ:
// 2026-11-09T00:00:00.000Z
const getDateKey = (date) => {
  if (!date) return "";
  return String(date).slice(0, 10);
};

const formatDate = (date) => {
  const dateKey = getDateKey(date);
  const parts = dateKey.split("-");

  if (parts.length !== 3) return dateKey;

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export default function UpcomingExceptions({
  exceptions = [],
  loading = false,
  onViewAll,
}) {
  // So sánh YYYY-MM-DD để lọc những ngày sắp tới.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const todayParts = today.formatToParts(new Date());
  const getPart = (type) =>
    todayParts.find((part) => part.type === type)?.value || "";

  const todayKey = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;

  const upcomingExceptions = exceptions
    .filter((item) => getDateKey(item.date) >= todayKey)
    .sort((a, b) => {
      const dateCompare = getDateKey(a.date).localeCompare(getDateKey(b.date));

      if (dateCompare !== 0) return dateCompare;

      return (a.startTime || "").localeCompare(b.startTime || "");
    })
    .slice(0, 5);

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">Ngoại lệ sắp tới</h3>

          <button
            type="button"
            onClick={onViewAll}
            disabled={!onViewAll}
            className="cursor-pointer text-[11px] font-medium text-emerald-600 hover:underline disabled:cursor-default disabled:opacity-50"
          >
            Xem tất cả
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="py-4 text-center text-xs text-slate-400">
              Đang tải ngoại lệ...
            </p>
          ) : upcomingExceptions.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">
              Chưa có ngoại lệ sắp tới.
            </p>
          ) : (
            upcomingExceptions.map((exception) => {
              const config = TYPE_CONFIG[exception.type] || TYPE_CONFIG.CLOSED;

              const Icon = config.Icon;

              const time =
                exception.type === "CLOSED"
                  ? "Cả ngày"
                  : `${exception.startTime || "--:--"} - ${
                      exception.endTime || "--:--"
                    }`;

              return (
                <div
                  key={exception._id}
                  className="flex items-start justify-between gap-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded ${config.bg} ${config.color}`}
                    >
                      <Icon size={14} />
                    </div>

                    <div>
                      <h5 className="text-[11px] font-bold leading-tight text-slate-700">
                        {config.title}
                      </h5>

                      <p className="text-[10px] text-slate-400">
                        {formatDate(exception.date)}
                      </p>

                      <span className="text-[9px] text-slate-500">
                        {exception.reason || "Không có ghi chú"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[9px] font-medium ${config.bg} ${config.color}`}
                  >
                    {time}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-2 text-right">
          <button
            type="button"
            onClick={onViewAll}
            disabled={!onViewAll}
            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-slate-700 transition-colors hover:text-emerald-600 disabled:cursor-default disabled:opacity-50"
          >
            Quản lý tất cả ngoại lệ
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </section>
  );
}
