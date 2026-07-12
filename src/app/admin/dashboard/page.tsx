'use client';

import React from 'react';
import Link from 'next/link';
import { Badge, Card, StatCard, Table, Td } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useAdminStats } from '@/features/admin/hooks';
import { OrderStatus } from '@/types/client';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getOrderStatusBadge(status: OrderStatus | string | null | undefined) {
  const map: Record<string, { label: string; variant: any }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'info' },
    processing: { label: 'Processing', variant: 'purple' },
    shipped: { label: 'Shipped', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
  };

  // Normalize casing — Prisma enums are commonly stored uppercase (e.g. 'PENDING')
  const key = typeof status === 'string' ? status.toLowerCase() : '';
  const entry = map[key] ?? {
    label: status ? String(status) : 'Unknown',
    variant: 'default',
  };

  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
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
                className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-colors cursor-default"
                style={{ height: `${pct}%` }}
                title={formatCurrency(d.revenue)}
              />
            </div>
            <span className="text-xs text-gray-500">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SKELETON COMPONENTS ─────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-9 w-9 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-8 w-28 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-end gap-2 h-36">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gray-200 rounded-t-md"
              style={{ height: `${30 + i * 12}%`, maxHeight: '100px' }}
            />
            <div className="h-3 w-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── ERROR STATE ─────────────────────────────────────────────────────────────

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="text-5xl">⚠️</div>
      <div className="text-center">
        <p className="text-gray-900 font-semibold">Failed to load dashboard</p>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─── VENDOR STATUS PANEL ─────────────────────────────────────────────────────

interface VendorStatusPanelProps {
  approved: number;
  pending: number;
  suspended: number;
  verified: number;
  pro: number;
  total: number;
}

function VendorStatusPanel({
  approved,
  pending,
  suspended,
  verified,
  pro,
  total,
}: VendorStatusPanelProps) {
  const safeTotal = total || 1; // avoid divide-by-zero
  const statuses = [
    { label: 'Approved', count: approved, color: 'bg-emerald-500' },
    { label: 'Pending', count: pending, color: 'bg-amber-500' },
    { label: 'Suspended', count: suspended, color: 'bg-red-500' },
  ];
  return (
    <>
      <div className="space-y-3">
        {statuses.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{s.label}</span>
              <span className="font-bold text-gray-900">{s.count}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className={`h-full rounded-full ${s.color} transition-all duration-500`}
                style={{ width: `${(s.count / safeTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Verified', value: verified },
          { label: 'Pro', value: pro },
          { label: 'Total', value: total },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useAdminStats();

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-6">
        <DashboardError
          message={error?.message ?? 'An unexpected error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // ── Derived values (safe with optional chaining while loading) ─────────────
  const pendingVendors = stats?.pendingVendors ?? 0;
  const recentOrders = stats?.recentOrders ?? [];

  // Vendor breakdown — backend should return these; fall back gracefully
  const vendorApproved = (stats as any)?.vendorBreakdown?.approved ?? 0;
  const vendorPending =
    (stats as any)?.vendorBreakdown?.pending ?? pendingVendors;
  const vendorSuspended = (stats as any)?.vendorBreakdown?.suspended ?? 0;
  const vendorVerified = (stats as any)?.vendorBreakdown?.verified ?? 0;
  const vendorPro = (stats as any)?.vendorBreakdown?.pro ?? 0;
  const vendorTotal = stats?.totalVendors ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Platform overview and key metrics
        </p>
      </div>

      {/* ── Pending vendors alert ───────────────────────────────────────────── */}
      {!isLoading && pendingVendors > 0 && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              {pendingVendors} vendor{pendingVendors > 1 ? 's' : ''} awaiting
              approval
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

      {/* ── KPI stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Vendors"
              value={stats!.totalVendors}
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
              change={`${pendingVendors} pending approval`}
              changeType="neutral"
              color="blue"
            />

            <StatCard
              title="Total Products"
              value={stats!.totalProducts}
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
              value={stats!.totalOrders.toLocaleString()}
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
              value={formatCurrency(stats!.platformRevenue)}
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
          </>
        )}
      </div>

      {/* ── Chart + Vendor breakdown ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue bar chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Platform Revenue</h3>
              <p className="text-xs text-gray-500">
                Commission earnings per month
              </p>
            </div>
            {!isLoading && (
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(stats!.platformRevenue)}
              </p>
            )}
          </div>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <BarChart data={stats!.monthlyRevenue} />
          )}
        </Card>

        {/* Vendor status breakdown */}
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

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-6 bg-gray-200 rounded" />
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-gray-200 rounded-full"
                      style={{ width: `${30 + i * 20}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="h-6 w-8 bg-gray-200 rounded" />
                    <div className="h-3 w-12 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <VendorStatusPanel
              approved={vendorApproved}
              pending={vendorPending}
              suspended={vendorSuspended}
              verified={vendorVerified}
              pro={vendorPro}
              total={vendorTotal}
            />
          )}
        </Card>
      </div>

      {/* ── Recent Orders table ──────────────────────────────────────────────── */}
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
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : recentOrders.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-sm text-gray-400"
              >
                No orders yet.
              </td>
            </tr>
          ) : (
            recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <Td>
                  <span className="font-mono font-medium text-gray-900">
                    {order.id}
                  </span>
                </Td>
                {/* customerName comes from the API response */}
                <Td>{(order as any).customerName ?? order.customerId}</Td>
                <Td className="text-gray-500 text-xs">
                  {(order as any).vendorName ?? order.vendorId}
                </Td>
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
            ))
          )}
        </Table>
      </Card>
    </div>
  );
}
