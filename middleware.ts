import { ApiError } from './src/types';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ─── REQUEST CONFIG ───────────────────────────────────────────────────────────

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// ─── TOKEN HELPER ─────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// ─── BUILD URL WITH QUERY PARAMS ──────────────────────────────────────────────

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

// ─── CORE FETCH WRAPPER ───────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, headers, ...rest } = config;

  const token = getToken();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    const errorBody = isJson
      ? await response.json()
      : { message: response.statusText };
    const apiError: ApiError = {
      message: errorBody.message || 'An error occurred',
      statusCode: response.status,
    };
    throw apiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return isJson ? response.json() : (response.text() as T);
}

// ─── HTTP METHODS ─────────────────────────────────────────────────────────────

export const api = {
  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    return request<T>(endpoint, { method: 'GET', params });
  },

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },

  // For file uploads (multipart/form-data)
  upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = getToken();
    return request<T>(endpoint, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  },
};

export default api;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth info from cookie (set on client login)
  const userCookie = request.cookies.get('agri_user');

  // Protected route checks
  if (pathname.startsWith('/vendor')) {
    if (!userCookie) {
      return NextResponse.redirect(
        new URL('/login?redirect=' + pathname, request.url),
      );
    }
    try {
      const user = JSON.parse(userCookie.value);
      if (user.role !== 'vendor' && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!userCookie) {
      return NextResponse.redirect(
        new URL('/login?redirect=' + pathname, request.url),
      );
    }
    try {
      const user = JSON.parse(userCookie.value);
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendor/:path*', '/admin/:path*'],
};
