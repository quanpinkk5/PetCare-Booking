import { apiRequest, apiDownload } from "../../auth/services/authApi";
export const adminUserApi = {
  getUsers: ({
    search = "",
    role = "all",
    status = "all",
    timeRange = "all",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 10,
  } = {}) => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (role !== "all") {
      params.set("role", role);
    }

    if (status !== "all") {
      params.set("status", status);
    }

    if (timeRange !== "all") {
      params.set("timeRange", timeRange);
    }

    if (timeRange === "custom") {
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
    }

    params.set("page", String(page));
    params.set("limit", String(limit));

    return apiRequest(`/admin/users?${params.toString()}`);
  },
  exportUsers: (filters = {}) => {
    const params = new URLSearchParams();

    const fields = [
      "search",
      "role",
      "status",
      "timeRange",
      "startDate",
      "endDate",
    ];

    fields.forEach((field) => {
      const value = filters[field];

      if (value !== undefined && value !== null && value !== "") {
        params.set(field, String(value));
      }
    });

    const query = params.toString();

    return apiDownload(`/admin/users/export${query ? `?${query}` : ""}`);
  },

  getUserById: (id) => {
    return apiRequest(`/admin/users/${encodeURIComponent(id)}`);
  },
  updateUserStatus: (id, status) =>
    apiRequest(`/admin/users/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  createBusinessOwner: (payload) =>
    apiRequest("/admin/business-owners", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getUserPets: (id) =>
    apiRequest(`/admin/users/${encodeURIComponent(id)}/pets`),
  getUserKPIs: (id) =>
    apiRequest(`/admin/users/${encodeURIComponent(id)}/kpis`),
  getUserBookings: (id, page = 1, limit = 5) =>
    apiRequest(
      `/admin/users/${encodeURIComponent(id)}/bookings?page=${page}&limit=${limit}`,
    ),
  getUserPayments: (id, page = 1, limit = 5) =>
    apiRequest(
      `/admin/users/${encodeURIComponent(id)}/payments?page=${page}&limit=${limit}`,
    ),
  getUserStatistics: () => apiRequest("/admin/users/statistics"),
};
