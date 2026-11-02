import { apiRequest } from '../../auth/services/authApi.js';
const path = (id) => `/businessOwner/conversations/${encodeURIComponent(id)}`;
export const ownerMessageApi = {
  conversations: (signal) => apiRequest('/businessOwner/conversations', { signal }),
  history: (id, signal) => apiRequest(`${path(id)}/messages`, { signal }),
  read: (id) => apiRequest(`${path(id)}/read`, { method: 'PATCH' }),
  send: (id, content) => apiRequest('/businessOwner/messages', { method: 'POST', body: JSON.stringify({ conversationId: id, content }) }),
  important: (id, important) => apiRequest(`${path(id)}/important`, { method: 'PATCH', body: JSON.stringify({ important }) }),
};
