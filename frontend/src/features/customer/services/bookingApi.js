import { apiRequest } from '../../auth/services/authApi.js';

export const bookingApi = {
  create: (payload) => apiRequest('/customer/bookings', {
    method: 'POST', body: JSON.stringify(payload),
  }),
  availability: (id, date) => apiRequest(`/customer/branchServices/${encodeURIComponent(id)}/availableSlots?${new URLSearchParams({ date })}`),
  offering: (id) => apiRequest(`/customer/branchServices/${encodeURIComponent(id)}`),
  list: (filters = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value != null) query.set(key, String(value));
    }
    return apiRequest(`/customer/bookings?${query}`);
  },
  detail: (id) => apiRequest(`/customer/bookings/${encodeURIComponent(id)}`),
  cancel: (id, reason) => apiRequest(`/customer/bookings/${encodeURIComponent(id)}/cancel`, {
    method: 'PATCH', ...(reason ? { body: JSON.stringify({ reason }) } : {}),
  }),
};
