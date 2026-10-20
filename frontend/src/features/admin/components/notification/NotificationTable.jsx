import {
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";

// ========================================
// HIỂN THỊ LOẠI THÔNG BÁO
// ========================================
const CATEGORY_CONFIG = {
  BUSINESS_REGISTRATION: {
    label: "Hệ thống",
    style: "bg-emerald-50 text-emerald-600",
  },
  SYSTEM: {
    label: "Hệ thống",
    style: "bg-emerald-50 text-emerald-600",
  },
  REPORT: {
    label: "Báo cáo",
    style: "bg-purple-50 text-purple-600",
  },
  PAYMENT_FAILED: {
    label: "Thanh toán",
    style: "bg-amber-50 text-amber-600",
  },
  PAYMENT_SUCCESS: {
    label: "Thanh toán",
    style: "bg-amber-50 text-amber-600",
  },
  BOOKING_CREATED: {
    label: "Booking",
    style: "bg-blue-50 text-blue-600",
  },
  BOOKING_COMPLETED: {
    label: "Booking",
    style: "bg-blue-50 text-blue-600",
  },
  REVIEW_CREATED: {
    label: "Đánh giá",
    style: "bg-pink-50 text-pink-600",
  },
};

const getCategory = (type) =>
  CATEGORY_CONFIG[type] || {
    label: type || "Khác",
    style: "bg-slate-100 text-slate-600",
  };

// ========================================
// NGÀY GIỜ VIỆT NAM
// ========================================
const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
};

// 10 phút trước, 2 giờ trước, 1 ngày trước...
const formatRelativeTime = (value) => {
  if (!value) return "—";

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "—";
  }

  const difference = Math.max(0, Date.now() - timestamp);

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;

  // Nếu đã hơn 7 ngày, hiện ngày thật.
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
};

// ========================================
// COMPONENT
// ========================================
export default function NotificationTable({
  notifications = [],
  selectedIds = [],
  isAllSelected = false,
  onSelectAll,
  onSelectOne,
  onDeleteSelected,
  onOpenNotification,
  selectedNotification,
  onCloseDetail,
  pagination = {},
  page = 1,
  limit = 10,
  sort = "newest",
  onPageChange,
  onLimitChange,
  onSortChange,
  loading = false,
  deleting = false,
  readingId = null,
}) {
  const total = Number(pagination.total || 0);
  const totalPages = Number(pagination.totalPages || 0);

  const from = total > 0 ? (page - 1) * limit + 1 : 0;

  const to = total > 0 ? Math.min(page * limit, total) : 0;

  const visiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(page - 2, totalPages - 4));

    return Array.from({ length: 5 }, (_, index) => start + index);
  };

  const detailCategory = selectedNotification
    ? getCategory(selectedNotification.type)
    : null;

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* THANH CÔNG CỤ - GIỮ GIAO DIỆN GỐC */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div className="flex items-center gap-4">
            <label className="flex shrink-0 cursor-pointer select-none items-center gap-2.5 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isAllSelected}
                disabled={loading || deleting || notifications.length === 0}
                onChange={(event) => onSelectAll?.(event.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />

              <span>Chọn tất cả</span>
            </label>

            <button
              type="button"
              onClick={onDeleteSelected}
              disabled={selectedIds.length === 0 || loading || deleting}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <Trash2 className="h-4 w-4" />

              <span>
                {deleting ? "Đang xóa..." : "Xóa đã chọn"}

                {!deleting && selectedIds.length > 0
                  ? ` (${selectedIds.length})`
                  : ""}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onSortChange}
            disabled={loading || deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
          >
            <span>{sort === "newest" ? "Mới nhất" : "Cũ nhất"}</span>

            <ArrowUpDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* DANH SÁCH - MỖI THÔNG BÁO MỘT DÒNG */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">
              Đang tải thông báo...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => {
              const checked = selectedIds.includes(item._id);
              const category = getCategory(item.type);

              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-slate-50/70"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={deleting}
                      onChange={() => onSelectOne?.(item._id)}
                      aria-label={`Chọn thông báo: ${item.title}`}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <button
                      type="button"
                      onClick={() => onOpenNotification?.(item)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        {!item.isRead && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                            title="Chưa đọc"
                          />
                        )}

                        <h3
                          className={`truncate text-sm ${
                            item.isRead
                              ? "font-medium text-slate-700"
                              : "font-semibold text-slate-900"
                          }`}
                        >
                          {item.title || "Không có tiêu đề"}
                        </h3>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {item.message || "Không có nội dung"}
                      </p>
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <span
                      className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block ${category.style}`}
                    >
                      {category.label}
                    </span>

                    <span
                      className="w-24 text-right text-xs text-slate-400"
                      title={formatDateTime(item.createdAt)}
                    >
                      {formatRelativeTime(item.createdAt)}
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

        {/* FOOTER + PHÂN TRANG - GIỮ GIAO DIỆN GỐC */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white p-5">
          <div className="text-xs text-slate-500 sm:text-sm">
            Hiển thị{" "}
            <span className="font-semibold text-slate-700">
              {from} - {to}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold text-slate-700">
              {total.toLocaleString("vi-VN")}
            </span>{" "}
            thông báo
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                aria-label="Trang trước"
                disabled={loading || deleting || page <= 1}
                onClick={() => onPageChange?.(page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {visiblePages().map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  disabled={loading || deleting}
                  onClick={() => onPageChange?.(pageNumber)}
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    page === pageNumber
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                aria-label="Trang tiếp theo"
                disabled={
                  loading || deleting || totalPages === 0 || page >= totalPages
                }
                onClick={() => onPageChange?.(page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <select
                value={limit}
                disabled={loading || deleting}
                onChange={(event) => onLimitChange?.(event.target.value)}
                aria-label="Số thông báo mỗi trang"
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL CHI TIẾT: CHỈ MỞ KHI NHẤN THÔNG BÁO */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Chi tiết thông báo"
        >
          <div
            className="absolute inset-0"
            onClick={onCloseDetail}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Chi tiết thông báo
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {formatDateTime(selectedNotification.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseDetail}
                aria-label="Đóng"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${detailCategory.style}`}
                >
                  {detailCategory.label}
                </span>

                <span className="text-xs text-slate-400">
                  {readingId === selectedNotification._id
                    ? "Đang đánh dấu đã đọc..."
                    : selectedNotification.isRead
                      ? "Đã đọc"
                      : "Chưa đọc"}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-800">
                {selectedNotification.title}
              </h4>

              <div className="whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {selectedNotification.message || "Không có nội dung"}
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <p>
                  <span className="font-semibold">Ngày tạo:</span>{" "}
                  {formatDateTime(selectedNotification.createdAt)}
                </p>

                {selectedNotification.readAt && (
                  <p>
                    <span className="font-semibold">Đã đọc lúc:</span>{" "}
                    {formatDateTime(selectedNotification.readAt)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onCloseDetail}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
