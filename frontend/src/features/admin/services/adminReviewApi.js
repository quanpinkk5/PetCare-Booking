
import { apiRequest } from "../../auth/services/authApi";

const BASE_URL = "/admin/reviews";

export const adminReviewApi = {
  getReviews: ({
    search = "",
    status = "all",
    rating = "all",
    branchId = "all",
    fromDate = "",
    toDate = "",
    page = 1,
    limit = 10,
  } = {}) => {
    const params = new URLSearchParams({
      search,
      status,
      rating: String(rating),
      branchId,
      page: String(page),
      limit: String(limit),
    });

    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);

    return apiRequest(
      `${BASE_URL}?${params.toString()}`
    );
  },

  getFacilities: () =>
    apiRequest(`${BASE_URL}/facilities`),

  getReviewDetail: (id) =>
    apiRequest(
      `${BASE_URL}/${encodeURIComponent(id)}`
    ),

  updateReviewStatus: (id, status) =>
    apiRequest(
      `${BASE_URL}/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    ),
};
