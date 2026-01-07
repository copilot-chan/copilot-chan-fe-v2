// Imports removed as they are no longer needed for internal logic

// ============================================================================
// CONFIG
// ============================================================================

export const API_URL = process.env.NEXT_PUBLIC_ECOMMERCE_API_URL || 'http://localhost:8000';

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
  get: <T>(endpoint: string, headers?: HeadersInit) => Promise<T>;
  post: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) => Promise<T>;
  patch: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) => Promise<T>;
  delete: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) => Promise<T>;
}

// ============================================================================
// FACTORY
// ============================================================================

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const { token, baseUrl = API_URL } = options;

  // Headers builder
  const getHeaders = (body?: any): Record<string, string> => {
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Only add JSON content type if body is NOT FormData
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  // Response handler
  async function handleResponse<T>(response: Response): Promise<T> {
    // Try to parse JSON body even on error
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      // Use error message from backend if available
      // Use error message from backend if available
      const backendError = data.error || data.message || data.detail;
      
      let message = '';

      if (Array.isArray(backendError)) {
          // Handle FastAPI validation errors array
          message = backendError.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
      } else if (typeof backendError === 'string') {
          message = backendError;
      } else if (backendError) {
          message = JSON.stringify(backendError);
      }
      
      if (!message) {
         message = response.status === 401 
            ? 'Vui lòng đăng nhập để tiếp tục'
            : `Lỗi: ${response.statusText}`;
      }
      
      throw new ApiError(message, response.status);
    }
    
    return data as T;
  }

  // Request wrapper với error handling
  async function request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    try {
      const { body, ...rest } = options;
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...rest,
        body,
        headers: {
          ...getHeaders(body),
          ...options.headers,
        },
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Lỗi kết nối mạng', 0);
    }
  }

  return {
    get: <T>(endpoint: string, headers?: HeadersInit) => 
      request<T>(endpoint, { method: 'GET', headers }),

    post: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) =>
      request<T>(endpoint, { 
        method: 'POST', 
        body: data instanceof FormData || data instanceof URLSearchParams 
          ? (data as any) 
          : (data ? JSON.stringify(data) : undefined),
        headers
      }),

    patch: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) =>
      request<T>(endpoint, { 
        method: 'PATCH', 
        body: data ? JSON.stringify(data) : undefined,
        headers
      }),

    delete: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) =>
      request<T>(endpoint, { 
        method: 'DELETE', 
        body: data ? JSON.stringify(data) : undefined,
        headers 
      }),
  };
}
