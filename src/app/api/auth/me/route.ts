import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/server/db';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await db.user.findUnique({
      where: { id: payload.id },
      include: { vendor: { select: { id: true } } },
    });
    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      vendorId: user.vendor?.id ?? null,
    });
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
