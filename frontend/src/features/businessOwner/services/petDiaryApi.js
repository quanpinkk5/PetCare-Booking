
import { apiRequest } from "../../auth/services/authApi.js";

const BASE_URL = "/business-owner/boarding";

export const petDiaryApi = {
  list: (filters = {}) => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== "" && value != null));
    return apiRequest(`/business-owner/pet-diaries?${query}`);
  },
  updateDiary: (bookingId, diaryId, diaryData) => apiRequest(`${BASE_URL}/${bookingId}/diaries/${diaryId}`, {
    method: "PATCH",
    body: JSON.stringify(diaryData),
  }),
  // Lấy danh sách nhật ký của một Booking lưu trú
  getDiaries: (bookingId) => {
    return apiRequest(
      `${BASE_URL}/${bookingId}/diaries`,
      {
        method: "GET",
      }
    );
  },

  // Thêm nhật ký chăm sóc vào MongoDB
  createDiary: (bookingId, diaryData) => {
    return apiRequest(
      `${BASE_URL}/${bookingId}/diaries`,
      {
        method: "POST",
        body: JSON.stringify({
          activityType: diaryData.activityType,
          description: diaryData.description,
          activityTime: diaryData.activityTime,
          images: diaryData.images || [],
        }),
      }
    );
  },
};
