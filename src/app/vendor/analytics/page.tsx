'use client';

import React, { useState } from 'react';
import { Card, Badge } from '@/components/ui';
import { MOCK_VENDOR_STATS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

function BarChart({
  data,
  color = '#10b981',
  label,
}: {
  data: { label: string; value: number }[];
  color?: string;
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {label}
      </p>
      <div className="flex items-end gap-3 h-48">
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <div
                className="relative group-hover:opacity-80 transition-opacity"
                style={{ height: '160px', width: '100%' }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700"
                  style={{ height: `${pct}%`, background: color }}
                />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                  {typeof d.value === 'number' && d.value > 1000
                    ? formatCurrency(d.value)
                    : d.value}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VendorAnalyticsPage() {
  const stats = MOCK_VENDOR_STATS;
  const [period, setPeriod] = useState<'6m' | '1y'>('6m');

  const revenueData = stats.monthlyRevenue.map((d: any) => ({
    label: d.month,
    value: d.revenue,
  }));
  const ordersData = stats.monthlyOrders.map((d: any) => ({
    label: d.month,
    value: d.orders,
  }));

  const topProducts = [
    { name: 'Avocados (Hass)', revenue: 680000, orders: 89, pct: 100 },
    { name: 'Organic Tomatoes', revenue: 520000, orders: 112, pct: 76 },
    { name: 'Kale (Sukuma Wiki)', revenue: 210000, orders: 74, pct: 31 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {(['6m', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                period === p
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === '6m' ? 'Last 6 months' : 'Last year'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            change: '+12.4%',
            up: true,
          },
          {
            label: 'Total Orders',
            value: stats.totalOrders,
            change: '+8.2%',
            up: true,
          },
          {
            label: 'Avg Order Value',
            value: formatCurrency(
              Math.round(stats.totalRevenue / stats.totalOrders),
            ),
            change: '+3.8%',
            up: true,
          },
          {
            label: 'Pending Orders',
            value: stats.pendingOrders,
            change: '−2 from yesterday',
            up: false,
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            <p
              className={`text-xs font-semibold mt-1 ${kpi.up ? 'text-emerald-600' : 'text-amber-600'}`}
            >
              {kpi.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <BarChart
            data={revenueData}
            color="#10b981"
            label="Monthly Revenue (KES)"
          />
        </Card>
        <Card>
          <BarChart data={ordersData} color="#3b82f6" label="Monthly Orders" />
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          Top Performing Products
        </h3>
        <div className="space-y-5">
          {topProducts.map((p, i) => (
            <div key={p.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {p.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(p.revenue)}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({p.orders} orders)
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Commission Summary */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Earnings Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <p className="text-3xl font-bold text-emerald-700">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Gross Revenue</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(Math.round(stats.totalRevenue * 0.08))}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Platform Commission (8%)
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-700">
              {formatCurrency(Math.round(stats.totalRevenue * 0.92))}
            </p>
            <p className="text-sm text-gray-600 mt-1">Net Earnings</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
