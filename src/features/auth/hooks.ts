import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import { useAuth } from '@/context/AuthContext';
import type { LoginCredentials, RegisterData } from '@/types';

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data.token, data.user); // store token + user in context
      if (data.user.role === 'VENDOR') router.push('/vendor/dashboard');
      else if (data.user.role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/');
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      login(data.token, data.user);
      router.push(data.user.role === 'VENDOR' ? '/vendor/dashboard' : '/');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push('/login');
    },
  });
};
