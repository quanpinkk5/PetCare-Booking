import { apiRequest } from '../../auth/services/authApi.js';

export const businessApi = {
  list: (filters = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value != null) query.set(key, String(value));
    }
    return apiRequest(`/customer/businesses?${query}`);
  },
  detail: (id) => apiRequest(`/customer/businesses/${encodeURIComponent(id)}`),
  branches: (id) => apiRequest(`/customer/businesses/${encodeURIComponent(id)}/branches`),
  services: (id) => apiRequest(`/customer/branches/${encodeURIComponent(id)}/services`),
  reviews: (id, filters = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value != null) query.set(key, String(value));
    }
    return apiRequest(`/businesses/${encodeURIComponent(id)}/reviews?${query}`);
  },
};
