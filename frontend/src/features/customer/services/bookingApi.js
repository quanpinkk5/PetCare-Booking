import { apiRequest } from '../../auth/services/authApi.js';

export const bookingApi = {
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
