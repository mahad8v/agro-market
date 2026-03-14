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

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ROLE_REDIRECT: Record<UserRole, string> = {
  CUSTOMER: '/',
  VENDOR: '/vendor/dashboard',
  ADMIN: '/admin/dashboard',
};

// ── helpers ──────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'auth_token'; // single source of truth — use this everywhere

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'auth_token=; path=/; max-age=0';
}

// ── provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        clearToken(); // token expired or invalid
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response: AuthResponse = await authApi.login(credentials);
      saveToken(response.token);
      setUser(response.user);
      await new Promise((resolve) => setTimeout(resolve, 50));
      console.log(response.user);
      router.replace(ROLE_REDIRECT[response.user.role]);
      // router.replace('admin/dasboard');

      router.refresh();
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const response: AuthResponse = await authApi.register(data);
      saveToken(response.token);
      setUser(response.user);
      router.push(ROLE_REDIRECT[response.user.role]);
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // tell backend to invalidate token
    } catch {
    } finally {
      clearToken();
      setUser(null);
      router.push('/login');
    }
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
