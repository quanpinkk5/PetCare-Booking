import { apiRequest } from "../../auth/services/authApi.js";

export const facilityApi = {
  registerBusiness: (payload) => apiRequest("/businessOwner/businesses", { method: "POST", body: JSON.stringify(payload) }),
  resubmitBusiness: (id, payload) => apiRequest(`/businessOwner/businesses/${encodeURIComponent(id)}/resubmit`, { method: "POST", body: JSON.stringify(payload) }),
  getProfile: (signal) => apiRequest("/businessOwner/businesses/profile", { signal }),
  updateBusiness: (id, payload) => apiRequest(`/businessOwner/businesses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }),
};
