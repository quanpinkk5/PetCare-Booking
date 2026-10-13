import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNotifications } from "../../../../context/NotificationContext";
import {
  NOTIFICATION_CATEGORIES,
} from "../../data/notificationsData";

import NotificationsHero from "../../components/Notifications/NotificationsHero";
import NotificationsFilterBar from "../../components/Notifications/NotificationsFilterBar";
import NotificationCard from "../../components/Notifications/NotificationCard";
import NotificationDetailModal from "../../components/Notifications/NotificationDetailModal";
import NotificationsEmptyState from "../../components/Notifications/NotificationsEmptyState";
import NotificationsPagination from "../../components/Notifications/NotificationsPagination";

const ITEMS_PER_PAGE = 6;

const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    resetNotifications,
  } = useNotifications();

  // Read URL params
  const paramCategory = searchParams.get("category") || searchParams.get("type") || "all";
  const paramFilter = searchParams.get("filter") || "all";
  const paramNotifId = searchParams.get("id");

  // State
  const [activeCategory, setActiveCategory] = useState(paramCategory);
  const [readFilter, setReadFilter] = useState(paramFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDetail, setSelectedDetail] = useState(() => {
    if (!paramNotifId) return null;
    return (
      notifications.find(
        (n) => n.id.toLowerCase() === paramNotifId.toLowerCase()
      ) || null
    );
  });

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sync selected detail if param ID changes
  const [prevNotifId, setPrevNotifId] = useState(paramNotifId);
  if (prevNotifId !== paramNotifId) {
    setPrevNotifId(paramNotifId);
    if (paramNotifId) {
      const match = notifications.find(
        (n) => n.id.toLowerCase() === paramNotifId.toLowerCase()
      );
      if (match) setSelectedDetail(match);
    }
  }

  // Compute Category Counts
  const categoryCounts = useMemo(() => {
    const counts = { all: notifications.length };
    NOTIFICATION_CATEGORIES.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = notifications.filter((n) => n.type === cat.id).length;
      }
    });
    return counts;
  }, [notifications]);

  // Stats for Hero banner
  const stats = useMemo(() => {
    const bookingCount = notifications.filter((n) => n.type === "booking").length;
    const petCareCount = notifications.filter((n) => n.type === "pet_care").length;
    return {
      total: notifications.length,
      unread: unreadCount,
      booking: bookingCount,
      petCare: petCareCount,
    };
  }, [notifications, unreadCount]);

  // Filtered and Sorted Notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
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

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchMessage = item.message?.toLowerCase().includes(q);
          const matchDetail = item.detail?.toLowerCase().includes(q);
          const matchPet = item.petName?.toLowerCase().includes(q);
          const matchBooking = item.metadata?.bookingId?.toLowerCase().includes(q);
          const matchTxn = item.metadata?.transactionId?.toLowerCase().includes(q);
          const matchCoupon = item.metadata?.couponCode?.toLowerCase().includes(q);

          if (
            !matchTitle &&
            !matchMessage &&
            !matchDetail &&
            !matchPet &&
            !matchBooking &&
            !matchTxn &&
            !matchCoupon
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const priorityScore = { high: 2, normal: 1, low: 0 };
          const diff = (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
          if (diff !== 0) return diff;
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        // Default: newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [notifications, activeCategory, readFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = useMemo(() => {
    return filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotifications, startIndex]);

  // Reset page to 1 when filters change
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catId === "all") next.delete("category");
      else next.set("category", catId);
      return next;
    });
  };

  const handleReadFilterChange = (val) => {
    setReadFilter(val);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val === "all") next.delete("filter");
      else next.set("filter", val);
      return next;
    });
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setReadFilter("all");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleClearReadNotifications = () => {
    const readIds = notifications.filter((n) => n.isRead).map((n) => n.id);
    if (readIds.length === 0) return;
    readIds.forEach((id) => deleteNotification(id));
  };

  const handleOpenDetail = (notif) => {
    setSelectedDetail(notif);
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
  };

  const isFiltered =
    activeCategory !== "all" || readFilter !== "all" || searchQuery.trim() !== "";

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-16">
      {/* Hero Banner with Stats */}
      <NotificationsHero
        totalCount={stats.total}
        unreadCount={stats.unread}
        bookingCount={stats.booking}
        petCareCount={stats.petCare}
        onMarkAllAsRead={markAllAsRead}
        onResetNotifications={resetNotifications}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20 space-y-6">
        {/* Filter and Search Bar */}
        <NotificationsFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          categories={NOTIFICATION_CATEGORIES}
          categoryCounts={categoryCounts}
          readFilter={readFilter}
          onReadFilterChange={handleReadFilterChange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onMarkAllAsRead={markAllAsRead}
          onClearReadNotifications={handleClearReadNotifications}
          unreadCount={unreadCount}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />

        {/* Notifications List */}
        {paginatedNotifications.length > 0 ? (
          <div className="space-y-3">
            {paginatedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onDelete={deleteNotification}
                onOpenDetail={handleOpenDetail}
              />
            ))}

            {/* Pagination Controls */}
            <NotificationsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
            />
          </div>
        ) : (
          <NotificationsEmptyState
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>

      {/* Detail Modal */}
      <NotificationDetailModal
        notification={selectedDetail}
        isOpen={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        onToggleRead={(id) => {
          if (selectedDetail?.isRead) {
            markAsUnread(id);
            setSelectedDetail((prev) => prev ? { ...prev, isRead: false } : null);
          } else {
            markAsRead(id);
            setSelectedDetail((prev) => prev ? { ...prev, isRead: true } : null);
          }
        }}
        onDelete={(id) => {
          deleteNotification(id);
          setSelectedDetail(null);
        }}
      />
    </div>
  );
};

export default Notifications;
