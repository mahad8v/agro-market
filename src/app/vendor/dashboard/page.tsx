'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard, Card, Badge, Table, Td } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useVendorDashboard } from '@/hooks/useVendorDashboard';
import type {
  DashboardOrder,
  DashboardOrderStatus,
  DashboardProduct,
  MonthlyRevenuPoint,
  MonthlyOrderPoint,
} from '@/types/vendor';

// ── Badge helper ──────────────────────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<
  DashboardOrderStatus,
  { label: string; variant: string }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  processing: { label: 'Processing', variant: 'purple' },
  shipped: { label: 'Shipped', variant: 'info' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

function OrderStatusBadge({ status }: { status: DashboardOrderStatus }) {
  const { label, variant } = ORDER_STATUS_MAP[status] ?? {
    label: status,
    variant: 'info',
  };
  return <Badge variant={variant as any}>{label}</Badge>;
}

// ── Chart components ──────────────────────────────────────────────────────────

function MiniChart({
  data,
  color = '#10b981',
}: {
  data: number[];
  color?: string;
}) {
  if (!data.length) return null;
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

function RevenueBarChart({ data }: { data: MonthlyRevenuPoint[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
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

// ── Skeleton helpers ──────────────────────────────────────────────────────────

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <SkeletonBlock className="h-8 w-8 rounded-lg" />
      <SkeletonBlock className="h-6 w-24" />
      <SkeletonBlock className="h-3 w-20" />
      <SkeletonBlock className="h-3 w-28" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex items-end gap-2 h-40">
      {[60, 45, 80, 55, 90, 70].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-100 rounded-t-md animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <svg
          className="w-6 h-6 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-900">
        Failed to load dashboard
      </p>
      <p className="text-xs text-gray-400 mt-1">{message}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function VendorDashboard() {
  const { data, isLoading, isError, error } = useVendorDashboard();

  if (isError) {
    return (
      <ErrorState message={(error as Error)?.message ?? 'Unknown error'} />
    );
  }

  const revenueValues = data?.monthlyRevenue.map((d) => d.revenue) ?? [];
  const ordersValues = data?.monthlyOrders.map((d) => d.orders) ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          {isLoading ? (
            <SkeletonBlock className="h-4 w-48 mt-1" />
          ) : (
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, {data!.vendorName} 👋
            </p>
          )}
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

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={data!.stats.totalProducts}
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
              change={`+${data!.stats.productsThisMonth} this month`}
              color="green"
            />
            <StatCard
              title="Total Orders"
              value={data!.stats.totalOrders}
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
              change={`+${data!.stats.ordersThisWeek} this week`}
              color="blue"
            />
            <StatCard
              title="Revenue"
              value={formatCurrency(data!.stats.totalRevenue)}
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
              change={`${data!.stats.revenueChange >= 0 ? '+' : ''}${data!.stats.revenueChange}% vs last month`}
              color="purple"
            />
            <StatCard
              title="Pending Orders"
              value={data!.stats.pendingOrders}
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
          </>
        )}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            {isLoading ? (
              <SkeletonBlock className="h-8 w-28" />
            ) : (
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(data!.stats.totalRevenue)}
                </p>
                <p
                  className={`text-xs ${data!.stats.revenueChange >= 0 ? 'text-emerald-500' : 'text-red-400'}`}
                >
                  {data!.stats.revenueChange >= 0 ? '↑' : '↓'}{' '}
                  {Math.abs(data!.stats.revenueChange)}%
                </p>
              </div>
            )}
          </div>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <RevenueBarChart data={data!.monthlyRevenue} />
          )}
        </Card>

        {/* Orders trend */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Orders Trend</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonBlock className="h-10 w-full" />
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-10" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Orders</span>
                  <span className="font-medium text-gray-900">
                    {data!.stats.totalOrders} total
                  </span>
                </div>
                <MiniChart data={ordersValues} color="#3b82f6" />
              </div>
              <div className="grid grid-cols-6 gap-1 mt-2">
                {data!.monthlyOrders.map((d: MonthlyOrderPoint) => (
                  <div key={d.month} className="text-center">
                    <p className="text-sm font-bold text-gray-800">
                      {d.orders}
                    </p>
                    <p className="text-xs text-gray-400">{d.month}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Recent Orders ── */}
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
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 gap-4"
              >
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-5 w-20 rounded-full" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <Table headers={['Order ID', 'Customer', 'Amount', 'Status', 'Date']}>
            {(data?.recentOrders ?? []).map((order: DashboardOrder) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <Td>
                  <span className="font-mono font-medium text-gray-900">
                    {order.displayId}
                  </span>
                </Td>
                <Td>{order.customerName}</Td>
                <Td>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </Td>
                <Td>
                  <OrderStatusBadge status={order.orderStatus} />
                </Td>
                <Td className="text-gray-400 text-xs">
                  {formatRelativeTime(order.createdAt)}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* ── Top Products ── */}
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
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                <SkeletonBlock className="w-12 h-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonBlock className="h-3.5 w-36" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
                <div className="text-right space-y-1.5">
                  <SkeletonBlock className="h-3.5 w-20" />
                  <SkeletonBlock className="h-3 w-14" />
                </div>
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(data?.topProducts ?? []).map((product: DashboardProduct) => (
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
                  {product.stockStatus === 'in_stock' ? (
                    <Badge variant="success">In Stock</Badge>
                  ) : product.stockStatus === 'low_stock' ? (
                    <Badge variant="warning">Low</Badge>
                  ) : (
                    <Badge variant="danger">Out</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
