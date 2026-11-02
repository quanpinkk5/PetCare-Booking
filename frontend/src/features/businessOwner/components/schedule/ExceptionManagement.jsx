
import { Pencil, Trash2, CalendarOff, Clock3, Ban } from "lucide-react";

const TYPE_CONFIG = {
  CLOSED: {
    label: "Nghỉ cả ngày",
    Icon: CalendarOff,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  CUSTOM_HOURS: {
    label: "Giờ đặc biệt",
    Icon: Clock3,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  BLOCK_SLOT: {
    label: "Khóa khung giờ",
    Icon: Ban,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

const formatDate = (value) => {
  if (!value) return "--";

  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split("-");

  return day && month && year
    ? `${day}/${month}/${year}`
    : date;
};

export default function ExceptionManagement({
  exceptions = [],
  loading = false,
  saving = false,
  onEdit,
  onDelete,
  onAdd,
}) {
  const sortedExceptions = [...exceptions].sort((a, b) => {
    const dateA = String(a.date || "").slice(0, 10);
    const dateB = String(b.date || "").slice(0, 10);

    const dateCompare = dateB.localeCompare(dateA);

    if (dateCompare !== 0) return dateCompare;

    return (a.startTime || "").localeCompare(b.startTime || "");
  });

  return (
    <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Quản lý ngoại lệ lịch làm việc
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Tất cả ngoại lệ của dịch vụ đang chọn
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={!onAdd || saving}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          + Thêm ngoại lệ
        </button>
      </div>

      {loading ? (
        <p className="p-8 text-center text-sm text-slate-500">
          Đang tải danh sách ngoại lệ...
        </p>
      ) : sortedExceptions.length === 0 ? (
        <div className="p-10 text-center">
          <CalendarOff
            size={30}
            className="mx-auto mb-3 text-slate-300"
          />
          <p className="text-sm font-medium text-slate-600">
            Chưa có ngoại lệ lịch làm việc
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Nhấn Thêm ngoại lệ để tạo ngày nghỉ hoặc điều chỉnh giờ phục vụ.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Ngày</th>
                <th className="px-5 py-3 font-semibold">Loại ngoại lệ</th>
                <th className="px-5 py-3 font-semibold">Khung giờ</th>
                <th className="px-5 py-3 font-semibold">Sức chứa</th>
                <th className="px-5 py-3 font-semibold">Lý do</th>
                <th className="px-5 py-3 text-right font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedExceptions.map((exception) => {
                const config =
                  TYPE_CONFIG[exception.type] || TYPE_CONFIG.CLOSED;

                const Icon = config.Icon;

                return (
                  <tr
                    key={exception._id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                      {formatDate(exception.date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium ${config.bg} ${config.color}`}
                      >
                        <Icon size={13} />
                        {config.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {exception.type === "CLOSED"
                        ? "Cả ngày"
                        : `${exception.startTime} - ${exception.endTime}`}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {exception.type === "CUSTOM_HOURS"
                        ? exception.capacity
                        : "—"}
                    </td>

                    <td className="max-w-[220px] px-5 py-4 text-slate-600">
                      {exception.reason || "Không có ghi chú"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(exception)}
                          disabled={saving}
                          title="Sửa ngoại lệ"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(exception)}
                          disabled={saving}
                          title="Xóa ngoại lệ"
                          className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && sortedExceptions.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Tổng cộng: {sortedExceptions.length} ngoại lệ
        </div>
      )}
    </section>
  );
}
