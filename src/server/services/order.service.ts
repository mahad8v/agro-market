import { db } from '@/server/db';
import { CreateOrderInput } from '@/server/validations/order';

export const orderService = {
  async create(customerId: string, data: CreateOrderInput) {
    const vendor = await db.vendor.findUnique({ where: { id: data.vendorId } });
    if (!vendor) throw new Error('Vendor not found');

    const totalAmount      = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const commissionAmount = totalAmount * vendor.commissionRate;
    const vendorEarning    = totalAmount - commissionAmount;

    return db.order.create({
      data: {
        customerId, vendorId: data.vendorId,
        shippingAddress: data.shippingAddress,
        totalAmount, commissionAmount, vendorEarning,
        items: { create: data.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
      },
      include: { items: true },
    });
  },

  async getByVendor(vendorId: string, params?: { status?: string }) {
    return db.order.findMany({
      where:   { vendorId, ...(params?.status && { orderStatus: params.status as any }) },
      include: { customer: { select: { name: true, email: true } }, items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getByCustomer(customerId: string) {
    return db.order.findMany({
      where:   { customerId },
      include: { vendor: { select: { businessName: true } }, items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAll(params?: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = params ?? {};
    const where = status ? { orderStatus: status as any } : {};
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { customer: { select: { name: true } }, vendor: { select: { businessName: true } }, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(id: string, orderStatus: string) {
    return db.order.update({ where: { id }, data: { orderStatus: orderStatus as any } });
  },

  async getAdminStats() {
    const [totalVendors, totalProducts, totalOrders, revenueAgg, pendingVendors] = await Promise.all([
      db.vendor.count(),
      db.product.count(),
      db.order.count(),
      db.order.aggregate({ _sum: { commissionAmount: true } }),
      db.vendor.count({ where: { status: 'PENDING' } }),
    ]);
    return {
      totalVendors, totalProducts, totalOrders,
      platformRevenue: revenueAgg._sum.commissionAmount ?? 0,
      pendingVendors,
    };
  },
};
