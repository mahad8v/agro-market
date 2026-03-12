'use client';

import React, { useState } from 'react';
import { Badge, Card, Table, Td, Input } from '@/components/ui';
import { MOCK_ORDERS } from '@/lib/mockData';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

function getOrderStatusBadge(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; variant: any }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'info' },
    processing: { label: 'Processing', variant: 'purple' },
    shipped: { label: 'Shipped', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function getPaymentBadge(status: PaymentStatus) {
  const map: Record<PaymentStatus, { label: string; variant: any }> = {
    paid: { label: 'Paid', variant: 'success' },
    pending: { label: 'Pending', variant: 'warning' },
    failed: { label: 'Failed', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      // @ts-ignore
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      // @ts-ignore
      o.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'all' || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)),
    );
  };

  const totalCommission = orders.reduce(
    (sum, o) => sum + o.commissionAmount,
    0,
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All platform orders ({orders.length} total)
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
            label: 'Platform Revenue',
            value: formatCurrency(totalCommission),
            color: 'bg-emerald-100 text-emerald-800',
          },
          {
            label: 'Delivered',
            value: orders.filter((o) => o.orderStatus === 'delivered').length,
            color: 'bg-blue-100 text-blue-800',
          },
          {
            label: 'Cancelled',
            value: orders.filter((o) => o.orderStatus === 'cancelled').length,
            color: 'bg-red-100 text-red-800',
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
              placeholder="Search by order ID, customer, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'delivered', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
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
            'Vendor',
            'Total',
            'Commission',
            'Payment',
            'Status',
            'Update',
            'Date',
          ]}
        >
          {filtered.map((order) => (
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
                {/* @ts-ignore */}
                <Td className="text-sm">{order?.customerName}</Td>
                <Td>
                  {/*  @ts-ignore */}
                  <p className="text-sm text-gray-700">{order.vendorName}</p>
                </Td>
                <Td>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </Td>
                <Td>
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(order.commissionAmount)}
                  </span>
                </Td>
                <Td>{getPaymentBadge(order.paymentStatus)}</Td>
                <Td>{getOrderStatusBadge(order.orderStatus)}</Td>
                <Td>
                  <select
                    value={order.orderStatus}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
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
                    colSpan={9}
                    className="px-4 py-3 bg-slate-50 border-t border-slate-200"
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        Items:
                      </p>
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.productName}
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
                        {/*  @ts-ignore */}
                        <span>Ship to: {order.shippingAddress}</span>
                        <span>
                          Vendor earning:{' '}
                          <strong>{formatCurrency(order.vendorEarning)}</strong>
                        </span>
                        <span>
                          Commission:{' '}
                          <strong className="text-emerald-700">
                            {formatCurrency(order.commissionAmount)}
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
            <p className="font-medium">No orders found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
