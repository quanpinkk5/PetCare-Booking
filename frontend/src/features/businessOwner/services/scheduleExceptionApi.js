
import { apiRequest } from "../../auth/services/authApi.js";

const BASE_URL = "/business-owner/schedule-exceptions";

export const scheduleExceptionApi = {
  // Lấy danh sách ngoại lệ theo dịch vụ chi nhánh
  list: (branchServiceId, signal) =>
    apiRequest(
      `${BASE_URL}?branchServiceId=${encodeURIComponent(branchServiceId)}`,
      { signal }
    ),

  // Thêm ngoại lệ
  create: (payload) =>
    apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Cập nhật ngoại lệ
  update: (id, payload) =>
    apiRequest(`${BASE_URL}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Xóa ngoại lệ
  remove: (id) =>
    apiRequest(`${BASE_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
