'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/server/auth';
import { categoryService } from '@/server/services/category.service';

export async function createCategoryAction(data: { name: string; icon?: string; description?: string }) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') throw new Error('Unauthorized');
  const category = await categoryService.create(data);
  revalidatePath('/admin/categories');
  return { success: true, category };
}

export async function updateCategoryAction(id: string, data: { name?: string; icon?: string; description?: string }) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') throw new Error('Unauthorized');
  const category = await categoryService.update(id, data);
  revalidatePath('/admin/categories');
  return { success: true, category };
}

export async function deleteCategoryAction(id: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') throw new Error('Unauthorized');
  await categoryService.delete(id);
  revalidatePath('/admin/categories');
  return { success: true };
}
