import api from '@/lib/apiClient';
import { AnalyticsPeriod, VendorAnalyticsResponse } from '@/types/vendor';
const BASE = '/vendors/analytics';

export const analyticsService = {
  getAnalytics: async (
    period: AnalyticsPeriod,
  ): Promise<VendorAnalyticsResponse> => {
    const { data } = await api.get<VendorAnalyticsResponse>(BASE, {
      params: { period },
    });
    return data;
  },
};
