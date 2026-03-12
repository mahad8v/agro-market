import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from './api';

export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  featured: () => [...vendorKeys.all, 'featured'] as const,
  detail: (id: string) => [...vendorKeys.all, 'detail', id] as const,
};

export function useVendors() {
  return useQuery({
    queryKey: vendorKeys.lists(),
    queryFn: () => vendorsApi.getVendors(),
  });
}

export function useFeaturedVendors() {
  return useQuery({
    queryKey: vendorKeys.featured(),
    queryFn: () => vendorsApi.getFeaturedVendors(),
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => vendorsApi.getVendorById(id),
    enabled: !!id,
  });
}

export function useApproveVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorsApi.approveVendor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vendorKeys.lists() }),
  });
}

export function useSuspendVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorsApi.suspendVendor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vendorKeys.lists() }),
  });
}
