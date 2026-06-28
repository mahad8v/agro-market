import axios from 'axios';
import { Order, OrderStatus } from '@/types/client';
import { PaginatedResponse } from '@/types/api';

const api = axios.create({ baseURL: '/api' });

// Attach token from session cookie — NextAuth handles this automatically
// via the session cookie, so no manual header needed when using `auth()`
// on the server. This interceptor handles cases where a Bearer token is used.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ?? err.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export interface VendorOrdersParams {
  status?: OrderStatus | 'all';
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
}

export async function fetchVendorOrders(
  params: VendorOrdersParams = {},
): Promise<PaginatedResponse<Order>> {
  const { status = 'all', page = 1, limit = 20 } = params;
  const { data } = await api.get<PaginatedResponse<Order>>('/orders', {
    params: {
      ...(status !== 'all' && { status: status.toUpperCase() }),
      page,
      limit,
    },
  });
  return data;
}

export async function updateOrderStatus({
  orderId,
  status,
}: UpdateOrderStatusPayload): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${orderId}/status`, {
    status: status.toUpperCase(),
  });
  return data;
}
