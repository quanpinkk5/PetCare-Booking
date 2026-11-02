
import { apiRequest } from "../../auth/services/authApi.js";

const BASE_URL = "/business-owner/boarding";

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      query.append(key, String(value));
    }
  });

  return query.toString();
};

export const boardingApi = {
  // Danh sách lưu trú, tìm kiếm, lọc, phân trang
  getBoardings: (params = {}) => {
    const query = buildQuery(params);

    return apiRequest(
      `${BASE_URL}${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  },

  // Chi tiết một đơn lưu trú
  getBoardingById: (id) =>
    apiRequest(`${BASE_URL}/${id}`, {
      method: "GET",
    }),

  // Check-in thú cưng
  checkIn: (id, note = "") =>
    apiRequest(`${BASE_URL}/${id}/check-in`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
    }),

  // Check-out thú cưng
  checkOut: (id, note = "") =>
    apiRequest(`${BASE_URL}/${id}/check-out`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
    }),
};
