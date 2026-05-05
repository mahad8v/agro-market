import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import {
  getAdminStats,
  getAdminVendors,
  getAdminVendorById,
  approveVendor,
  suspendVendor,
  deleteVendor,
  getAdminProducts,
  adminDeleteProduct,
  featureProduct,
  getAdminOrders,
  adminUpdateOrderStatus,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './api';

// import {
// AdminStats,
// VendorWithStatus,
// VendorListParams,
// PaginatedVendors,
// AdminProductParams,
// PaginatedAdminProducts,
// AdminOrderParams,
// PaginatedAdminOrders,
// CreateCategoryPayload,
// UpdateCategoryPayload,
// } from './types';

import {   AdminStats,
  VendorWithStatus,
  VendorListParams,
  PaginatedVendors,
  AdminProductParams,
  PaginatedAdminProducts,
  AdminOrderParams,
  PaginatedAdminOrders,
  CreateCategoryPayload,
  UpdateCategoryPayload, } from '@/types/admin';
import { ApiError, Category, Order, Product } from '@/types/client';
// import { ApiError, Category, Order, Product } from '@/types';

// ─── QUERY KEYS ──────────────────────────────────────────────────────────────

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,

  vendors: () => [...adminKeys.all, 'vendors'] as const,
  vendorList: (params?: VendorListParams) =>
    [...adminKeys.vendors(), 'list', params] as const,
  vendorDetail: (id: string) => [...adminKeys.vendors(), id] as const,

  products: () => [...adminKeys.all, 'products'] as const,
  productList: (params?: AdminProductParams) =>
    [...adminKeys.products(), 'list', params] as const,

  orders: () => [...adminKeys.all, 'orders'] as const,
  orderList: (params?: AdminOrderParams) =>
    [...adminKeys.orders(), 'list', params] as const,

  categories: () => [...adminKeys.all, 'categories'] as const,
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

/**
 * Fetches admin dashboard KPIs.
 * Stale after 2 minutes — stats don't need to be real-time.
 */
export function useAdminStats(options?: UseQueryOptions<AdminStats, ApiError>) {
  return useQuery<AdminStats, ApiError>({
    queryKey: adminKeys.stats(),
    queryFn: getAdminStats,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

// ─── VENDOR HOOKS ────────────────────────────────────────────────────────────

export function useAdminVendors(params?: VendorListParams) {
  return useQuery<PaginatedVendors, ApiError>({
    queryKey: adminKeys.vendorList(params),
    queryFn: () => getAdminVendors(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev, // keep previous data while fetching new page
  });
}

export function useAdminVendor(id: string) {
  return useQuery<VendorWithStatus, ApiError>({
    queryKey: adminKeys.vendorDetail(id),
    queryFn: () => getAdminVendorById(id),
    enabled: !!id,
  });
}

export function useApproveVendor() {
  const qc = useQueryClient();
  return useMutation<VendorWithStatus, ApiError, string>({
    mutationFn: approveVendor,
    onSuccess: (updated) => {
      // Optimistically update the cached vendor detail
      qc.setQueryData<VendorWithStatus>(
        adminKeys.vendorDetail(updated.id),
        updated,
      );
      // Invalidate lists so counts/filters refresh
      qc.invalidateQueries({ queryKey: adminKeys.vendors() });
      qc.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success(`${updated.businessName} has been approved.`);
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to approve vendor.');
    },
  });
}

export function useSuspendVendor() {
  const qc = useQueryClient();
  return useMutation<VendorWithStatus, ApiError, string>({
    mutationFn: suspendVendor,
    onSuccess: (updated) => {
      qc.setQueryData<VendorWithStatus>(
        adminKeys.vendorDetail(updated.id),
        updated,
      );
      qc.invalidateQueries({ queryKey: adminKeys.vendors() });
      qc.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success(`${updated.businessName} has been suspended.`);
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to suspend vendor.');
    },
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteVendor,
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: adminKeys.vendorDetail(id) });
      qc.invalidateQueries({ queryKey: adminKeys.vendors() });
      qc.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('Vendor deleted successfully.');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to delete vendor.');
    },
  });
}

// ─── PRODUCT HOOKS ───────────────────────────────────────────────────────────

export function useAdminProducts(params?: AdminProductParams) {
  return useQuery<PaginatedAdminProducts, ApiError>({
    queryKey: adminKeys.productList(params),
    queryFn: () => getAdminProducts(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminDeleteProduct() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: adminDeleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.products() });
      qc.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('Product removed from marketplace.');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to delete product.');
    },
  });
}

export function useFeatureProduct() {
  const qc = useQueryClient();
  return useMutation<Product, ApiError, { id: string; isFeatured: boolean }>({
    mutationFn: ({ id, isFeatured }) => featureProduct(id, isFeatured),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: adminKeys.products() });
      toast.success(
        updated.isFeatured
          ? `"${updated.name}" is now featured.`
          : `"${updated.name}" removed from featured.`,
      );
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to update featured status.');
    },
  });
}

// ─── ORDER HOOKS ─────────────────────────────────────────────────────────────

export function useAdminOrders(params?: AdminOrderParams) {
  return useQuery<PaginatedAdminOrders, ApiError>({
    queryKey: adminKeys.orderList(params),
    queryFn: () => getAdminOrders(params),
    staleTime: 30 * 1000, // orders are more time-sensitive
    placeholderData: (prev) => prev,
  });
}

export function useAdminUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<Order, ApiError, { id: string; orderStatus: string }>({
    mutationFn: ({ id, orderStatus }) =>
      adminUpdateOrderStatus(id, orderStatus),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.orders() });
      qc.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('Order status updated.');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to update order status.');
    },
  });
}

// ─── CATEGORY HOOKS ──────────────────────────────────────────────────────────

export function useAdminCategories() {
  return useQuery<Category[], ApiError>({
    queryKey: adminKeys.categories(),
    queryFn: getAdminCategories,
    staleTime: 5 * 60 * 1000, // categories rarely change
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, ApiError, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success(`Category "${category.name}" created.`);
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to create category.');
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation<
    Category,
    ApiError,
    { id: string; payload: UpdateCategoryPayload }
  >({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success(`Category "${category.name}" updated.`);
    },
    onError: (err) => {
      toast.error(err.message ?? 'Failed to update category.');
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Category deleted.');
    },
    onError: (err) => {
      toast.error(
        err.message ??
          'Failed to delete category. It may still have products assigned.',
      );
    },
  });
}
