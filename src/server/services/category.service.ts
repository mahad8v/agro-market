import { db } from '@/server/db';
import slugify from 'slugify';

export const categoryService = {
  async getAll() {
    return db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  },

  async create(data: { name: string; icon?: string; description?: string }) {
    return db.category.create({ data: { ...data, slug: slugify(data.name, { lower: true, strict: true }) } });
  },

  async update(id: string, data: { name?: string; icon?: string; description?: string }) {
    return db.category.update({
      where: { id },
      data:  { ...data, ...(data.name && { slug: slugify(data.name, { lower: true, strict: true }) }) },
    });
  },

  async delete(id: string) {
    return db.category.delete({ where: { id } });
  },
};
