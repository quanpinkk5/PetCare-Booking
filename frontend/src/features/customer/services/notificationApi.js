import { apiRequest } from '../../auth/services/authApi.js';

export const notificationApi = {
  list: (page = 1, options = {}) => apiRequest(`/customer/notifications?page=${page}&limit=100`, options),
  setRead: (id, isRead) => apiRequest(`/customer/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH', body: JSON.stringify({ isRead }),
  }),
  markAllRead: () => apiRequest('/customer/notifications/read-all', { method: 'PATCH' }),
  remove: (id) => apiRequest(`/customer/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  clearRead: () => apiRequest('/customer/notifications/read', { method: 'DELETE' }),
};

export async function loadCustomerNotifications(options = {}) {
  const records = new Map();
  let page = 1;
  let totalPages;
  do {
    const response = await notificationApi.list(page, options);
    for (const item of response.data) records.set(item._id, item);
    totalPages = response.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);
  return [...records.values()];
}
