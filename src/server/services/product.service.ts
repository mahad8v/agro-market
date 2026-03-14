import { db } from '@/server/db';
import { CreateProductInput, UpdateProductInput } from '@/server/validations/product';
import slugify from 'slugify';

export const productService = {
  async getAll(params?: { categoryId?: string; vendorId?: string; search?: string; page?: number; limit?: number }) {
    const { categoryId, vendorId, search, page = 1, limit = 12 } = params ?? {};
    const where = {
      ...(categoryId && { categoryId }),
      ...(vendorId   && { vendorId }),
      ...(search && { OR: [
        { name:        { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ]}),
    };
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { vendor: { select: { businessName: true, slug: true } }, category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getBySlug(slug: string) {
    return db.product.findUnique({
      where:   { slug },
      include: {
        vendor:   { select: { id: true, businessName: true, slug: true, rating: true, isVerified: true } },
        category: true,
        reviews:  { include: { user: { select: { name: true, avatar: true } } }, take: 10 },
      },
    });
  },

  async getByVendor(vendorId: string) {
    return db.product.findMany({
      where:   { vendorId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(vendorId: string, data: CreateProductInput) {
    const slug = slugify(data.name, { lower: true, strict: true });
    return db.product.create({ data: { ...data, slug, vendorId } });
  },

  async update(id: string, data: UpdateProductInput) {
    return db.product.update({
      where: { id },
      data:  { ...data, ...(data.name && { slug: slugify(data.name, { lower: true, strict: true }) }) },
    });
  },

  async delete(id: string) {
    return db.product.delete({ where: { id } });
  },

  async toggleFeatured(id: string, isFeatured: boolean) {
    return db.product.update({ where: { id }, data: { isFeatured } });
  },
};
