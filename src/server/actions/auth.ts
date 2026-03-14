'use server';
import { signIn, signOut } from '@/server/auth';
import { authService } from '@/server/services/auth.service';
import { registerSchema } from '@/server/validations/auth';
import { AuthError } from 'next-auth';

export async function loginAction(email: string, password: string) {
  try {
    await signIn('credentials', { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) return { success: false, error: 'Invalid email or password' };
    throw error;
  }
}

export async function registerAction(data: unknown) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };
  try {
    await authService.register(parsed.data);
    await signIn('credentials', { email: parsed.data.email, password: parsed.data.password, redirect: false });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message ?? 'Registration failed' };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
  return { success: true };
}
