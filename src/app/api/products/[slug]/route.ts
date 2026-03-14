import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const product = await productService.getBySlug(params.slug);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
