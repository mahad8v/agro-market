import api from '@/services/api';
import { ApiResponse, Order, Product, Category } from '@/types';
import {
  AdminStats,
  VendorWithStatus,
  VendorListParams,
  PaginatedVendors,
  AdminProductParams,
  PaginatedAdminProducts,
  AdminOrderParams,
  PaginatedAdminOrders,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  AdminCategoryListResponse,
} from '@/types/admin';

export async function getAdminStats(): Promise<AdminStats> {
  return api.get<AdminStats>('/admin/stats');
}

// ─── VENDOR MANAGEMENT ───────────────────────────────────────────────────────

export async function getAdminVendors(
  params?: VendorListParams,
): Promise<PaginatedVendors> {
  return api.get<PaginatedVendors>('/admin/vendors', {
    ...(params?.status && params.status !== 'all' && { status: params.status }),
    ...(params?.search && { search: params.search }),
    ...(params?.page && { page: params.page }),
    ...(params?.limit && { limit: params.limit }),
  });
}

/**
 * GET /admin/vendors/:id
 * Returns a single vendor with full details.
 */
export async function getAdminVendorById(
  id: string,
): Promise<VendorWithStatus> {
  const res = await api.get<ApiResponse<VendorWithStatus>>(
    `/admin/vendors/${id}`,
  );
  return res.data;
}

/**
 * PATCH /admin/vendors/:id/approve
 * Sets vendor status to 'approved' and marks as verified.
 */
export async function approveVendor(id: string): Promise<VendorWithStatus> {
  const res = await api.patch<ApiResponse<VendorWithStatus>>(
    `/admin/vendors/${id}/approve`,
  );
  return res.data;
}

/**
 * PATCH /admin/vendors/:id/suspend
 * Sets vendor status to 'suspended'.
 */
export async function suspendVendor(id: string): Promise<VendorWithStatus> {
  const res = await api.patch<ApiResponse<VendorWithStatus>>(
    `/admin/vendors/${id}/suspend`,
  );
  return res.data;
}

/**
 * DELETE /admin/vendors/:id
 * Permanently removes a vendor and their products.
 */
export async function deleteVendor(id: string): Promise<void> {
  await api.delete<void>(`/admin/vendors/${id}`);
}

// ─── PRODUCT MANAGEMENT ──────────────────────────────────────────────────────

export async function getAdminProducts(
  params?: AdminProductParams,
): Promise<PaginatedAdminProducts> {
  console.log('fetching products from:', '/admin/products', params);
  const res = await api.get<ApiResponse<PaginatedAdminProducts>>(
    '/admin/products',
    {
      ...(params?.search && { search: params.search }),
      ...(params?.category && { category: params.category }),
      ...(params?.vendorId && { vendorId: params.vendorId }),
      ...(params?.isFeatured !== undefined && {
        isFeatured: params.isFeatured,
      }),
      ...(params?.page && { page: params.page }),
      ...(params?.limit && { limit: params.limit }),
    },
  );
  return res.data;
}

/**
 * DELETE /admin/products/:id
 * Removes a product from the marketplace.
 */
export async function adminDeleteProduct(id: string): Promise<void> {
  await api.delete<void>(`/admin/products/${id}`);
}

/**
 * PATCH /admin/products/:id/feature
 * Toggles the isFeatured flag on a product.
 */
export async function featureProduct(
  id: string,
  isFeatured: boolean,
): Promise<Product> {
  const res = await api.patch<ApiResponse<Product>>(
    `/admin/products/${id}/feature`,
    { isFeatured },
  );
  return res.data;
}

// ─── ORDER MANAGEMENT ────────────────────────────────────────────────────────

/**
 * GET /admin/orders
 * Returns all orders across all vendors.
 */
export async function getAdminOrders(
  params?: AdminOrderParams,
): Promise<PaginatedAdminOrders> {
  const res = await api.get<ApiResponse<PaginatedAdminOrders>>(
    '/admin/orders',
    {
      ...(params?.status && { status: params.status }),
      ...(params?.vendorId && { vendorId: params.vendorId }),
      ...(params?.search && { search: params.search }),
      ...(params?.page && { page: params.page }),
      ...(params?.limit && { limit: params.limit }),
    },
  );
  return res.data;
}

/**
 * PATCH /admin/orders/:id/status
 * Admin override to update an order's status.
 */
export async function adminUpdateOrderStatus(
  id: string,
  orderStatus: string,
): Promise<Order> {
  const res = await api.patch<ApiResponse<Order>>(
    `/admin/orders/${id}/status`,
    { orderStatus },
  );
  return res.data;
}

// ─── CATEGORY MANAGEMENT ─────────────────────────────────────────────────────

/**
 * GET /admin/categories
 * Returns all product categories with product counts.
 */
export async function getAdminCategories(): Promise<Category[]> {
  const res =
    await api.get<ApiResponse<AdminCategoryListResponse>>('/admin/categories');
  return res.data.data;
}

/**
 * POST /admin/categories
 * Creates a new product category.
 */
export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const res = await api.post<ApiResponse<Category>>(
    '/admin/categories',
    payload,
  );
  return res.data;
}

/**
 * PUT /admin/categories/:id
 * Updates an existing category.
 */
export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const res = await api.put<ApiResponse<Category>>(
    `/admin/categories/${id}`,
    payload,
  );
  return res.data;
}

/**
 * DELETE /admin/categories/:id
 * Deletes a category (backend should reject if products are still assigned).
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete<void>(`/admin/categories/${id}`);
}
