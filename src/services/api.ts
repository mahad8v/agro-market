// src/services/api.ts
import axios from 'axios';
import { ApiError } from '@/types/client';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// ── Request interceptor: always attach token from cookie ────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: unwrap data, normalize errors, handle 401 ─────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    const apiError: ApiError = {
      message:
        error.response?.data?.message ?? error.message ?? 'An error occurred',
      statusCode: error.response?.status ?? 500,
    };
    return Promise.reject(apiError);
  },
);

export default api;
