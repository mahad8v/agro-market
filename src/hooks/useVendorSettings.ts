// src/features/vendors/hooks/useVendorSettings.ts

import api from '@/lib/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
export interface VendorSettings {
  id: string;
  businessName: string;
  description: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  subscriptionPlan: 'free' | 'pro' | 'enterprise';
  commissionRate: number;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateVendorSettingsPayload {
  businessName?: string;
  description?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  location?: string;
}

/* ------------------------------------------------------------------ */
/*  Query keys                                                          */
/* ------------------------------------------------------------------ */
export const vendorSettingsKeys = {
  all: ['vendor', 'settings'] as const,
  detail: () => [...vendorSettingsKeys.all, 'detail'] as const,
};

/* ------------------------------------------------------------------ */
/*  Auth helper                                                         */
/* ------------------------------------------------------------------ */
function getAuthHeaders() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ------------------------------------------------------------------ */
/*  Fetcher                                                             */
/* ------------------------------------------------------------------ */
async function fetchVendorSettings(): Promise<VendorSettings> {
  const { data } = await api.get<{ vendor: VendorSettings }>(
    '/vendors/setting',
    { headers: getAuthHeaders() },
  );
  return data.vendor;
}

async function updateVendorSettings(
  payload: UpdateVendorSettingsPayload,
): Promise<VendorSettings> {
  const { data } = await api.patch<{ vendor: VendorSettings }>(
    '/vendors/setting',
    payload,
    { headers: getAuthHeaders() },
  );
  return data.vendor;
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                               */
/* ------------------------------------------------------------------ */
export function useVendorSettings() {
  return useQuery({
    queryKey: vendorSettingsKeys.detail(),
    queryFn: fetchVendorSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateVendorSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVendorSettings,

    // Optimistic update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: vendorSettingsKeys.detail(),
      });

      const previous = queryClient.getQueryData<VendorSettings>(
        vendorSettingsKeys.detail(),
      );

      if (previous) {
        queryClient.setQueryData<VendorSettings>(vendorSettingsKeys.detail(), {
          ...previous,
          ...newData,
        });
      }

      return { previous };
    },

    onError: (_err, _newData, context) => {
      // Roll back on error
      if (context?.previous) {
        queryClient.setQueryData(vendorSettingsKeys.detail(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vendorSettingsKeys.detail() });
    },
  });
}
