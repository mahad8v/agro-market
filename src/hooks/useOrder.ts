import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
// import {
//   fetchVendorOrders,
//   updateOrderStatus,
//   VendorOrdersParams,
//   UpdateOrderStatusPayload,
// } from '@/lib/orders.api';
import { Order } from '@/types/client';
import {
  fetchVendorOrders,
  updateOrderStatus,
  UpdateOrderStatusPayload,
  VendorOrdersParams,
} from '@/app/api/orders/route';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const orderKeys = {
  all: () => ['orders'] as const,
  list: (params: VendorOrdersParams) => ['orders', 'list', params] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useVendorOrders(params: VendorOrdersParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchVendorOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) =>
      updateOrderStatus(payload),

    // Optimistic update across all cached order lists
    onMutate: async ({ orderId, status }) => {
      await qc.cancelQueries({ queryKey: orderKeys.all() });

      const snapshots = new Map<string, unknown>();

      qc.getQueriesData<{ items: Order[] }>({
        queryKey: orderKeys.all(),
      }).forEach(([key, data]) => {
        if (!data?.items) return;
        snapshots.set(JSON.stringify(key), data);
        qc.setQueryData(key, {
          ...data,
          items: data.items.map((o) =>
            o.id === orderId ? { ...o, orderStatus: status } : o,
          ),
        });
      });

      return { snapshots };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach((snap, keyStr) => {
        qc.setQueryData(JSON.parse(keyStr), snap);
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all() });
    },
  });
}
