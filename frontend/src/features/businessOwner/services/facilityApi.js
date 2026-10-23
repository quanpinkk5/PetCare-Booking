import { apiRequest } from "../../auth/services/authApi.js";

export const facilityApi = {
  getProfile: (signal) => apiRequest("/businessOwner/businesses/profile", { signal }),
  updateBusiness: (id, payload) => apiRequest(`/businessOwner/businesses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }),
};
