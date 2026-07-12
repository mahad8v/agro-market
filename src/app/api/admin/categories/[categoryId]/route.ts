import { NextResponse } from 'next/server';
import { categoryService } from '@/server/services/category.service';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;
    const body = await request.json();
    const category = await categoryService.update(categoryId, body);
    return NextResponse.json(category);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// src/app/api/admin/categories/[categoryId]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;
    await categoryService.delete(categoryId); // was: .remove(categoryId)
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
