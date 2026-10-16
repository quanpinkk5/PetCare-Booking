import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCheck,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useBusinessNotifications } from "../../../../context/BusinessNotificationContext";
import {
  NOTIFICATION_CATEGORIES,
  BRANCH_FILTER_OPTIONS,
} from "../../data/notificationData";

import NotificationCard from "../../components/notification/NotificationCard";
import NotificationDetailModal from "../../components/notification/NotificationDetailModal";
import NotificationSettingsModal from "../../components/notification/NotificationSettingsModal";
import NotificationEmptyState from "../../components/notification/NotificationEmptyState";

const ITEMS_PER_PAGE = 7;

export default function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    notifications,
    unreadCount,
    highPriorityCount,
    settings,
    updateSettings,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markMultipleAsRead,
    deleteNotification,
    deleteMultiple,
    clearReadNotifications,
    resetNotifications,
  } = useBusinessNotifications();

  // URL query params
  const paramCategory = searchParams.get("category") || "all";
  const paramFilter = searchParams.get("filter") || "all";
  const paramPriority = searchParams.get("priority") || "all";
  const paramBranch = searchParams.get("branch") || "Tất cả chi nhánh";
  const paramId = searchParams.get("id");

  // State
  const [activeCategory, setActiveCategory] = useState(paramCategory);
  const [readFilter, setReadFilter] = useState(paramFilter);
  const [priorityFilter, setPriorityFilter] = useState(paramPriority);
  const [branchFilter, setBranchFilter] = useState(paramBranch);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Detail Modal item
  const [selectedNotification, setSelectedNotification] = useState(() => {
    if (!paramId) return null;
    return notifications.find((n) => n.id.toLowerCase() === paramId.toLowerCase()) || null;
  });

  // Toast feedback helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync with paramId if changed
  useEffect(() => {
    if (paramId) {
      const target = notifications.find((n) => n.id.toLowerCase() === paramId.toLowerCase());
      if (target) {
        setSelectedNotification(target);
      }
    }
  }, [paramId, notifications]);

  // Counts for Category Tabs
  const categoryCounts = useMemo(() => {
    const counts = { all: notifications.length };
    NOTIFICATION_CATEGORIES.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = notifications.filter((n) => n.type === cat.id).length;
      }
    });
    return counts;
  }, [notifications]);

  // Booking count for stat cards
  const bookingCount = useMemo(() => {
    return notifications.filter((n) => n.type === "booking").length;
  }, [notifications]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return notifications.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.type !== activeCategory) {
        return false;
      }

      // Read status filter
      if (readFilter === "unread" && item.isRead) {
        return false;
      }
      if (readFilter === "read" && !item.isRead) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "all" && item.priority !== priorityFilter) {
        return false;
      }

      // Branch filter
      if (
        branchFilter !== "Tất cả chi nhánh" &&
        item.branch &&
        item.branch !== "Toàn hệ thống" &&
        !item.branch.includes(branchFilter)
      ) {
        return false;
      }

      // Search keyword filter
      if (q) {
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesMessage = item.message?.toLowerCase().includes(q);
        const matchesDetail = item.detail?.toLowerCase().includes(q);
        const matchesCustomer = item.customer?.toLowerCase().includes(q);
        const matchesPhone = item.customerPhone?.toLowerCase().includes(q);
        const matchesPet = item.petName?.toLowerCase().includes(q);
        const matchesBookingId = item.metadata?.bookingId?.toLowerCase().includes(q);
        const matchesTxnId = item.metadata?.transactionId?.toLowerCase().includes(q);
        const matchesBranch = item.branch?.toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesMessage &&
          !matchesDetail &&
          !matchesCustomer &&
          !matchesPhone &&
          !matchesPet &&
          !matchesBookingId &&
          !matchesTxnId &&
          !matchesBranch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    notifications,
    activeCategory,
    readFilter,
    priorityFilter,
    branchFilter,
    searchQuery,
  ]);

  // Pagination
  const totalItems = filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleNotifications = useMemo(() => {
    return filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotifications, startIndex]);

  // Handle URL sync
  const updateUrlParams = (cat, read, priority, branch) => {
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("category", cat);
    if (read && read !== "all") params.set("filter", read);
    if (priority && priority !== "all") params.set("priority", priority);
    if (branch && branch !== "Tất cả chi nhánh") params.set("branch", branch);
    setSearchParams(params);
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
    setSelectedIds([]);
    updateUrlParams(catId, readFilter, priorityFilter, branchFilter);
  };

  const handleReadFilterChange = (val) => {
    setReadFilter(val);
    setCurrentPage(1);
    setSelectedIds([]);
    updateUrlParams(activeCategory, val, priorityFilter, branchFilter);
  };

  const handlePriorityFilterChange = (val) => {
    setPriorityFilter(val);
    setCurrentPage(1);
    setSelectedIds([]);
    updateUrlParams(activeCategory, readFilter, val, branchFilter);
  };

  const handleBranchFilterChange = (val) => {
    setBranchFilter(val);
    setCurrentPage(1);
    setSelectedIds([]);
    updateUrlParams(activeCategory, readFilter, priorityFilter, val);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setReadFilter("all");
    setPriorityFilter("all");
    setBranchFilter("Tất cả chi nhánh");
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedIds([]);
    setSearchParams({});
    showToast("Đã xóa tất cả bộ lọc");
  };

  // Bulk Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllVisibleSelected =
    visibleNotifications.length > 0 &&
    visibleNotifications.every((n) => selectedIds.includes(n.id));

  const handleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      const visibleIdSet = new Set(visibleNotifications.map((n) => n.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIdSet.has(id)));
    } else {
      const newIds = new Set([
        ...selectedIds,
        ...visibleNotifications.map((n) => n.id),
      ]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleBulkMarkRead = () => {
    if (selectedIds.length === 0) return;
    markMultipleAsRead(selectedIds);
    showToast(`Đã đánh dấu đã đọc ${selectedIds.length} thông báo`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} thông báo đã chọn?`)) {
      deleteMultiple(selectedIds);
      showToast(`Đã xóa ${selectedIds.length} thông báo`);
      setSelectedIds([]);
    }
  };

  const handleMarkAll = () => {
    markAllAsRead();
    showToast("Đã đánh dấu tất cả thông báo là đã đọc");
  };

  const handleClearRead = () => {
    const readCount = notifications.filter((n) => n.isRead).length;
    if (readCount === 0) {
      showToast("Không có thông báo đã đọc nào để xóa");
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa ${readCount} thông báo đã đọc?`)) {
      clearReadNotifications();
      setSelectedIds([]);
      showToast(`Đã dọn dẹp ${readCount} thông báo đã đọc`);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm("Khôi phục danh sách thông báo mẫu ban đầu?")) {
      resetNotifications();
      setSelectedIds([]);
      showToast("Đã khôi phục dữ liệu thông báo mẫu");
    }
  };

  const handleOpenDetail = (notif) => {
    setSelectedNotification(notif);
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
  };

  const isFiltered =
    activeCategory !== "all" ||
    readFilter !== "all" ||
    priorityFilter !== "all" ||
    branchFilter !== "Tất cả chi nhánh" ||
    searchQuery.trim() !== "";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
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

            {selectedIds.length > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                Đã chọn {selectedIds.length}
              </span>
            )}
          </div>

          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkMarkRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Đánh dấu đã đọc</span>
              </button>

              <button
                type="button"
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
            <div className="text-slate-400 font-medium">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} trên tổng số {totalItems} thông báo
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
              onMarkAsRead={markAsRead}
              onMarkAsUnread={markAsUnread}
              onDelete={(id) => {
                deleteNotification(id);
                showToast("Đã xóa thông báo");
              }}
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
          onResetDemo={handleResetDemoData}
        />
      )}

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => {
          setSelectedNotification(null);
          if (paramId) {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("id");
              return next;
            });
          }
        }}
        onToggleRead={(id) => {
          if (selectedNotification?.isRead) {
            markAsUnread(id);
            setSelectedNotification((prev) => (prev ? { ...prev, isRead: false } : null));
          } else {
            markAsRead(id);
            setSelectedNotification((prev) => (prev ? { ...prev, isRead: true } : null));
          }
        }}
        onDelete={(id) => {
          deleteNotification(id);
          setSelectedNotification(null);
          showToast("Đã xóa thông báo");
        }}
      />

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          updateSettings(newSettings);
          showToast("Đã cập nhật cài đặt thông báo cơ sở");
        }}
      />
    </div>
  );
}
