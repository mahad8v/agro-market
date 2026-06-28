// src/features/vendors/hooks/useVendorSettings.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/* ------------------------------------------------------------------ */
/*  Types — mirrors the actual Prisma Vendor schema                     */
/* ------------------------------------------------------------------ */
export interface VendorSettings {
  id: string;
  businessName: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  phone: string | null;
  location: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  commissionRate: number;
  subscriptionPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: string;
  user: {
    name: string; // owner name
    email: string;
    avatar: string | null;
  };
}

export interface UpdateVendorSettingsPayload {
  businessName?: string;
  description?: string;
  phone?: string;
  location?: string;
  ownerName?: string; // mapped to user.name on the server
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
/*  Fetchers                                                            */
/* ------------------------------------------------------------------ */
async function fetchVendorSettings(): Promise<VendorSettings> {
  const { data } = await axios.get<{ vendor: VendorSettings }>(
    '/api/vendors/setting',
    { headers: getAuthHeaders() },
  );
  return data.vendor;
}

async function updateVendorSettings(
  payload: UpdateVendorSettingsPayload,
): Promise<VendorSettings> {
  const { data } = await axios.patch<{ vendor: VendorSettings }>(
    '/api/vendors/setting',
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
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateVendorSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVendorSettings,

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
          ...(newData.businessName && { businessName: newData.businessName }),
          ...(newData.description !== undefined && {
            description: newData.description,
          }),
          ...(newData.phone !== undefined && { phone: newData.phone }),
          ...(newData.location && { location: newData.location }),
          user: {
            ...previous.user,
            ...(newData.ownerName && { name: newData.ownerName }),
          },
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vendorSettingsKeys.detail(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vendorSettingsKeys.detail() });
    },
  });
}
