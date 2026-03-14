'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/server/auth';
import { vendorService } from '@/server/services/vendor.service';
import { updateVendorSchema } from '@/server/validations/vendor';

export async function approveVendorAction(vendorId: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') throw new Error('Unauthorized');
  await vendorService.approve(vendorId);
  revalidatePath('/admin/vendors');
  return { success: true };
}

export async function suspendVendorAction(vendorId: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') throw new Error('Unauthorized');
  await vendorService.suspend(vendorId);
  revalidatePath('/admin/vendors');
  return { success: true };
}

export async function deleteVendorAction(vendorId: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') throw new Error('Unauthorized');
  await vendorService.delete(vendorId);
  revalidatePath('/admin/vendors');
  return { success: true };
}

export async function updateVendorSettingsAction(vendorId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const parsed = updateVendorSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);
  await vendorService.update(vendorId, parsed.data);
  revalidatePath('/vendor/settings');
  return { success: true };
}
