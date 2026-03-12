'use client';

import React from 'react';
import Link from 'next/link';
// import { StatCard, Card, Badge, Table, Td } from '@/components/ui';
import { MOCK_ADMIN_STATS, MOCK_VENDORS, MOCK_ORDERS } from '@/lib/mockData';
import { Badge, Card, StatCard, Table, Td } from '@/components/ui';
import { OrderStatus, VendorStatus } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

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

function BarChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d) => {
        const pct = (d.revenue / max) * 100;
        return (
          <div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className="relative group"
              style={{ height: '100px', width: '100%' }}
            >
              <div
                className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-colors"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const stats = MOCK_ADMIN_STATS;
  // @ts-ignore
  const pendingVendors = MOCK_VENDORS.filter((v) => v.status === 'pending');
  const recentOrders = MOCK_ORDERS.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Platform overview and key metrics
        </p>
      </div>

      {/* Alert: pending vendors */}
      {pendingVendors.length > 0 && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              {pendingVendors.length} vendor
              {pendingVendors.length > 1 ? 's' : ''} awaiting approval
            </p>
            <p className="text-xs text-amber-700">
              Review and approve vendor applications to keep the marketplace
              growing.
            </p>
          </div>
          <Link
            href="/admin/vendors"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          change={`${stats.pendingVendors} pending approval`}
          changeType="neutral"
          color="blue"
        />
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
          change="+12 this week"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
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
          change="+8.2% this month"
          color="amber"
        />
        <StatCard
          title="Platform Revenue"
          value={formatCurrency(stats.platformRevenue)}
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
          change="+18.7% vs last month"
          color="purple"
        />
      </div>

      {/* Charts + Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Platform Revenue</h3>
              <p className="text-xs text-gray-500">
                Commission earnings per month
              </p>
            </div>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(stats.platformRevenue)}
            </p>
          </div>
          <BarChart data={stats.monthlyRevenue} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Vendor Status</h3>
            <Link
              href="/admin/vendors"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              {
                label: 'Approved',
                // @ts-ignore
                count: MOCK_VENDORS.filter((v) => v.status === 'approved')
                  .length,
                color: 'bg-emerald-500',
              },
              {
                label: 'Pending',
                // @ts-ignore
                count: MOCK_VENDORS.filter((v) => v.status === 'pending')
                  .length,
                color: 'bg-amber-500',
              },
              {
                label: 'Suspended',
                // @ts-ignore
                count: MOCK_VENDORS.filter((v) => v.status === 'suspended')
                  .length,
                color: 'bg-red-500',
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-bold text-gray-900">{s.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{
                      width: `${(s.count / MOCK_VENDORS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
            {[
              {
                label: 'Verified',
                value: MOCK_VENDORS.filter((v) => v.isVerified).length,
              },
              {
                label: 'Pro',
                value: MOCK_VENDORS.filter((v) => v.subscriptionPlan !== 'free')
                  .length,
              },
              { label: 'Total', value: MOCK_VENDORS.length },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <Table
          headers={[
            'Order ID',
            'Customer',
            'Vendor',
            'Amount',
            'Commission',
            'Status',
            'Date',
          ]}
        >
          {recentOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <Td>
                <span className="font-mono font-medium text-gray-900">
                  {order.id}
                </span>
              </Td>
              {/* @ts-ignore */}
              <Td>{order.customerName}</Td>
              {/* @ts-ignore */}
              <Td className="text-gray-500 text-xs">{order.vendorName}</Td>
              <Td>
                <span className="font-bold text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </Td>
              <Td>
                <span className="font-medium text-emerald-700">
                  {formatCurrency(order.commissionAmount)}
                </span>
              </Td>
              <Td>{getOrderStatusBadge(order.orderStatus)}</Td>
              <Td className="text-xs text-gray-400">
                {formatRelativeTime(order.createdAt)}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
