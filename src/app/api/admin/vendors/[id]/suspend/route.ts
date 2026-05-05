import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = req.headers.get('authorization')?.slice(7);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const vendor = await db.vendor.update({
    where: { id },
    data: { status: 'SUSPENDED', isVerified: false },
    include: { user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(vendor);
}
