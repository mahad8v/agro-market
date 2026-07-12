'use client';

import React, { useMemo, useState } from 'react';
import { Badge, Card, Table, Td, Input } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useUpdateOrderStatus, useVendorOrders } from '@/features/orders/hooks';

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

function getOrderStatusBadge(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; variant: any }> = {
    PENDING: { label: 'Pending', variant: 'warning' },
    CONFIRMED: { label: 'Confirmed', variant: 'info' },
    PROCESSING: { label: 'Processing', variant: 'purple' },
    SHIPPED: { label: 'Shipped', variant: 'info' },
    DELIVERED: { label: 'Delivered', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function getPaymentBadge(status: PaymentStatus) {
  const map: Record<PaymentStatus, { label: string; variant: any }> = {
    PAID: { label: 'Paid', variant: 'success' },
    PENDING: { label: 'Pending', variant: 'warning' },
    FAILED: { label: 'Failed', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function VendorOrdersPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // const { data, isLoading, isError } = useVendorOrders({
  //   status: filterStatus !== 'all' ? filterStatus : undefined,
  // });

  const queryParams = useMemo(
    () => ({ status: filterStatus !== 'all' ? filterStatus : undefined }),
    [filterStatus],
  );
  const { data, isLoading, isError, error } = useVendorOrders(queryParams);

  console.log('data_______', data);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  // Vendor route returns { orders, total, ... } from your route.ts vendor branch
  const orders = data?.orders ?? [];

  const filtered = orders.filter((o: any) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q)
    );
  });

  const totalEarnings = orders.reduce(
    (sum: number, o: any) => sum + (o.vendorEarning ?? 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading your orders…</div>
    );
  }
  if (isError) {
    return (
      <div className="p-6 text-sm text-red-500">Failed to load orders.</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Orders placed with your store ({orders.length} total)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Orders',
            value: orders.length,
            color: 'bg-gray-100 text-gray-800',
          },
          {
            label: 'Your Earnings',
            value: formatCurrency(totalEarnings),
            color: 'bg-emerald-100 text-emerald-800',
          },
          {
            label: 'Delivered',
            value: orders.filter((o: any) => o.orderStatus === 'DELIVERED')
              .length,
            color: 'bg-blue-100 text-blue-800',
          },
          {
            label: 'Pending',
            value: orders.filter((o: any) => o.orderStatus === 'PENDING')
              .length,
            color: 'bg-amber-100 text-amber-800',
          },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <span
              className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}
            >
              {s.label}
            </span>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'all',
              'PENDING',
              'CONFIRMED',
              'PROCESSING',
              'SHIPPED',
              'DELIVERED',
              'CANCELLED',
            ].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <Table
          headers={[
            'Order ID',
            'Customer',
            'Total',
            'Your Earning',
            'Payment',
            'Status',
            'Update',
            'Date',
          ]}
        >
          {filtered.map((order: any) => (
            <React.Fragment key={order.id}>
              <tr
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <Td>
                  <span className="font-mono text-sm font-bold text-gray-900">
                    {order.id}
                  </span>
                </Td>
                <Td className="text-sm">{order.customer?.name}</Td>
                <Td>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </Td>
                <Td>
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(order.vendorEarning)}
                  </span>
                </Td>
                <Td>{getPaymentBadge(order.paymentStatus)}</Td>
                <Td>{getOrderStatusBadge(order.orderStatus)}</Td>
                <Td>
                  <select
                    value={order.orderStatus}
                    disabled={isUpdating}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateStatus({
                        id: order.id,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="text-xs rounded-lg border border-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Td>
                <Td className="text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </Td>
              </tr>
              {expandedOrder === order.id && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-3 bg-slate-50 border-t border-slate-200"
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        Items:
                      </p>
                      {order.items.map((item: any) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm"
                        >
                          {console.log('itemmmm', item)}
                          <span className="text-gray-600">
                            {item.product?.name}
                          </span>
                          <span className="text-gray-400">
                            {item.quantity} × {formatCurrency(item.price)}
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(item.quantity * item.price)}
                          </span>
                        </div>
                      ))}
                      <div className="flex gap-8 pt-2 border-t border-slate-200 text-xs text-gray-500">
                        <span>Ship to: {order.shippingAddress}</span>
                        <span>
                          Your earning:{' '}
                          <strong className="text-emerald-700">
                            {formatCurrency(order.vendorEarning)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p className="font-medium">No orders yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
