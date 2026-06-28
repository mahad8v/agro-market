// src/hooks/useVendorDashboard.ts

import { useQuery } from '@tanstack/react-query';
import type { VendorDashboardResponse } from '@/types/vendor';
import api from '@/lib/apiClient';

export const dashboardKeys = {
  all: ['vendor', 'dashboard'] as const,
};

async function fetchVendorDashboard(): Promise<VendorDashboardResponse> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { data } = await api.get<VendorDashboardResponse>(
    '/vendors/dashboard',
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  return data;
}

export function useVendorDashboard() {
  return useQuery<VendorDashboardResponse, Error>({
    queryKey: dashboardKeys.all,
    queryFn: fetchVendorDashboard,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}
