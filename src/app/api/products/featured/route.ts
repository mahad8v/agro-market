import { NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';

export async function GET() {
  try {
    const result = await productService.getAll({ featured: true, limit: 8 });
    return NextResponse.json(result.products);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
