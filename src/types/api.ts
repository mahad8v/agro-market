/**
 * Shared API envelope types.
 * Merge these into your existing types/client.ts (or import from here).
 */

/** Generic paginated response shape expected from all list endpoints */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  /** Optional pre-computed counts for summary cards */
  meta?: Record<string, number>;
}

/** Shape returned by GET /api/vendor/:vendorId/stats */
export interface VendorStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyOrders: { month: string; orders: number }[];
}
