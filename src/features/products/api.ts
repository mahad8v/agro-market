import api from '@/services/api';
import { Product, PaginatedProducts, ProductFilters } from '@/types';

export const productsApi = {
  getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    return api.get<PaginatedProducts>('/products', filters as Record<string, string | number | boolean | undefined>);
  },

  getProductBySlug(slug: string): Promise<Product> {
    return api.get<Product>(`/products/${slug}`);
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
