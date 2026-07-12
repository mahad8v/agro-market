import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/server/services/category.service';
import { verifyToken } from '@/server/jwt';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    return NextResponse.json(await categoryService.getAll());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const category = await categoryService.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (e: any) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      const field = (e.meta?.target as string[])?.[0] ?? 'name';
      return NextResponse.json(
        { error: `A category with this ${field} already exists.` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
