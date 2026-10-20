
import { apiRequest } from "../../auth/services/authApi";

const BASE_URL = "/admin/dashboard";

export const adminDashboardApi = {
  getMetrics: () =>
    apiRequest(`${BASE_URL}/metrics`),

  getCharts: () =>
    apiRequest(`${BASE_URL}/charts`),

  getPendingBusinesses: () =>
    apiRequest(`${BASE_URL}/pending-businesses`),

  getRecentActivities: () =>
    apiRequest(`${BASE_URL}/activities`),
};
