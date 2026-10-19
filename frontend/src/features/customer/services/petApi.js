import { apiRequest } from '../../auth/services/authApi.js';

export const petApi = {
  list: () => apiRequest('/customer/pets'),
  create: (payload) => apiRequest('/customer/pets', {
    method: 'POST', body: JSON.stringify(payload),
  }),
  update: (id, payload) => apiRequest(`/customer/pets/${encodeURIComponent(id)}`, {
    method: 'PATCH', body: JSON.stringify(payload),
  }),
  remove: (id) => apiRequest(`/customer/pets/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
