// ─── Vendor Analytics Types ──────────────────────────────────────────────────

export type AnalyticsPeriod = '6m' | '1y';

// ── API request params ────────────────────────────────────────────────────────

export interface VendorAnalyticsParams {
  period: AnalyticsPeriod;
}

// ── Chart / series data ───────────────────────────────────────────────────────

export interface ChartPoint {
  label: string; // e.g. "Jan", "Feb", …
  revenue: number; // in smallest currency unit (bututs / cents)
  orders: number;
}

// ── Top-product row ───────────────────────────────────────────────────────────

export interface TopProduct {
  productId: string;
  name: string;
  revenue: number;
  orders: number;
  /** Percentage of the #1 product's revenue (0-100). Used to drive the bar. */
  pct: number;
}

// ── Recent order row ──────────────────────────────────────────────────────────

export type OrderStatus = 'Delivered' | 'Processing' | 'Pending' | 'Cancelled';

export interface RecentOrder {
  id: string;
  displayId: string; // e.g. "#ORD-8821"
  item: string; // human-readable summary, e.g. "Avocados × 3 kg"
  amount: number;
  status: OrderStatus;
}

// ── Earnings breakdown ────────────────────────────────────────────────────────

export interface EarningsBreakdown {
  grossRevenue: number;
  commissionRate: number; // decimal, e.g. 0.08
  commission: number;
  netEarnings: number;
}

// ── Summary KPIs ──────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  pendingOrders: number;
  /** Percentage change vs the prior equivalent period (positive = up). */
  revenueChange: number;
  ordersChange: number;
  aovChange: number;
}

// ── Full API response ─────────────────────────────────────────────────────────

export interface VendorAnalyticsResponse {
  period: AnalyticsPeriod;
  summary: AnalyticsSummary;
  series: ChartPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  earnings: EarningsBreakdown;
}

// ─── Vendor Dashboard Types ───────────────────────────────────────────────────

// ── Summary stats ─────────────────────────────────────────────────────────────

export interface VendorDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  /** % change in revenue vs prior month */
  revenueChange: number;
  /** absolute change in orders this week */
  ordersThisWeek: number;
  /** absolute change in products this month */
  productsThisMonth: number;
}

// ── Chart series ──────────────────────────────────────────────────────────────

export interface MonthlyRevenuPoint {
  month: string; // "Jan", "Feb", …
  revenue: number;
}

export interface MonthlyOrderPoint {
  month: string;
  orders: number;
}

// ── Recent orders ─────────────────────────────────────────────────────────────

export type DashboardOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface DashboardOrder {
  id: string;
  displayId: string; // "#ORD-XXXX"
  customerName: string;
  totalAmount: number;
  orderStatus: DashboardOrderStatus;
  createdAt: string; // ISO string
}

// ── Top products ──────────────────────────────────────────────────────────────

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface DashboardProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  stockStatus: StockStatus;
}

// ── Full response ─────────────────────────────────────────────────────────────

export interface VendorDashboardResponse {
  vendorName: string;
  stats: VendorDashboardStats;
  monthlyRevenue: MonthlyRevenuPoint[];
  monthlyOrders: MonthlyOrderPoint[];
  recentOrders: DashboardOrder[];
  topProducts: DashboardProduct[];
}
