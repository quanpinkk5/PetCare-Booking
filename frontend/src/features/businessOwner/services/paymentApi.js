import { apiRequest } from "../../auth/services/authApi.js";

export const ownerPaymentApi = {
  list: (signal) => apiRequest("/businessOwner/payments", { signal }),
};
