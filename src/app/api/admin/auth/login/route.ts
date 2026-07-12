import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/server/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({
    where: { email },
    include: { vendor: { select: { id: true } } },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 },
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendor?.id ?? null,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  );

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase(),
      vendorId: user.vendor?.id ?? null,
    },
  });
}
