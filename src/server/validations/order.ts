import { z } from 'zod';

export const createOrderSchema = z.object({
  vendorId:        z.string().min(1),
  shippingAddress: z.string().min(5),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity:  z.coerce.number().int().positive(),
    price:     z.coerce.number().positive(),
  })).min(1),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']),
});

export type CreateOrderInput       = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
