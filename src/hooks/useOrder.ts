// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   keepPreviousData,
// } from '@tanstack/react-query';
// import { Order } from '@/types/client';
// import {
//   fetchVendorOrders,
//   updateOrderStatus,
//   UpdateOrderStatusPayload,
//   VendorOrdersParams,
// } from '@/app/api/orders/route';

// // ─── Query keys ───────────────────────────────────────────────────────────────

// export const orderKeys = {
//   all: () => ['orders'] as const,
//   list: (params: VendorOrdersParams) => ['orders', 'list', params] as const,
// };

// // ─── Hooks ────────────────────────────────────────────────────────────────────

// export function useVendorOrders(params: VendorOrdersParams = {}) {
//   return useQuery({
//     queryKey: orderKeys.list(params),
//     queryFn: () => fetchVendorOrders(params),
//     placeholderData: keepPreviousData,
//     staleTime: 60 * 1000,
//   });
// }

// export function useUpdateOrderStatus() {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: UpdateOrderStatusPayload) =>
//       updateOrderStatus(payload),

//     // Optimistic update across all cached order lists
//     onMutate: async ({ orderId, status }) => {
//       await qc.cancelQueries({ queryKey: orderKeys.all() });

//       const snapshots = new Map<string, unknown>();

//       qc.getQueriesData<{ items: Order[] }>({
//         queryKey: orderKeys.all(),
//       }).forEach(([key, data]) => {
//         if (!data?.items) return;
//         snapshots.set(JSON.stringify(key), data);
//         qc.setQueryData(key, {
//           ...data,
//           items: data.items.map((o) =>
//             o.id === orderId ? { ...o, orderStatus: status } : o,
//           ),
//         });
//       });

//       return { snapshots };
//     },

//     onError: (_err, _vars, ctx) => {
//       ctx?.snapshots.forEach((snap, keyStr) => {
//         qc.setQueryData(JSON.parse(keyStr), snap);
//       });
//     },

//     onSettled: () => {
//       qc.invalidateQueries({ queryKey: orderKeys.all() });
//     },
//   });
// }

// export function useAdminOrders(params: AdminOrdersParams) {
//   return useQuery({
//     queryKey: ['admin-orders', params],
//     queryFn: () => fetchAdminOrders(params),
//   });
// }

// // export function useUpdateOrderStatus() {
// //   const queryClient = useQueryClient();
// //   return useMutation({
// //     mutationFn: ({
// //       orderId,
// //       orderStatus,
// //     }: {
// //       orderId: string;
// //       orderStatus: string;
// //     }) => updateOrderStatus(orderId, orderStatus),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
// //     },
// //   });
// // }
// src/features/orders/hooks.ts
import api from '@/lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ── Admin: fetch all orders ─────────────────────────────────────────────────
export function useAdminOrders(params: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: async () => {
      const { data } = await api.get('/orders', {
        params: {
          ...(params.status && { status: params.status }),
          page: params.page ?? 1,
          limit: params.limit ?? 20,
        },
      });
      return data;
    },
  });
}

// ── Admin/Vendor: update order status ───────────────────────────────────────
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: string;
    }) => {
      const { data } = await api.patch(`/orders/${orderId}/status`, {
        orderStatus,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}

// ── Vendor: fetch own store's orders ────────────────────────────────────────
export function useVendorOrders(params: { status?: string }) {
  return useQuery({
    queryKey: ['vendor-orders', params],
    queryFn: async () => {
      const { data } = await api.get('/orders', {
        params: {
          ...(params.status && { status: params.status }),
        },
      });
      return data;
    },
  });
}
