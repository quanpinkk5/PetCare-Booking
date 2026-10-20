import { apiRequest } from "../../auth/services/authApi";

const BASE_URL = "/admin/notifications";

export const adminNotificationApi = {
  // Danh sách + phân trang + sắp xếp
  getNotifications: ({ page = 1, limit = 10, sort = "newest" } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
    });

    return apiRequest(`${BASE_URL}?${params.toString()}`);
  },

  // Đánh dấu đã đọc
  markAsRead: (id) =>
    apiRequest(`${BASE_URL}/${encodeURIComponent(id)}/read`, {
      method: "PATCH",
    }),

  // Xóa các thông báo được chọn
  deleteSelected: (ids) =>
    apiRequest(BASE_URL, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),
  getUnreadCount: () => apiRequest("/admin/notifications/unread-count"),
};
