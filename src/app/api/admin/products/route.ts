import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';

export async function GET(req: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ── Query params ────────────────────────────────────────────────────────
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search');
    const category = searchParams.get('category'); // category name or id
    const vendorId = searchParams.get('vendorId');
    const isFeatured = searchParams.get('isFeatured'); // 'true' | 'false'
    const isOrganic = searchParams.get('isOrganic'); // 'true' | 'false'
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.max(1, Number(searchParams.get('limit') ?? 20));

    // ── Build where clause ──────────────────────────────────────────────────
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { vendor: { businessName: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (vendorId) where.vendorId = vendorId;

    if (isFeatured !== null && isFeatured !== undefined)
      where.isFeatured = isFeatured === 'true';

    if (isOrganic !== null && isOrganic !== undefined)
      where.isOrganic = isOrganic === 'true';

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      };
    }

    // Filter by category name or id
    if (category) {
      where.category = {
        OR: [
          { name: { contains: category, mode: 'insensitive' } },
          { id: category },
        ],
      };
    }

    // ── Query ───────────────────────────────────────────────────────────────
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          vendor: { select: { id: true, businessName: true, location: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    // ── Shape response ──────────────────────────────────────────────────────
    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      unit: p.unit,
      images: p.images,
      isOrganic: p.isOrganic,
      isFeatured: p.isFeatured,
      harvestDate: p.harvestDate?.toISOString() ?? null,
      location: p.location,
      rating: p.rating,
      totalReviews: p.totalReviews,
      createdAt: p.createdAt.toISOString(),
      category: p.category,
      vendor: p.vendor,
      vendorName: p.vendor.businessName,
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
