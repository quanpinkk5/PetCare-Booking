
import { apiRequest } from "../../auth/services/authApi";

const BASE_URL = "/admin/payments";

export const adminPaymentApi = {
  // Danh sách Payment: tìm kiếm, lọc, phân trang
  getPayments: ({
    search = "",
    status = "all",
    method = "all",
    fromDate = "",
    toDate = "",
    page = 1,
    limit = 10,
  } = {}) => {
    const params = new URLSearchParams({
      search,
      status,
      method,
      page: String(page),
      limit: String(limit),
    });

    if (fromDate) {
      params.set("fromDate", fromDate);
    }

    if (toDate) {
      params.set("toDate", toDate);
    }

    return apiRequest(
      `${BASE_URL}?${params.toString()}`
    );
  },

  // Thống kê Payment
  getPaymentMetrics: () =>
    apiRequest(`${BASE_URL}/metrics`),

  // Chi tiết Payment theo MongoDB _id
  getPaymentDetail: (id) =>
    apiRequest(
      `${BASE_URL}/${encodeURIComponent(id)}`
    ),
};
