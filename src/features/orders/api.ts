// src/services/orders.service.ts (or wherever ordersApi lives)
import api from '@/services/api';
import {
  Order,
  OrderStatus,
  ShippingAddress,
  CartVendorGroup,
} from '@/types/client';

interface CreateOrderPayload {
  vendorGroups: CartVendorGroup[];
  shippingAddress: ShippingAddress;
}

export const ordersApi = {
  createOrder(payload: CreateOrderPayload): Promise<Order[]> {
    return api.post('/orders', payload);
  },

  getVendorOrders(): Promise<Order[]> {
    return api.get('/vendors/orders');
  },

  getAdminOrders() {
    return api.get('/orders');
  },

  getCustomerOrders() {
    return api.get('/orders/my');
  },

  updateOrderStatus(id: string, status: OrderStatus) {
    return api.patch<Order>(`/orders/${id}/status`, { status });
  },
};
