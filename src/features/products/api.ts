import api from '@/services/api';
import { Product, PaginatedProducts, ProductFilters } from '@/types/client';

export const productsApi = {
  // getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
  //   return api.get<PaginatedProducts>(
  //     '/products',
  //     filters as Record<string, string | number | boolean | undefined>,
  //   );
  // },
  getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filters?.category) params.category = filters.category;
    if (filters?.minPrice) params.minPrice = filters.minPrice;
    if (filters?.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters?.location) params.location = filters.location;
    if (filters?.isOrganic !== undefined) params.isOrganic = filters.isOrganic;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.search) params.search = filters.search;

    return api.get<any>('/products', params).then((res) => ({
      data: res.products ?? res.data ?? [],
      total: res.total,
      page: res.page,
      limit: res.limit,
      totalPages: res.totalPages,
    }));
  },

  getProductBySlug(slug: string): Promise<Product> {
    return api.get<Product>(`/products/${slug}`);
  },

  getProductCategories(): Promise<string> {
    return api.get<string>(`/categories`);
  },

  getVendorProducts(vendorId: string): Promise<Product[]> {
    return api.get<Product[]>(`/vendors/${vendorId}/products`);
  },

  getFeaturedProducts(): Promise<Product[]> {
    return api.get<Product[]>('/products/featured');
  },

  createProduct(data: Partial<Product>): Promise<Product> {
    return api.post<Product>('/vendor/products', data);
  },

  updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return api.put<Product>(`/vendor/products/${id}`, data);
  },

  deleteProduct(id: string): Promise<void> {
    return api.delete<void>(`/vendor/products/${id}`);
  },

  toggleStock(id: string, inStock: boolean): Promise<Product> {
    return api.patch<Product>(`/vendor/products/${id}/stock`, { inStock });
  },
};
