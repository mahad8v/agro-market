import { db } from '@/server/db';
import { UpdateVendorInput } from '@/server/validations/vendor';

export const vendorService = {
  async getAll(params?: { status?: string; search?: string }) {
    const { status, search } = params ?? {};
    return db.vendor.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(search && {
          OR: [
            { businessName: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return db.vendor.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        products: { take: 6 },
        _count: { select: { products: true, orders: true } },
      },
    });
  },

  async getByUserId(userId: string) {
    return db.vendor.findUnique({
      where: { userId },
      include: { _count: { select: { products: true, orders: true } } },
    });
  },

  async update(id: string, data: UpdateVendorInput) {
    return db.vendor.update({ where: { id }, data });
  },

  async approve(id: string) {
    return db.vendor.update({
      where: { id },
      data: { status: 'APPROVED', isVerified: true },
    });
  },

  async suspend(id: string) {
    return db.vendor.update({ where: { id }, data: { status: 'SUSPENDED' } });
  },

  async delete(id: string) {
    return db.vendor.delete({ where: { id } });
  },

  async getStats(vendorId: string) {
    const [totalProducts, totalOrders, revenueAgg, pendingOrders] =
      await Promise.all([
        db.product.count({ where: { vendorId } }),
        db.order.count({ where: { vendorId } }),
        db.order.aggregate({
          where: { vendorId },
          _sum: { vendorEarning: true },
        }),
        db.order.count({ where: { vendorId, orderStatus: 'PENDING' } }),
      ]);
    return {
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg._sum.vendorEarning ?? 0,
      pendingOrders,
    };
  },

  async getFeatured() {
    return db.vendor.findMany({
      where: { status: 'APPROVED', isVerified: true },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { products: true } },
      },
      orderBy: { rating: 'desc' },
      take: 8,
    });
  },
};
