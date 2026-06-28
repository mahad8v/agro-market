// // app/api/vendor/dashboard/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/server/db';
// import type {
//   DashboardOrder,
//   DashboardOrderStatus,
//   DashboardProduct,
//   MonthlyOrderPoint,
//   MonthlyRevenuPoint,
//   StockStatus,
//   VendorDashboardResponse,
// } from '@/types/vendor';
// import { verifyToken } from '@/server/jwt';

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const LOW_STOCK_THRESHOLD = 50;

// function toMonthLabel(d: Date): string {
//   return d.toLocaleString('en-US', { month: 'short' });
// }

// function startOf(unit: 'week' | 'month'): Date {
//   const d = new Date();
//   if (unit === 'month') {
//     d.setDate(1);
//     d.setHours(0, 0, 0, 0);
//   } else {
//     const day = d.getDay(); // 0 = Sun
//     d.setDate(d.getDate() - day);
//     d.setHours(0, 0, 0, 0);
//   }
//   return d;
// }

// function sixMonthsAgo(): Date {
//   const d = new Date();
//   d.setMonth(d.getMonth() - 6);
//   d.setDate(1);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// function stockStatus(stock: number): StockStatus {
//   if (stock <= 0) return 'out_of_stock';
//   if (stock <= LOW_STOCK_THRESHOLD) return 'low_stock';
//   return 'in_stock';
// }

// // ── Route handler ─────────────────────────────────────────────────────────────

// export async function GET(req: NextRequest) {
//   // 1. Auth
//   const token = req.headers.get('authorization')?.slice(7);
//   const payload = token ? verifyToken(token) : null;
//   if (!payload || payload.role !== 'VENDOR') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   const vendorId = payload.vendorId as string;

//   const sixMoAgo = sixMonthsAgo();
//   const monthStart = startOf('month');
//   const weekStart = startOf('week');

//   try {
//     // ── 2. Parallel Prisma queries ────────────────────────────────────────

//     const [
//       totalProducts,
//       totalOrders,
//       revenueAgg,
//       pendingOrders,
//       productsThisMonth,
//       ordersThisWeek,
//       ordersLast6M,
//       recentOrdersRaw,
//       topProductsRaw,
//     ] = await Promise.all([
//       // Total live products
//       db.product.count({
//         where: { vendorId, isDeleted: false },
//       }),

//       // Total non-cancelled orders ever
//       db.order.count({
//         where: { vendorId, status: { not: 'Cancelled' } },
//       }),

//       // All-time revenue sum
//       db.order.aggregate({
//         where: { vendorId, status: { not: 'Cancelled' } },
//         _sum: { total: true },
//       }),

//       // Live pending count
//       db.order.count({
//         where: { vendorId, status: 'Pending' },
//       }),

//       // Products created this calendar month (for "+N this month" stat)
//       db.product.count({
//         where: {
//           vendorId,
//           isDeleted: false,
//           createdAt: { gte: monthStart },
//         },
//       }),

//       // Orders placed this week
//       db.order.count({
//         where: {
//           vendorId,
//           status: { not: 'Cancelled' },
//           createdAt: { gte: weekStart },
//         },
//       }),

//       // All orders from last 6 months for chart series + revenue change
//       db.order.findMany({
//         where: {
//           vendorId,
//           status: { not: 'Cancelled' },
//           createdAt: { gte: sixMoAgo },
//         },
//         select: { total: true, createdAt: true },
//         orderBy: { createdAt: 'asc' },
//       }),

//       // 4 most recent orders with customer info
//       db.order.findMany({
//         where: { vendorId },
//         select: {
//           id: true,
//           total: true,
//           status: true,
//           createdAt: true,
//           user: { select: { name: true } },
//         },
//         orderBy: { createdAt: 'desc' },
//         take: 4,
//       }),

//       // Top 4 products by stock / price (revenue leaders)
//       db.product.findMany({
//         where: { vendorId, isDeleted: false },
//         select: {
//           id: true,
//           name: true,
//           price: true,
//           stock: true,
//           unit: true,
//         },
//         orderBy: { price: 'desc' },
//         take: 4,
//       }),
//     ]);

//     // ── 3. Build monthly series (6 months, zero-filled) ───────────────────

//     // Group orders into month buckets
//     const revMap = new Map<string, number>();
//     const ordMap = new Map<string, number>();

