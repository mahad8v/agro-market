'use client';

import React, { useState } from 'react';
import { Badge, Card, Table, Td, Select } from '@/components/ui';
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

const ORDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(
    MOCK_ORDERS.filter((o) => o.vendorId === 'vendor-1'),
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: newStatus } : o,
      ),
    );
  };

  const filtered =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {orders.length} total orders
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'All',
            value: orders.length,
            color: 'bg-gray-50 border-gray-200',
          },
          {
            label: 'Pending',
            value: orders.filter((o) => o.orderStatus === 'pending').length,
            color: 'bg-amber-50 border-amber-200',
          },
          {
            label: 'Delivered',
            value: orders.filter((o) => o.orderStatus === 'delivered').length,
            color: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Cancelled',
            value: orders.filter((o) => o.orderStatus === 'cancelled').length,
            color: 'bg-red-50 border-red-200',
          },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <Card padding="sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Filter by status:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'all',
              'pending',
              'confirmed',
              'processing',
              'shipped',
              'delivered',
              'cancelled',
            ].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card padding="none">
        <Table
          headers={[
            'Order ID',
            'Customer',
            'Items',
            'Amount',
            'Payment',
            'Status',
            'Update Status',
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
                  <span className="font-mono font-semibold text-gray-900 text-sm">
                    {order.id}
                  </span>
                </Td>
                <Td>{order.customerName}</Td>
                <Td>
                  <span className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </span>
                </Td>
                <Td>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <p className="text-xs text-gray-400">
                    Earning: {formatCurrency(order.vendorEarning)}
                  </p>
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
                    className="text-sm rounded-lg border border-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {ORDER_STATUS_OPTIONS.map((o) => (
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
                    className="px-4 py-3 bg-emerald-50 border-t border-emerald-100"
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Order Items:
                      </p>
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.productName}
                          </span>
                          <span className="text-gray-500">
                            {item.quantity} × {formatCurrency(item.price)}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(item.quantity * item.price)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-emerald-200 pt-2 flex justify-between text-sm font-semibold">
                        {/* @ts-ignore */}
                        <span>Shipping to: {order.shippingAddress}</span>
                        <span>
                          Commission: {formatCurrency(order.commissionAmount)}
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
