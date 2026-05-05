// import { db } from '@/server/db';
// import { CreateOrderInput } from '@/server/validations/order';

// export const orderService = {
//   async create(customerId: string, data: CreateOrderInput) {
//     const vendor = await db.vendor.findUnique({ where: { id: data.vendorId } });
//     if (!vendor) throw new Error('Vendor not found');

//     const totalAmount      = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
//     const commissionAmount = totalAmount * vendor.commissionRate;
//     const vendorEarning    = totalAmount - commissionAmount;

//     return db.order.create({
//       data: {
//         customerId, vendorId: data.vendorId,
//         shippingAddress: data.shippingAddress,
//         totalAmount, commissionAmount, vendorEarning,
//         items: { create: data.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
//       },
//       include: { items: true },
//     });
//   },

//   async getByVendor(vendorId: string, params?: { status?: string }) {
//     return db.order.findMany({
//       where:   { vendorId, ...(params?.status && { orderStatus: params.status as any }) },
//       include: { customer: { select: { name: true, email: true } }, items: { include: { product: { select: { name: true, images: true } } } } },
//       orderBy: { createdAt: 'desc' },
//     });
//   },

//   async getByCustomer(customerId: string) {
//     return db.order.findMany({
//       where:   { customerId },
//       include: { vendor: { select: { businessName: true } }, items: { include: { product: { select: { name: true, images: true } } } } },
//       orderBy: { createdAt: 'desc' },
//     });
//   },

//   async getAll(params?: { status?: string; page?: number; limit?: number }) {
//     const { status, page = 1, limit = 20 } = params ?? {};
//     const where = status ? { orderStatus: status as any } : {};
//     const [orders, total] = await Promise.all([
//       db.order.findMany({
//         where,
//         include: { customer: { select: { name: true } }, vendor: { select: { businessName: true } }, items: true },
//         orderBy: { createdAt: 'desc' },
//         skip: (page - 1) * limit,
//         take: limit,
//       }),
//       db.order.count({ where }),
//     ]);
//     return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
//   },

//   async updateStatus(id: string, orderStatus: string) {
//     return db.order.update({ where: { id }, data: { orderStatus: orderStatus as any } });
//   },

//   async getAdminStats() {
//     const [totalVendors, totalProducts, totalOrders, revenueAgg, pendingVendors] = await Promise.all([
//       db.vendor.count(),
//       db.product.count(),
//       db.order.count(),
//       db.order.aggregate({ _sum: { commissionAmount: true } }),
//       db.vendor.count({ where: { status: 'PENDING' } }),
//     ]);
//     return {
//       totalVendors, totalProducts, totalOrders,
//       platformRevenue: revenueAgg._sum.commissionAmount ?? 0,
//       pendingVendors,
//     };
//   },
// };
import { db } from '@/server/db';
import { CreateOrderInput } from '@/server/validations/order';

export const orderService = {
  async create(customerId: string, data: CreateOrderInput) {
    const vendor = await db.vendor.findUnique({ where: { id: data.vendorId } });
    if (!vendor) throw new Error('Vendor not found');

    const totalAmount = data.items.reduce(
      (s, i) => s + i.price * i.quantity,
      0,
    );
    const commissionAmount = totalAmount * vendor.commissionRate;
    const vendorEarning = totalAmount - commissionAmount;

    return db.order.create({
      data: {
        customerId,
        vendorId: data.vendorId,
        shippingAddress: data.shippingAddress,
        totalAmount,
        commissionAmount,
        vendorEarning,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });
  },

  async getByVendor(vendorId: string, params?: { status?: string }) {
    return db.order.findMany({
      where: {
        vendorId,
        ...(params?.status && { orderStatus: params.status as any }),
      },
      include: {
        customer: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getByCustomer(customerId: string) {
    return db.order.findMany({
      where: { customerId },
      include: {
        vendor: { select: { businessName: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAll(params?: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = params ?? {};
    const where = status ? { orderStatus: status as any } : {};
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          customer: { select: { name: true } },
          vendor: { select: { businessName: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(id: string, orderStatus: string) {
    return db.order.update({
      where: { id },
      data: { orderStatus: orderStatus as any },
    });
  },

  async getAdminStats() {
    // ── Base counts ──────────────────────────────────────────────────────────
    const [
      totalVendors,
      totalProducts,
      totalOrders,
      revenueAgg,
      pendingVendors,
      approvedVendors,
      suspendedVendors,
      verifiedVendors,
      proVendors,
    ] = await Promise.all([
      db.vendor.count(),
      db.product.count(),
      db.order.count(),
      db.order.aggregate({ _sum: { commissionAmount: true } }),
      db.vendor.count({ where: { status: 'PENDING' } }),
      db.vendor.count({ where: { status: 'APPROVED' } }),
      db.vendor.count({ where: { status: 'SUSPENDED' } }),
      db.vendor.count({ where: { isVerified: true } }),
      // db.vendor.count({
      //   where: { subscriptionPlan: { in: ['PRO', 'ENTERPRISE'] } },
      // }),
      // CORRECT — matches your schema enum values
      db.vendor.count({
        where: { subscriptionPlan: { in: ['PRO', 'ENTERPRISE'] as any } },
      }),
    ]);

    // ── Monthly revenue (last 6 months) ──────────────────────────────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyOrders = await db.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { commissionAmount: true, createdAt: true },
    });

    // Group by month label e.g. "Jan", "Feb"
    const monthMap: Record<string, number> = {};
    monthlyOrders.forEach((o) => {
      const label = o.createdAt.toLocaleString('en-US', { month: 'short' });
      monthMap[label] = (monthMap[label] ?? 0) + (o.commissionAmount ?? 0);
    });

    // Build ordered array for the last 6 months
    const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const label = d.toLocaleString('en-US', { month: 'short' });
      return { month: label, revenue: monthMap[label] ?? 0 };
    });

    // ── Recent orders (last 5) ───────────────────────────────────────────────
    const recentOrdersRaw = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true } },
        vendor: { select: { businessName: true } },
        items: true,
      },
    });

    const recentOrders = recentOrdersRaw.map((o) => ({
      id: o.id,
      customerId: o.customerId,
      customerName: o.customer.name,
      vendorId: o.vendorId,
      vendorName: o.vendor.businessName,
      items: o.items,
      totalAmount: o.totalAmount,
      commissionAmount: o.commissionAmount,
      vendorEarning: o.vendorEarning,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      shippingAddress: o.shippingAddress,
      createdAt: o.createdAt.toISOString(),
    }));

    // ── Vendor breakdown ─────────────────────────────────────────────────────
    const vendorBreakdown = {
      approved: approvedVendors,
      pending: pendingVendors,
      suspended: suspendedVendors,
      verified: verifiedVendors,
      pro: proVendors,
    };

    return {
      totalVendors,
      totalProducts,
      totalOrders,
      platformRevenue: revenueAgg._sum.commissionAmount ?? 0,
      pendingVendors,
      monthlyRevenue,
      recentOrders,
      vendorBreakdown,
    };
  },
};
