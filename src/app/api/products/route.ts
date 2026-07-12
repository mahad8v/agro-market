import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';

// GET /api/vendors/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search') ?? '';
    const category = searchParams.get('category') ?? '';
    const stockFilter = searchParams.get('stock') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.max(1, Number(searchParams.get('limit') ?? 20));

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      where.category = { name: { contains: category, mode: 'insensitive' } };
    }

    if (stockFilter === 'in_stock') where.stock = { gt: 50 };
    else if (stockFilter === 'low_stock') where.stock = { gt: 0, lte: 50 };
    else if (stockFilter === 'out_of_stock') where.stock = 0;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/vendors/products
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'VENDOR')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      unit,
      categoryId,
      location, // ← required by schema
      isOrganic,
      isFeatured,
      images,
    } = body;

    if (!name || !price || !stock || !unit || !categoryId || !location) {
      return NextResponse.json(
        {
          error:
            'name, price, stock, unit, categoryId, and location are required',
        },
        { status: 400 },
      );
    }

    // Generate a unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const existing = await db.product.count({
      where: { slug: { startsWith: baseSlug } },
    });
    const slug = existing > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description ?? '',
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock),
        unit,
        categoryId,
        vendorId: payload.vendorId,
        location, // ← now included
        isOrganic: isOrganic ?? false,
        isFeatured: isFeatured ?? false,
        images: images ?? [],
      },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
