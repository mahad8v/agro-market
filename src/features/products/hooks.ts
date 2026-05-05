import { productsApi } from './api';
import { use } from '../../.next/dev/static/chunks/13bde_next_dist_compiled_70c401b7._';
import { Product, ProductFilters } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

//== QUERY KEYS

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

export function useProductsCount() {
  return useQuery({
    queryKey: [...productKeys.all, 'count'],
    queryFn: () => productsApi.getProductCategories(),
  });
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
    enabled: filters?.category !== undefined ? !!filters.category : true,
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
    retry: 2,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useVendorProducts(vendorId: string) {
  return useQuery({
    queryKey: productKeys.vendorProducts(vendorId),
    queryFn: () => productsApi.getVendorProducts(vendorId),
    enabled: !!vendorId,
    retry: 2,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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
