import { apiRequest } from "../../auth/services/authApi.js";

export const branchServiceApi = {
    list: (signal) => apiRequest("/businessOwner/branchServices", { signal }),
    detail: (id, signal) => apiRequest(`/businessOwner/branchServices/${encodeURIComponent(id)}`, { signal }),
    create: (payload) => apiRequest("/businessOwner/branchServices", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/businessOwner/branchServices/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }),
};
