import api from '@/services/api';
import { Order, OrderStatus, ShippingAddress, CartVendorGroup } from '@/types';

interface CreateOrderPayload {
  vendorGroups: CartVendorGroup[];
  shippingAddress: ShippingAddress;
}

export const ordersApi = {
  createOrder(payload: CreateOrderPayload): Promise<Order[]> {
    return api.post<Order[]>('/orders', payload);
  },

  getVendorOrders(): Promise<Order[]> {
    return api.get<Order[]>('/vendor/orders');
  },

  getAdminOrders(): Promise<Order[]> {
    return api.get<Order[]>('/admin/orders');
  },

  getCustomerOrders(): Promise<Order[]> {
    return api.get<Order[]>('/orders/my');
  },

  updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return api.patch<Order>(`/orders/${id}/status`, { status });
  },
};
