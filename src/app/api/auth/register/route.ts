import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/server/db';

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { message: 'Email already in use' },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { email, password: hashed, name, role: role ?? 'customer' },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, vendorId: null },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  );

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      vendorId: null,
    },
  });
}