//     for (const o of ordersLast6M) {
//       const key = toMonthLabel(o.createdAt);
//       revMap.set(key, (revMap.get(key) ?? 0) + (o.total ?? 0));
//       ordMap.set(key, (ordMap.get(key) ?? 0) + 1);
//     }

//     const monthlyRevenue: MonthlyRevenuPoint[] = [];
//     const monthlyOrders: MonthlyOrderPoint[] = [];

//     for (let i = 5; i >= 0; i--) {
//       const d = new Date();
//       d.setMonth(d.getMonth() - i);
//       const label = toMonthLabel(d);
//       monthlyRevenue.push({ month: label, revenue: revMap.get(label) ?? 0 });
//       monthlyOrders.push({ month: label, orders: ordMap.get(label) ?? 0 });
//     }

//     // ── 4. Revenue change vs prior month ──────────────────────────────────

//     const thisMonthLabel = toMonthLabel(new Date());
//     const prevMonthLabel = toMonthLabel(
//       new Date(new Date().setMonth(new Date().getMonth() - 1)),
//     );
//     const thisMonthRev = revMap.get(thisMonthLabel) ?? 0;
//     const prevMonthRev = revMap.get(prevMonthLabel) ?? 1; // avoid div/0
//     const revenueChange =
//       Math.round(((thisMonthRev - prevMonthRev) / prevMonthRev) * 1000) / 10;

//     // ── 5. Shape recent orders ────────────────────────────────────────────

//     const recentOrders: DashboardOrder[] = recentOrdersRaw.map((o) => ({
//       id: o.id,
//       displayId: `#ORD-${o.id.slice(-4).toUpperCase()}`,
//       customerName: o.user?.name ?? 'Customer',
//       totalAmount: o.total ?? 0,
//       orderStatus: o.status.toLowerCase() as DashboardOrderStatus,
//       createdAt: o.createdAt.toISOString(),
//     }));

//     // ── 6. Shape top products ─────────────────────────────────────────────

//     const topProducts: DashboardProduct[] = topProductsRaw.map((p) => ({
//       id: p.id,
//       name: p.name,
//       price: p.price,
//       stock: p.stock,
//       unit: p.unit ?? 'unit',
//       stockStatus: stockStatus(p.stock),
//     }));

//     // ── 7. Compose response ───────────────────────────────────────────────

//     const payload: VendorDashboardResponse = {
//       vendorName: vendor.storeName ?? vendor.name ?? 'Your Store',
//       stats: {
//         totalProducts,
//         totalOrders,
//         totalRevenue: revenueAgg._sum.total ?? 0,
//         pendingOrders,
//         revenueChange,
//         ordersThisWeek,
//         productsThisMonth,
//       },
//       monthlyRevenue,
//       monthlyOrders,
//       recentOrders,
//       topProducts,
//     };

//     return NextResponse.json(payload, {
//       headers: {
//         'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
//       },
//     });
//   } catch (err) {
//     console.error('[dashboard] GET error', err);
//     return NextResponse.json(
//       { error: 'Failed to load dashboard' },
//       { status: 500 },
//     );
//   }
// }
// src/app/api/vendors/dashboard/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';
import type {
  DashboardOrder,
  DashboardOrderStatus,
  DashboardProduct,
  MonthlyOrderPoint,
  MonthlyRevenuPoint,
  StockStatus,
  VendorDashboardResponse,
} from '@/types/vendor';

// ── Helpers ───────────────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 50;

function toMonthLabel(d: Date): string {
  return d.toLocaleString('en-US', { month: 'short' });
}

