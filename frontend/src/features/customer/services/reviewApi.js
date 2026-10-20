import { apiRequest } from '../../auth/services/authApi.js';

export const reviewApi = {
  featured: () => apiRequest('/reviews/featured'),
  list: () => apiRequest('/customer/reviews'),
  pending: () => apiRequest('/customer/reviews/pending-bookings'),
  create: (payload) => apiRequest('/customer/reviews', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => apiRequest(`/customer/reviews/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => apiRequest(`/customer/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  helpful: (id, liked) => apiRequest(`/customer/reviews/${encodeURIComponent(id)}/helpful`, { method: 'PATCH', body: JSON.stringify({ liked }) }),
};
