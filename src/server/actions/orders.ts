'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/server/auth';
import { orderService } from '@/server/services/order.service';
import { createOrderSchema, updateOrderStatusSchema } from '@/server/validations/order';

export async function createOrderAction(data: unknown) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const parsed = createOrderSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);
  const order = await orderService.create(session.user.id!, parsed.data);
  revalidatePath('/orders');
  return { success: true, order };
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const session = await auth();
  if (!session || !['VENDOR','ADMIN'].includes(session.user.role)) throw new Error('Unauthorized');
  const parsed = updateOrderStatusSchema.safeParse({ orderStatus: status });
  if (!parsed.success) throw new Error('Invalid status');
  await orderService.updateStatus(orderId, parsed.data.orderStatus);
  revalidatePath('/vendor/orders');
  revalidatePath('/admin/orders');
  return { success: true };
}
