'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

import { authApi } from '../features/auth/api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserRole,
} from '../types';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── REDIRECT MAP ─────────────────────────────────────────────────────────────

const ROLE_REDIRECT: Record<UserRole, string> = {
  customer: '/',
  vendor: '/vendor/dashboard',
  admin: '/admin/dashboard',
};

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response: AuthResponse = await authApi.login(credentials);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      router.push(ROLE_REDIRECT[response.user.role]);
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const response: AuthResponse = await authApi.register(data);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      router.push(ROLE_REDIRECT[response.user.role]);
    },
    [router],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  }, [router]);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
