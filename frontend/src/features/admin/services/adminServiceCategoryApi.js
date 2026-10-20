
import { apiRequest } from "../../auth/services/authApi";

const baseUrl = "/admin/service-categories";

export const adminServiceCategoryApi = {
  getCategories: ({
    search = "",
    status = "all",
    page = 1,
    limit = 20,
  } = {}) => {
    const params = new URLSearchParams({
      search,
      status,
      page: String(page),
      limit: String(limit),
    });

    return apiRequest(`${baseUrl}?${params.toString()}`);
  },

  createCategory: (data) =>
    apiRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id, data) =>
    apiRequest(`${baseUrl}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateCategoryStatus: (id, expectedStatus, status) =>
    apiRequest(`${baseUrl}/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedStatus,
        status,
      }),
    }),
};
