import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.max(1, Number(searchParams.get('limit') ?? 20));

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [vendors, total] = await Promise.all([
      db.vendor.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          products: { select: { id: true } },
          orders: {
            select: { id: true, totalAmount: true, vendorEarning: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.vendor.count({ where }),
    ]);

    const data = vendors.map((v) => ({
      id: v.id,
      businessName: v.businessName,
      slug: v.slug,
      description: v.description,
      logo: v.logo,
      banner: v.banner,
      phone: v.phone,
      location: v.location,
      rating: v.rating,
      totalReviews: v.totalReviews,
      isVerified: v.isVerified,
      status: v.status,
      commissionRate: v.commissionRate,
      subscriptionPlan: v.subscriptionPlan,
      createdAt: v.createdAt.toISOString(),
      user: v.user,
      totalProducts: v.products.length,
      totalOrders: v.orders.length,
      totalRevenue: v.orders.reduce(
        (sum, o) => sum + (o.vendorEarning ?? 0),
        0,
      ),
    }));

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
