
import {
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export default function NotificationTable({
  notifications,
  selectedIds,
  isAllSelected,
  onSelectAll,
  onSelectOne,
  onDeleteSelected,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Thanh công cụ */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
        <div className="flex items-center gap-4">
          <label className="flex shrink-0 cursor-pointer select-none items-center gap-2.5 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(event) =>
                onSelectAll(event.target.checked)
              }
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Chọn tất cả</span>
          </label>

          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={selectedIds.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>
              Xóa đã chọn
              {selectedIds.length > 0
                ? ` (${selectedIds.length})`
                : ''}
            </span>
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:text-sm"
        >
          <span>Mới nhất</span>
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {/* Danh sách thông báo */}
      <div className="divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((item) => {
            const isChecked = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-slate-50/70"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onSelectOne(item.id)}
                    aria-label={`Chọn thông báo: ${item.title}`}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  {item.category && (
                    <span
                      className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block ${item.categoryStyle}`}
                    >
                      {item.category}
                    </span>
                  )}

                  <span className="w-24 text-right text-xs text-slate-400">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-sm text-slate-400">
            Không có thông báo nào.
          </div>
        )}
      </div>

      {/* Chân trang và phân trang giao diện */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white p-5">
        <div className="text-xs text-slate-500 sm:text-sm">
          Hiển thị{' '}
          <span className="font-semibold text-slate-700">
            {notifications.length > 0
              ? `1 - ${notifications.length}`
              : '0'}
          </span>{' '}
          trong tổng số{' '}
          <span className="font-semibold text-slate-700">
            1.256
          </span>{' '}
          thông báo
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              aria-label="Trang trước"
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-current="page"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-semibold text-white"
            >
              1
            </button>

            {[2, 3].map((page) => (
              <button
                type="button"
                key={page}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                {page}
              </button>
            ))}

            <span className="flex h-8 w-8 items-center justify-center text-xs text-slate-400">
              ...
            </span>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              126
            </button>

            <button
              type="button"
              aria-label="Trang tiếp theo"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <select
              defaultValue="10"
              aria-label="Số thông báo mỗi trang"
              className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="10">10 / trang</option>
              <option value="20">20 / trang</option>
              <option value="50">50 / trang</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
