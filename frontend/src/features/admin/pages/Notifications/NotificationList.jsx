import { useEffect, useRef, useState } from "react";
import NotificationTable from "../../components/notification/NotificationTable";
import { adminNotificationApi } from "../../services/adminNotificationApi";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("newest");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [readingId, setReadingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);

  const requestId = useRef(0);

  // Thông báo kết quả tự biến mất.
  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message]);

  // Lấy danh sách thực tế từ MongoDB.
  useEffect(() => {
    let cancelled = false;
    const currentRequest = ++requestId.current;

    const fetchNotifications = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await adminNotificationApi.getNotifications({
          page,
          limit,
          sort,
        });

        if (cancelled || currentRequest !== requestId.current) {
          return;
        }

        if (
          response?.success === false ||
          !Array.isArray(response?.data?.notifications)
        ) {
          throw new Error(
            response?.message || "Không thể tải danh sách thông báo.",
          );
        }

        const { notifications: rows, pagination: paging } = response.data;

        const totalPages = Number(paging?.totalPages || 0);

        // Khi xóa hết dòng của trang cuối.
        if (page > 1 && page > Math.max(1, totalPages)) {
          setPage(Math.max(1, totalPages));
          return;
        }

        setNotifications(rows);
        setPagination({
          page: Number(paging?.page || page),
          limit: Number(paging?.limit || limit),
          total: Number(paging?.total || 0),
          totalPages,
        });

        // Checkbox chỉ chọn trong trang hiện tại.
        setSelectedIds([]);
      } catch (err) {
        if (cancelled || currentRequest !== requestId.current) {
          return;
        }

        console.error("Fetch notifications:", err);
        setError(err.message || "Không thể tải danh sách thông báo.");
        setNotifications([]);
      } finally {
        if (!cancelled && currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, [page, limit, sort, refresh]);

  const isAllSelected =
    notifications.length > 0 &&
    notifications.every((item) => selectedIds.includes(item._id));

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? notifications.map((item) => item._id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id],
    );
  };

  // Xem chi tiết và đánh dấu đã đọc.
  const handleOpenNotification = async (item) => {
    if (!item?._id) return;

    setSelectedNotification(item);

    if (item.isRead || readingId === item._id) {
      return;
    }

    setReadingId(item._id);

    try {
      const response = await adminNotificationApi.markAsRead(item._id);

      if (response?.success === false || !response?.data?.notification) {
        throw new Error(response?.message || "Không thể đánh dấu đã đọc.");
      }

      const updated = response.data.notification;

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === item._id
            ? {
                ...notification,
                isRead: updated.isRead,
                readAt: updated.readAt,
              }
            : notification,
        ),
      );

      setSelectedNotification((previous) =>
        previous?._id === item._id
          ? {
              ...previous,
              isRead: updated.isRead,
              readAt: updated.readAt,
            }
          : previous,
      );
    } catch (err) {
      console.error("Mark as read:", err);
      setError(err.message || "Không thể đánh dấu thông báo đã đọc.");
    } finally {
      setReadingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0 || deleting || loading) {
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ${selectedIds.length} thông báo đã chọn?\nThao tác này không thể hoàn tác.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await adminNotificationApi.deleteSelected(selectedIds);

      if (
        response?.success === false ||
        typeof response?.data?.deletedCount !== "number"
      ) {
        throw new Error(response?.message || "Không thể xóa thông báo.");
      }

      const deletedCount = response.data.deletedCount;

      if (
        selectedNotification &&
        selectedIds.includes(selectedNotification._id)
      ) {
        setSelectedNotification(null);
      }

      setSelectedIds([]);
      setMessage(`Đã xóa ${deletedCount} thông báo thành công.`);

      setRefresh((previous) => previous + 1);
    } catch (err) {
      console.error("Delete notifications:", err);
      setError(err.message || "Không thể xóa thông báo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-8">
      {/* GIỮ NGUYÊN HEADER */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Quản lý thông báo</h2>

        <p className="mt-1 text-sm text-slate-500">
          Theo dõi và quản lý tất cả thông báo hệ thống và thông báo quan trọng.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {error}
          <button
            type="button"
            onClick={() => setRefresh((v) => v + 1)}
            className="ml-3 font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"
        >
          {message}
        </div>
      )}

      <NotificationTable
        notifications={notifications}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onDeleteSelected={handleDeleteSelected}
        onOpenNotification={handleOpenNotification}
        selectedNotification={selectedNotification}
        onCloseDetail={() => setSelectedNotification(null)}
        pagination={pagination}
        page={page}
        limit={limit}
        sort={sort}
        onPageChange={(nextPage) => {
          setSelectedIds([]);
          setPage(nextPage);
        }}
        onLimitChange={(nextLimit) => {
          setSelectedIds([]);
          setLimit(Number(nextLimit));
          setPage(1);
        }}
        onSortChange={() => {
          setSelectedIds([]);
          setSort((previous) => (previous === "newest" ? "oldest" : "newest"));
          setPage(1);
        }}
        loading={loading}
        deleting={deleting}
        readingId={readingId}
      />
    </main>
  );
}
