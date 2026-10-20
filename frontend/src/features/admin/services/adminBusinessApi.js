import { apiRequest } from "../../auth/services/authApi";

export const adminBusinessApi = {
  // Danh sách thương hiệu
  getBusinesses: ({
    search = "",
    status = "all",
    location = "all",
    page = 1,
    limit = 10,
  } = {}) => {
    const params = new URLSearchParams({
      search,
      status,
      location,
      page: String(page),
      limit: String(limit),
    });

    return apiRequest(`/admin/businesses?${params.toString()}`);
  },

  // Danh sách khu vực
  getBusinessLocations: () => apiRequest("/admin/businesses/locations"),

  // Chi tiết thương hiệu
  getBusinessById: (id) =>
    apiRequest(`/admin/businesses/${encodeURIComponent(id)}`),

  // Danh sách dịch vụ của thương hiệu
  getBusinessServices: (id) =>
    apiRequest(`/admin/businesses/${encodeURIComponent(id)}/services`),

  // Duyệt / Từ chối / Tạm khóa / Mở khóa
  updateBusinessStatus: (id, expectedStatus, status, note = "") =>
    apiRequest(`/admin/businesses/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedStatus,
        status,
        note: note.trim(),
      }),
    }),

  // Yêu cầu Business Owner bổ sung thông tin
  // Không thay đổi trạng thái Business
  requestBusinessInfo: (id, note) =>
    apiRequest(`/admin/businesses/${encodeURIComponent(id)}/request-info`, {
      method: "POST",
      body: JSON.stringify({
        note: note.trim(),
      }),
    }),
};
