import { apiRequest } from '../../auth/services/authApi.js';

export const messageApi = {
  conversations: () => apiRequest('/customer/conversations'),
  history: (id) => apiRequest(`/customer/conversations/${encodeURIComponent(id)}/messages`),
  read: (id) => apiRequest(`/customer/conversations/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),
  send: (payload) => apiRequest('/customer/messages', { method: 'POST', body: JSON.stringify(payload) }),
};
