import { z } from 'zod';

export const updateVendorSchema = z.object({
  businessName: z.string().min(2).optional(),
  description:  z.string().optional(),
  phone:        z.string().optional(),
  location:     z.string().min(2).optional(),
  logo:         z.string().url().optional().nullable(),
  banner:       z.string().url().optional().nullable(),
});

export const registerVendorSchema = z.object({
  businessName: z.string().min(2),
  location:     z.string().min(2),
  phone:        z.string().optional(),
  description:  z.string().optional(),
});

export type UpdateVendorInput   = z.infer<typeof updateVendorSchema>;
export type RegisterVendorInput = z.infer<typeof registerVendorSchema>;
