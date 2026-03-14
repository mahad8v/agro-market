import { productsApi } from './api';
import { Product, ProductFilters } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── QUERY KEYS ───────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilters) =>
    [...productKeys.lists(), filters] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  vendorProducts: (vendorId: string) =>
    [...productKeys.all, 'vendor', vendorId] as const,
};

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    // ✅ was useQueryClient
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productsApi.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productsApi.getFeaturedProducts(),
    retry: 2, // 👈 retry twice on failure
    staleTime: 1000 * 60 * 5, // 👈 cache for 5 minutes
    refetchOnWindowFocus: false, // 👈 don't refetch on tab switch
  });
}

export function useVendorProducts(vendorId: string) {
  return useQuery({
    queryKey: productKeys.vendorProducts(vendorId),
    queryFn: () => productsApi.getVendorProducts(vendorId),
    enabled: !!vendorId,
    retry: 2, // 👈 retry twice on failure
    staleTime: 1000 * 60 * 5, // 👈 cache for 5 minutes
    refetchOnWindowFocus: false, // 👈 don't refetch on tab switch
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
