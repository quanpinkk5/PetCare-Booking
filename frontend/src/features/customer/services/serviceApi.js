import { apiRequest } from '../../auth/services/authApi.js';

export const serviceApi = {
  categories: () => apiRequest('/customer/service-categories'),
  list: (filters = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value != null) query.set(key, String(value));
    }
    return apiRequest(`/customer/services?${query}`);
  },
};
