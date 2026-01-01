/**
 * Ecommerce API Client
 * 
 * Thiết kế đơn giản, dễ sử dụng:
 * - createApiClient({ token }) → tạo client với auth
 * - Client có các methods: get, post, patch, delete
 */

// ============================================================================
// CONFIG
// ============================================================================

export const API_URL = process.env.NEXT_PUBLIC_ECOMMERCE_API_URL || 'http://localhost:3001';

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }

  static isUnauthorized(error: unknown): boolean {
    return error instanceof ApiError && error.status === 401;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface ApiClientOptions {
  token?: string | null;
  baseUrl?: string;
}

export interface ApiClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, data?: unknown) => Promise<T>;
  patch: <T>(endpoint: string, data?: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

// ============================================================================
// FACTORY
// ============================================================================

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const { token, baseUrl = API_URL } = options;

  // Headers builder
  const getHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  // Response handler
  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const message = response.status === 401 
        ? 'Vui lòng đăng nhập để tiếp tục'
        : `Lỗi: ${response.statusText}`;
      throw new ApiError(message, response.status);
    }
    
    // Handle empty response
    const text = await response.text();
    if (!text) return {} as T;
    
    return JSON.parse(text);
  }

  // Request wrapper với error handling
  async function request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: getHeaders(),
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Lỗi kết nối mạng', 0);
    }
  }

  return {
    get: <T>(endpoint: string) => 
      request<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, { 
        method: 'POST', 
        body: data ? JSON.stringify(data) : undefined 
      }),

    patch: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, { 
        method: 'PATCH', 
        body: data ? JSON.stringify(data) : undefined 
      }),

    delete: <T>(endpoint: string) =>
      request<T>(endpoint, { method: 'DELETE' }),
  };
}
