import { apiRequest } from '../../auth/services/authApi.js';

export const petDiaryApi = {
  detail: (id, options = {}) => apiRequest(`/customer/bookings/${encodeURIComponent(id)}/diary`, options),
};
