import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCheck, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Settings, RotateCcw } from "lucide-react";
import { useBusinessNotifications } from "../../../../context/BusinessNotificationContext";
import { filterOwnerNotifications } from "../../services/notificationView";
import NotificationCard from "../../components/notification/NotificationCard";
import NotificationDetailModal from "../../components/notification/NotificationDetailModal";
import NotificationSettingsModal from "../../components/notification/NotificationSettingsModal";
import NotificationEmptyState from "../../components/notification/NotificationEmptyState";
const ITEMS_PER_PAGE = 7;

export default function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { notifications, settings, updateSettings, markAsRead, markAsUnread, markAllAsRead, markMultipleAsRead,
    deleteNotification, deleteMultiple, clearReadNotifications, refreshNotifications, loading, error, busy, settingsLoading } = useBusinessNotifications();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  const showToast = (message) => {
    window.clearTimeout(toastTimer.current); setToastMessage(message);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), 2800);
  };
  const paramId = searchParams.get('id');
  const selectedNotification = notifications.find((n) => n.id === (detailId || paramId)) || null;
  const filters = {
    category: searchParams.get('category') || 'all', read: searchParams.get('filter') || 'all',
    priority: searchParams.get('priority') || 'all', branch: searchParams.get('branch') || 'Tất cả chi nhánh',
    search: searchParams.get('search') || '',
  };
  const filteredNotifications = filterOwnerNotifications(notifications, filters);
  const totalItems = filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const validSelectedIds = selectedIds.filter((id) => notifications.some((n) => n.id === id));
  const isAllVisibleSelected = visibleNotifications.length > 0 && visibleNotifications.every((n) => validSelectedIds.includes(n.id));
  const handleToggleSelect = (id) => setSelectedIds((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]);
  const handleSelectAllVisible = () => {
    const visible = new Set(visibleNotifications.map((n) => n.id));
    setSelectedIds((old) => isAllVisibleSelected ? old.filter((id) => !visible.has(id)) : [...new Set([...old, ...visible])]);
  };
  const handleBulkMarkRead = async () => {
    if (!validSelectedIds.length) return;
    const result = await markMultipleAsRead(validSelectedIds);
    if (result) { showToast('Đã cập nhật trạng thái đọc của các thông báo đã chọn'); setSelectedIds([]); }
  };
  const handleBulkDelete = async () => {
    if (!validSelectedIds.length || !window.confirm('Xóa các thông báo đã chọn?')) return;
    if (await deleteMultiple(validSelectedIds)) { showToast('Đã xóa thông báo đã chọn'); setSelectedIds([]); }
  };
  const handleMarkAll = async () => { if (await markAllAsRead()) showToast('Đã đánh dấu tất cả là đã đọc'); };
  const handleClearRead = async () => {
    if (!notifications.some((n) => n.isRead) || !window.confirm('Xóa tất cả thông báo đã đọc?')) return;
    if (await clearReadNotifications()) { setSelectedIds([]); showToast('Đã xóa thông báo đã đọc'); }
  };
  const handleDelete = async (id) => {
    const result = await deleteNotification(id);
    if (result) { showToast('Đã xóa thông báo'); if (selectedNotification?.id === id) closeDetail(); }
    return result;
  };
  const handleOpenDetail = (notification) => {
    setDetailId(notification.id);
    if (!notification.isRead && !busy) markAsRead(notification.id);
  };
  const closeDetail = () => {
    setDetailId(null);
    if (paramId) setSearchParams((previous) => { const next = new URLSearchParams(previous); next.delete('id'); return next; });
  };
  const handleResetFilters = () => { setSearchParams({}); setSelectedIds([]); setCurrentPage(1); };
  const isFiltered = filters.category !== 'all' || filters.read !== 'all' || filters.priority !== 'all'
    || filters.branch !== 'Tất cả chi nhánh' || Boolean(filters.search.trim());

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      {error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
        <span>{error}</span><button type="button" disabled={busy || loading} onClick={refreshNotifications}>Thử lại</button>
      </div>}
      {/* Multi-Selection Action Toolbar */}
      {visibleNotifications.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xs text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllVisibleSelected}
                onChange={handleSelectAllVisible}
                className="h-4 w-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>
                {isAllVisibleSelected
                  ? "Bỏ chọn tất cả trang này"
                  : "Chọn tất cả trên trang này"}
              </span>
            </label>

            {validSelectedIds.length > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                Đã chọn {validSelectedIds.length}
              </span>
            )}
          </div>

          {validSelectedIds.length > 0 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleBulkMarkRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Đánh dấu đã đọc</span>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Xóa đã chọn</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-500 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy chọn
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center text-slate-400 font-medium">
              <span>Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} trên tổng số {totalItems} thông báo</span>
              <button type="button" disabled={busy || loading} onClick={refreshNotifications} className="ml-3 p-1" title="Tải lại"><RotateCcw size={14} /></button>
              <button type="button" disabled={busy || settingsLoading} onClick={() => setIsSettingsOpen(true)} className="ml-2 p-1" title="Cài đặt thông báo"><Settings size={14} /></button>
              <button type="button" disabled={busy} onClick={handleMarkAll} className="ml-2 p-1" title="Đọc tất cả"><CheckCheck size={14} /></button>
              <button type="button" disabled={busy} onClick={handleClearRead} className="ml-2 p-1" title="Xóa đã đọc"><Trash2 size={14} /></button>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      {visibleNotifications.length > 0 ? (
        <div className="space-y-3.5">
          {visibleNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onToggleSelect={handleToggleSelect}
              busy={busy}
              onMarkAsRead={markAsRead}
              onMarkAsUnread={markAsUnread}
              onDelete={handleDelete}
              onOpenDetail={handleOpenDetail}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs text-xs">
              <span className="text-slate-500">
                Trang {safePage} / {totalPages} (Tổng {totalItems} thông báo)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Trước</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-xl font-bold transition cursor-pointer ${pageNum === safePage
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <span>Tiếp</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <NotificationEmptyState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onRefresh={refreshNotifications}
          loading={loading}
          onOpenSettings={!settingsLoading && !busy ? () => setIsSettingsOpen(true) : undefined}
        />
      )}

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        busy={busy}
        error={error}
        onClose={closeDetail}
        onToggleRead={(id) => selectedNotification?.isRead ? markAsUnread(id) : markAsRead(id)}
        onDelete={handleDelete}
      />

      {/* Notification Settings Modal */}
      {isSettingsOpen && <NotificationSettingsModal
        busy={busy}
        error={error}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={async (newSettings) => {
          const result = await updateSettings(newSettings);
          if (result) showToast("Đã lưu cài đặt thông báo");
          return result;
        }}
      />}
    </div>
  );
}
