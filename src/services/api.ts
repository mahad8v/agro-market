import { ApiError } from '@/types';

const BASE_URL = 'http://localhost:3000/api';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  isMultipart?: boolean; // ✅ ADD THIS FLAG
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

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

async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, headers, isMultipart, ...rest } = config; // ✅ extract isMultipart

  const token = getToken();

  // ✅ Don't set Content-Type for multipart — browser sets it automatically
  // with the correct boundary. Setting it manually breaks file uploads.
  const defaultHeaders: HeadersInit = {
    ...(!isMultipart && { 'Content-Type': 'application/json' }),
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

  // ✅ Fixed: pass isMultipart flag so Content-Type is NOT set manually
  upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: formData,
      isMultipart: true,
    });
  },
};

export default api;
