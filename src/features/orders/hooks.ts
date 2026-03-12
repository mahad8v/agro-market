import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from './api';
import { OrderStatus, ShippingAddress, CartVendorGroup } from '@/types';

export const orderKeys = {
  all: ['orders'] as const,
  vendor: () => [...orderKeys.all, 'vendor'] as const,
  admin: () => [...orderKeys.all, 'admin'] as const,
  customer: () => [...orderKeys.all, 'customer'] as const,
};

export function useVendorOrders() {
  return useQuery({
    queryKey: orderKeys.vendor(),
    queryFn: () => ordersApi.getVendorOrders(),
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: orderKeys.admin(),
    queryFn: () => ordersApi.getAdminOrders(),
  });
}

export function useCustomerOrders() {
  return useQuery({
    queryKey: orderKeys.customer(),
    queryFn: () => ordersApi.getCustomerOrders(),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { vendorGroups: CartVendorGroup[]; shippingAddress: ShippingAddress }) =>
      ordersApi.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.customer() });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
