import { apiRequest } from "../../auth/services/authApi.js";

export const branchApi = {
  list: (signal) => apiRequest("/businessOwner/branches", { signal }),
  detail: (id, signal) => apiRequest(`/businessOwner/branches/${encodeURIComponent(id)}`, { signal }),
  create: (payload) => apiRequest("/businessOwner/branches", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => apiRequest(`/businessOwner/branches/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }),
};
