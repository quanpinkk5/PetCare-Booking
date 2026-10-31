import { apiRequest } from "../../auth/services/authApi.js";

export const ownerServiceApi = {
    list: (signal) => apiRequest("/businessOwner/services", { signal }),
    categories: (signal) => apiRequest("/customer/service-categories", { signal }),
    detail: (id, signal) => apiRequest(`/businessOwner/services/${encodeURIComponent(id)}`, { signal }),
    create: (payload) => apiRequest("/businessOwner/services", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/businessOwner/services/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }),
};
