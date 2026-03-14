'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/server/auth';
import { productService } from '@/server/services/product.service';
import { createProductSchema, updateProductSchema } from '@/server/validations/product';
import { db } from '@/server/db';

export async function createProductAction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'VENDOR') throw new Error('Unauthorized');

  const vendor = await db.vendor.findUnique({ where: { userId: session.user.id } });
  if (!vendor) throw new Error('Vendor profile not found');

  const parsed = createProductSchema.safeParse({
    name:          formData.get('name'),
    description:   formData.get('description'),
    categoryId:    formData.get('categoryId'),
    price:         formData.get('price'),
    discountPrice: formData.get('discountPrice') || null,
    stock:         formData.get('stock'),
    unit:          formData.get('unit'),
    isOrganic:     formData.get('isOrganic') === 'true',
    location:      formData.get('location'),
    images:        [],
  });
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  const product = await productService.create(vendor.id, parsed.data);
  revalidatePath('/vendor/products');
  return { success: true, product };
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'VENDOR') throw new Error('Unauthorized');

  const parsed = updateProductSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  const product = await productService.update(id, parsed.data);
  revalidatePath('/vendor/products');
  return { success: true, product };
}

export async function deleteProductAction(id: string) {
  const session = await auth();
  if (!session || session.user.role !== 'VENDOR') throw new Error('Unauthorized');
  await productService.delete(id);
  revalidatePath('/vendor/products');
  return { success: true };
}

export async function toggleFeaturedAction(id: string, isFeatured: boolean) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');
  await productService.toggleFeatured(id, isFeatured);
  revalidatePath('/admin/products');
  return { success: true };
}
