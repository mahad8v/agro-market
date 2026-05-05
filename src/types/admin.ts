// ─── ADMIN STATS ─────────────────────────────────────────────────────────────

import { Order, Vendor, Product, Category } from './client';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface AdminStats {
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  platformRevenue: number;
  pendingVendors: number;
  monthlyRevenue: { month: string; revenue: number }[];
  recentOrders: any[];
  vendorBreakdown: {
    approved: number;
    pending: number;
    suspended: number;
    verified: number;
    pro: number;
  };
}

// ─── VENDOR MANAGEMENT ───────────────────────────────────────────────────────

export type VendorStatusFilter = 'all' | 'pending' | 'approved' | 'suspended';

export interface VendorWithStatus extends Vendor {
  status: 'pending' | 'approved' | 'suspended';
  totalOrders?: number;
  totalRevenue?: number;
  totalReviews?: number;
}

export interface VendorListParams {
  status?: VendorStatusFilter;
  search?: string;
  page?: number;
  limit?: number;
}

export interface VendorWithStatus extends Vendor {
  status:
    | 'pending'
    | 'approved'
    | 'suspended'
    | 'PENDING'
    | 'APPROVED'
    | 'SUSPENDED';
  totalOrders?: number;
  totalRevenue?: number;
  totalReviews?: number;
  user?: { name: string; email: string }; // ← add this
}
// ─── PRODUCT MANAGEMENT ──────────────────────────────────────────────────────

export interface AdminProductParams {
  search?: string;
  category?: string;
  vendorId?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedAdminProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── ORDER MANAGEMENT ────────────────────────────────────────────────────────

export interface AdminOrderParams {
  status?: string;
  vendorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAdminOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── CATEGORY MANAGEMENT ─────────────────────────────────────────────────────

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface AdminCategoryListResponse {
  data: Category[];
  total: number;
}
