
import { apiRequest } from "../../auth/services/authApi.js";

const BASE_URL = "/business-owner/schedules";

export const scheduleApi = {
  // Lấy lịch làm việc theo dịch vụ tại chi nhánh
  list: (branchServiceId, signal) =>
    apiRequest(
      `${BASE_URL}?branchServiceId=${encodeURIComponent(branchServiceId)}`,
      { signal }
    ),

  // Tạo lịch làm việc mới
  create: (payload) =>
    apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Cập nhật lịch làm việc
  update: (id, payload) =>
    apiRequest(`${BASE_URL}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Xóa lịch làm việc
  remove: (id) =>
    apiRequest(`${BASE_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
