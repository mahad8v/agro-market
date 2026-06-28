'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';

export interface VendorProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  unit: string;
  isOrganic: boolean;
  isFeatured: boolean;
  images: string[];
  categoryId: string;
  category: { id: string; name: string; slug: string; icon: string };
  createdAt: string;
}

export interface ProductsResponse {
  data: VendorProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  search?: string;
  category?: string;
  stock?: string;
  page?: number;
  limit?: number;
}

// ── Fetcher ──────────────────────────────────────────────────────────────────
const fetchVendorProducts = async (
  filters: Filters,
): Promise<ProductsResponse> => {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.stock) params.stock = filters.stock;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);

  const { data } = await api.get<ProductsResponse>('/products', { params });
  return data;
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useVendorProducts(filters: Filters = {}) {
  const queryClient = useQueryClient();

  // ── Query ───────────────────────────────────────────────────────────────
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['vendor-products', filters],
    queryFn: () => fetchVendorProducts(filters),
    staleTime: 30_000, // 30s before refetch
  });

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const error = queryError
    ? ((queryError as any).response?.data?.error ??
      (queryError as Error).message)
    : null;

  // ── Delete mutation ──────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),

    // Optimistic: remove from cache immediately
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ['vendor-products', filters],
      });
      const previous = queryClient.getQueryData<ProductsResponse>([
        'vendor-products',
        filters,
      ]);

      queryClient.setQueryData<ProductsResponse>(
        ['vendor-products', filters],
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((p) => p.id !== id),
                total: old.total - 1,
              }
            : old!,
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      // Rollback on failure
      if (ctx?.previous) {
        queryClient.setQueryData(['vendor-products', filters], ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
  });

  // ── Toggle stock mutation ────────────────────────────────────────────────
  const toggleStockMutation = useMutation({
    mutationFn: ({ id, newStock }: { id: string; newStock: number }) =>
      api.patch(`/products/${id}`, { stock: newStock }),

    // Optimistic: flip stock in cache immediately
    onMutate: async ({ id, newStock }) => {
      await queryClient.cancelQueries({
        queryKey: ['vendor-products', filters],
      });
      const previous = queryClient.getQueryData<ProductsResponse>([
        'vendor-products',
        filters,
      ]);

      queryClient.setQueryData<ProductsResponse>(
        ['vendor-products', filters],
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((p) =>
                  p.id === id ? { ...p, stock: newStock } : p,
                ),
              }
            : old!,
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['vendor-products', filters], ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<VendorProduct>;
    }) => api.patch(`/products/${id}`, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendor-products'],
      });
    },
  });
  // ── Public API ───────────────────────────────────────────────────────────
  const deleteProduct = async (id: string) => {
    await deleteMutation.mutateAsync(id).catch((e) => {
      throw new Error(e.response?.data?.error ?? 'Delete failed');
    });
  };

  const toggleStock = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newStock = product.stock > 0 ? 0 : 100;
    await toggleStockMutation.mutateAsync({ id, newStock }).catch((e) => {
      throw new Error(e.response?.data?.error ?? 'Update failed');
    });
  };

  const editProduct = async (id: string, payload: Partial<VendorProduct>) => {
    await updateProductMutation.mutateAsync({ id, payload }).catch((e) => {
      throw new Error(e.response?.data?.error ?? 'Update failed');
    });
  };
  return {
    products,
    total,
    totalPages,
    loading,
    error,
    refetch,
    deleteProduct,
    toggleStock,
    editProduct,
  };
}
