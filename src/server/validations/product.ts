import { z } from 'zod';

export const createProductSchema = z.object({
  name:          z.string().min(3),
  description:   z.string().min(10),
  categoryId:    z.string().min(1),
  price:         z.coerce.number().positive(),
  discountPrice: z.coerce.number().positive().optional().nullable(),
  stock:         z.coerce.number().int().min(0),
  unit:          z.enum(['KG','BAG','CRATE','TON','PIECE']),
  isOrganic:     z.coerce.boolean().default(false),
  harvestDate:   z.string().optional().nullable(),
  location:      z.string().min(2),
  images:        z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
