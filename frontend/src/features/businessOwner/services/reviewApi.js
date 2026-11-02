import { apiRequest } from '../../auth/services/authApi.js';
export const ownerReviewApi = {
  list: (signal) => apiRequest('/businessOwner/reviews', { signal }),
  reply: (id, content) => apiRequest(`/businessOwner/reviews/${encodeURIComponent(id)}/reply`, { method: 'PATCH', body: JSON.stringify({ content }) }),
  hide: (id, hidden) => apiRequest(`/businessOwner/reviews/${encodeURIComponent(id)}/hidden`, { method: 'PATCH', body: JSON.stringify({ hidden }) }),
};
