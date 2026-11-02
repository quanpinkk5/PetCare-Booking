import { apiRequest } from '../../auth/services/authApi.js';
const base = '/businessOwner/notifications';
export const ownerNotificationApi = {
  list: (page = 1, options = {}) => apiRequest(`${base}?page=${page}&limit=100`, options),
  setRead: (id, isRead) => apiRequest(`${base}/${encodeURIComponent(id)}/read`, { method: 'PATCH', body: JSON.stringify({ isRead }) }),
  markAllRead: () => apiRequest(`${base}/read-all`, { method: 'PATCH' }),
  markMultipleRead: (ids) => apiRequest(`${base}/read-selected`, { method: 'PATCH', body: JSON.stringify({ ids }) }),
  remove: (id) => apiRequest(`${base}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  removeMultiple: (ids) => apiRequest(`${base}/delete-selected`, { method: 'POST', body: JSON.stringify({ ids }) }),
  clearRead: () => apiRequest(`${base}/read`, { method: 'DELETE' }),
  settings: (options = {}) => apiRequest(`${base}/settings`, options),
  saveSettings: (settings) => apiRequest(`${base}/settings`, { method: 'PATCH', body: JSON.stringify(settings) }),
};
export async function loadOwnerNotifications(options = {}) {
  const byId = new Map();
  let page = 1, totalPages;
  do {
    const response = await ownerNotificationApi.list(page, options);
    response.data.forEach((item) => byId.set(item._id, item));
    totalPages = response.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);
  return [...byId.values()];
}
