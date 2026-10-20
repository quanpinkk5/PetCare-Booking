
import { apiRequest } from "../../auth/services/authApi";

const BASE_URL = "/admin/bookings";

export const adminBookingApi = {
  // Danh sách Booking
  getBookings: ({
    search = "",
    status = "all",
    bookingType = "all",
    fromDate = "",
    toDate = "",
    page = 1,
    limit = 10,
  } = {}) => {
    const params = new URLSearchParams({
      search,
      status,
      bookingType,
      page: String(page),
      limit: String(limit),
    });

    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);

    return apiRequest(
      `${BASE_URL}?${params.toString()}`
    );
  },

  // 5 thẻ thống kê
  getMetrics: () =>
    apiRequest(`${BASE_URL}/metrics`),

  // Chi tiết Booking theo MongoDB _id
  getBookingDetail: (id) =>
    apiRequest(
      `${BASE_URL}/${encodeURIComponent(id)}`
    ),
};
