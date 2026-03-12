import api from '@/services/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

export const authApi = {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  register(data: RegisterData): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', data);
  },

  logout(): Promise<void> {
    return api.post<void>('/auth/logout');
  },

  getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },
};
