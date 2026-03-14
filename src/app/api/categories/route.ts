import { NextResponse } from 'next/server';
import { categoryService } from '@/server/services/category.service';

export async function GET() {
  try {
    return NextResponse.json(await categoryService.getAll());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
