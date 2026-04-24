import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await productService.getAll({
      category: searchParams.get('category') ?? undefined,
      vendorId: searchParams.get('vendorId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      isOrganic: searchParams.get('isOrganic') === 'true' ? true : undefined,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      location: searchParams.get('location') ?? undefined,
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 12),
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
