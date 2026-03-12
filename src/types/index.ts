// ─── ENUMS ───────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'vendor' | 'admin';

export type ProductUnit = 'kg' | 'bag' | 'crate' | 'ton' | 'piece';

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ─── USER ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// ─── PRODUCT ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  discountPrice?: number;
  stock: number;
  unit: ProductUnit;
  images: string[];
  isOrganic: boolean;
  harvestDate: string;
  location: string;
  vendorId: string;
  vendor?: Vendor;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── VENDOR ──────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string;
  businessName: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  isVerified: boolean;
  commissionRate: number;
  subscriptionPlan: SubscriptionPlan;
  totalProducts?: number;
  createdAt: string;
}

// ─── ORDER ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  unit: ProductUnit;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  items: OrderItem[];
  totalAmount: number;
  commissionAmount: number;
  vendorEarning: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

// ─── CART ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartVendorGroup {
  vendor: Vendor;
  items: CartItem[];
  subtotal: number;
}

// ─── CATEGORY ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  productCount?: number;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor';
  businessName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
