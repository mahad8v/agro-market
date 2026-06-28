import api from '@/lib/apiClient';
import { VendorDashboardResponse } from '@/types/vendor';

export const dashboardService = {
  getDashboard: async (): Promise<VendorDashboardResponse> => {
    const { data } =
      await api.get<VendorDashboardResponse>('/vendors/dashboard');
    return data;
  },
};
