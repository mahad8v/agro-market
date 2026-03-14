import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await productService.getAll({
      categoryId: searchParams.get('categoryId') ?? undefined,
      vendorId: searchParams.get('vendorId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 12),
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