function startOf(unit: 'week' | 'month'): Date {
  const d = new Date();
  if (unit === 'month') {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  } else {
    d.setDate(d.getDate() - d.getDay()); // back to Sunday
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

function sixMonthsAgo(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - 6);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'in_stock';
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 1. Auth
  const token = req.headers.get('authorization')?.slice(7);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const vendorId = payload.vendorId as string;

  const sixMoAgo = sixMonthsAgo();
  const monthStart = startOf('month');
  const weekStart = startOf('week');

  try {
    // ── 2. Parallel Prisma queries ────────────────────────────────────────

    const [
      totalProducts,
      totalOrders,
      revenueAgg,
      pendingOrders,
      productsThisMonth,
      ordersThisWeek,
      ordersLast6M,
      recentOrdersRaw,
      topProductsRaw,
      vendorRaw,
    ] = await Promise.all([
      // Total products — no isDeleted field in schema
      db.product.count({
        where: { vendorId },
      }),

      // Total non-cancelled orders
      // Schema uses orderStatus enum: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED
      db.order.count({
        where: { vendorId, orderStatus: { not: 'CANCELLED' } },
      }),

      // All-time revenue — schema field is `totalAmount`, not `total`
      db.order.aggregate({
        where: { vendorId, orderStatus: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),

      // Pending orders
      db.order.count({
        where: { vendorId, orderStatus: 'PENDING' },
      }),

      // Products created this calendar month
      db.product.count({
        where: {
          vendorId,
          createdAt: { gte: monthStart },
        },
      }),

      // Orders placed this week (non-cancelled)
      db.order.count({
        where: {
          vendorId,
          orderStatus: { not: 'CANCELLED' },
          createdAt: { gte: weekStart },
        },
      }),

      // Orders from last 6 months for chart series
      db.order.findMany({
        where: {
          vendorId,
          orderStatus: { not: 'CANCELLED' },
          createdAt: { gte: sixMoAgo },
        },
        select: { totalAmount: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),

      // 4 most recent orders with customer name
      // Schema: Order → customer (User), field is `customerId` / relation `customer`
      db.order.findMany({
        where: { vendorId },
        select: {
          id: true,
          totalAmount: true,
          orderStatus: true,
          createdAt: true,
          customer: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),

      // Top 4 products by price
      db.product.findMany({
        where: { vendorId },
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          unit: true,
        },
        orderBy: { price: 'desc' },
        take: 4,
      }),

      // Vendor name — comes from User.name via vendor.user relation
      db.vendor.findUnique({
        where: { id: vendorId },
        select: {
          businessName: true,
          user: { select: { name: true } },
        },
      }),
    ]);

    // ── 3. Build monthly series (6 months, zero-filled) ───────────────────

    const revMap = new Map<string, number>();
    const ordMap = new Map<string, number>();

    for (const o of ordersLast6M) {
      const key = toMonthLabel(o.createdAt);
      revMap.set(key, (revMap.get(key) ?? 0) + (o.totalAmount ?? 0));
      ordMap.set(key, (ordMap.get(key) ?? 0) + 1);
    }

    const monthlyRevenue: MonthlyRevenuPoint[] = [];
    const monthlyOrders: MonthlyOrderPoint[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = toMonthLabel(d);
      monthlyRevenue.push({ month: label, revenue: revMap.get(label) ?? 0 });
      monthlyOrders.push({ month: label, orders: ordMap.get(label) ?? 0 });
    }

    // ── 4. Revenue change vs prior month ──────────────────────────────────

    const thisMonthLabel = toMonthLabel(new Date());
    const prevMonthLabel = toMonthLabel(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
    );
    const thisMonthRev = revMap.get(thisMonthLabel) ?? 0;
    const prevMonthRev = revMap.get(prevMonthLabel) ?? 1; // avoid div/0
    const revenueChange =
      Math.round(((thisMonthRev - prevMonthRev) / prevMonthRev) * 1000) / 10;

    // ── 5. Shape recent orders ────────────────────────────────────────────

    const recentOrders: DashboardOrder[] = recentOrdersRaw.map((o) => ({
      id: o.id,
      displayId: `#ORD-${o.id.slice(-4).toUpperCase()}`,
      customerName: o.customer?.name ?? 'Customer',
      totalAmount: o.totalAmount ?? 0,
      // orderStatus enum → lowercase for the front-end union type
      orderStatus: o.orderStatus.toLowerCase() as DashboardOrderStatus,
      createdAt: o.createdAt.toISOString(),
    }));

    // ── 6. Shape top products ─────────────────────────────────────────────

    const topProducts: DashboardProduct[] = topProductsRaw.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      unit: p.unit ?? 'unit',
      stockStatus: stockStatus(p.stock),
    }));

    // ── 7. Compose response ───────────────────────────────────────────────

    const vendorName =
      vendorRaw?.businessName ?? vendorRaw?.user?.name ?? 'Your Store';

    const response: VendorDashboardResponse = {
      vendorName,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: revenueAgg._sum.totalAmount ?? 0,
        pendingOrders,
        revenueChange,
        ordersThisWeek,
        productsThisMonth,
      },
      monthlyRevenue,
      monthlyOrders,
      recentOrders,
      topProducts,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error('[dashboard] GET error', err);
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 },
    );
  }
}
