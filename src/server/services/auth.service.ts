import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { db } from '@/server/db';
import { RegisterInput } from '@/server/validations/auth';

export const authService = {
  async register(data: RegisterInput) {
    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');

    const hashed = await bcrypt.hash(data.password, 12);

    return db.user.create({
      data: {
        name: data.name, email: data.email, password: hashed,
        role: data.role ?? 'CUSTOMER',
        ...(data.role === 'VENDOR' && data.businessName && {
          vendor: {
            create: {
              businessName: data.businessName,
              slug:         slugify(data.businessName, { lower: true, strict: true }),
              location:     data.location ?? '',
              status:       'PENDING',
            },
          },
        }),
      },
      include: { vendor: true },
    });
  },
};
