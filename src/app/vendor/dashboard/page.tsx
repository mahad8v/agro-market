'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard, Card, Badge, Table, Td } from '@/components/ui';
import { MOCK_VENDOR_STATS, MOCK_ORDERS, MOCK_PRODUCTS } from '@/lib/mockData';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from '@/types';

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

function MiniChart({
  data,
  color = '#10b981',
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 40;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-10"
      preserveAspectRatio="none"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RevenueBarChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d) => {
        const pct = (d.revenue / max) * 100;
        return (
          <div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div className="w-full relative group" style={{ height: '120px' }}>
              <div
                className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md transition-all duration-500 hover:bg-emerald-400"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function VendorDashboard() {
  const stats = MOCK_VENDOR_STATS;
  const recentOrders = MOCK_ORDERS.filter(
    (o) => o.vendorId === 'vendor-1',
  ).slice(0, 4);
  const topProducts = MOCK_PRODUCTS.filter(
    (p) => p.vendorId === 'vendor-1',
  ).slice(0, 4);

  const revenueValues = stats.monthlyRevenue.map(
    (d: { revenue: any }) => d.revenue,
  );
  const ordersValues = stats.monthlyOrders.map(
    (d: { orders: any }) => d.orders,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, Green Valley Farms 👋
          </p>
        </div>
        <Link
          href="/vendor/products/create"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
          change="+3 this month"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          change="+18 this week"
          color="blue"
        />
        <StatCard
          title="Revenue (KES)"
          value={formatCurrency(stats.totalRevenue)}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          change="+12.4% vs last month"
          color="purple"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          change="Needs attention"
          changeType="negative"
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-xs text-emerald-500">↑ 12.4%</p>
            </div>
          </div>
          <RevenueBarChart data={stats.monthlyRevenue} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Orders Trend</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Orders</span>
                <span className="font-medium text-gray-900">
                  {stats.totalOrders} total
                </span>
              </div>
              <MiniChart data={ordersValues} color="#3b82f6" />
            </div>
            <div className="grid grid-cols-6 gap-1 mt-2">
              {stats.monthlyOrders.map(
                (d: {
                  month:
                    | boolean
                    | React.Key
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  orders:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }) => (
                  // @ts-ignore
                  <div key={d.month} className="text-center">
                    <p className="text-sm font-bold text-gray-800">
                      {d.orders}
                    </p>
                    {/* @ts-ignore */}
                    <p className="text-xs text-gray-400">{d.month}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <Link
            href="/vendor/orders"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <Table headers={['Order ID', 'Customer', 'Amount', 'Status', 'Date']}>
          {recentOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <Td>
                <span className="font-mono font-medium text-gray-900">
                  {order.id}
                </span>
              </Td>
              <Td>{order.customerName}</Td>
              <Td>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </Td>
              <Td>{getOrderStatusBadge(order.orderStatus)}</Td>
              <Td className="text-gray-400 text-xs">
                {formatRelativeTime(order.createdAt)}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Top Products */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Your Products</h3>
          <Link
            href="/vendor/products"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Manage all →
          </Link>
        </div>
        <div className="space-y-3">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
                🌿
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {product.stock} {product.unit} in stock
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-gray-400">per {product.unit}</p>
              </div>
              <div>
                {product.stock > 50 ? (
                  <Badge variant="success">In Stock</Badge>
                ) : product.stock > 0 ? (
                  <Badge variant="warning">Low</Badge>
                ) : (
                  <Badge variant="danger">Out</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
