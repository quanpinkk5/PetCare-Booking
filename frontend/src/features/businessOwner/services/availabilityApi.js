
import { apiRequest } from "../../auth/services/authApi.js";

const BASE_URL = "/public/availability";

export const availabilityApi = {
  getSlots: (branchServiceId, date, signal) => {
    const params = new URLSearchParams({
      branchServiceId,
      date,
    });

    return apiRequest(
      `${BASE_URL}/slots?${params.toString()}`,
      { signal }
    );
  },
};
