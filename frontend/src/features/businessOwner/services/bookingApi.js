import { apiRequest } from "../../auth/services/authApi.js";

const BASE_URL = "/business-owner/bookings";

export const bookingApi = {
  // 1. Lấy danh sách Booking
  getBookings: (params = {}) => {
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

    const queryString = query.toString();

    return apiRequest(`${BASE_URL}${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  // 2. Xem chi tiết Booking
  getBookingById: (id) =>
    apiRequest(`${BASE_URL}/${id}`, {
      method: "GET",
    }),

  // 3. Duyệt / Từ chối Booking
  updateBookingStatus: (id, status, note = "") =>
    apiRequest(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),

  // 4. Bắt đầu / Hoàn thành dịch vụ
  updateBookingProgress: (id, status, note = "") =>
    apiRequest(`${BASE_URL}/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),
  getFilterOptions: () =>
    apiRequest("/business-owner/bookings/filter-options", {
      method: "GET",
    }),
};
