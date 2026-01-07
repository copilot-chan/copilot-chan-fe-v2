/**
 * Ecommerce API Provider
 * 
 * Cung cấp các hooks dễ sử dụng cho ecommerce:
 * - useEcommerceApi() → lấy api client
 * - useProducts() → CRUD products
 * - useCollections() → CRUD collections  
 * - useCartApi() → cart operations (cần auth)
 */

'use client';

import { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { createApiClient, ApiClient, ApiError } from '@/lib/ecomerce/foodshop/api/client';
import type { Product, Collection, Cart } from '@/lib/ecomerce/foodshop/types';

// ============================================================================
// CONTEXT
// ============================================================================

interface EcommerceApiContextType {
  api: ApiClient;
  isAuthenticated: boolean;
  isLoading: boolean;
  requireAuth: () => void;
}

const EcommerceApiContext = createContext<EcommerceApiContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function EcommerceApiProvider({ children }: { children: React.ReactNode }) {
  const { token, loading, login } = useAuth();
  
  const api = useMemo(() => createApiClient({ token }), [token]);
  
  const requireAuth = useCallback(() => {
    if (!token) {
      // login(); // Cannot call login directly as it requires payload now
      throw new ApiError('Vui lòng đăng nhập', 401);
    }
  }, [token, login]);

  const value = useMemo(() => ({
    api,
    isAuthenticated: !!token,
    isLoading: loading,
    requireAuth,
  }), [api, token, loading, requireAuth]);

  return (
    <EcommerceApiContext.Provider value={value}>
      {children}
    </EcommerceApiContext.Provider>
  );
}

// ============================================================================
// BASE HOOK
// ============================================================================

export function useEcommerceApi() {
  const context = useContext(EcommerceApiContext);
  if (!context) {
    throw new Error('useEcommerceApi must be used within EcommerceApiProvider');
  }
  return context;
}

// ============================================================================
// PRODUCTS HOOK
// ============================================================================

interface ProductsParams {
  query?: string;
  collection?: string;
  sortKey?: string;
  reverse?: boolean;
  limit?: number;
  offset?: number;
}

export function useProducts() {
  const { api } = useEcommerceApi();

  const getProducts = useCallback(async (params: ProductsParams = {}) => {
    const { query, collection, sortKey, reverse, limit, offset } = params;
    const queryParams = new URLSearchParams();
    
    if (query) queryParams.set('q', query);
    if (collection) queryParams.set('collections_like', collection);
    if (sortKey) queryParams.set('_sort', sortKey);
    if (reverse !== undefined) queryParams.set('_order', reverse ? 'desc' : 'asc');
    if (offset !== undefined) queryParams.set('offset', offset.toString());
    if (limit !== undefined) queryParams.set('limit', limit.toString());
    
    const endpoint = `/products/${queryParams.toString() ? '?' + queryParams : ''}`;
    return api.get<Product[]>(endpoint);
  }, [api]);

  const getProduct = useCallback(async (handle: string) => {
    return api.get<Product>(`/products/${handle}/`);
  }, [api]);

  const getRecommendations = useCallback(async (productId: string) => {
    const products = await api.get<Product[]>('/products/?_limit=5');
    return products.filter(p => p.id !== productId).slice(0, 4);
  }, [api]);

  return useMemo(() => ({ getProducts, getProduct, getRecommendations }), [getProducts, getProduct, getRecommendations]);
}

// ============================================================================
// COLLECTIONS HOOK
// ============================================================================

export function useCollections() {
  const { api } = useEcommerceApi();

  const getCollections = useCallback(async () => {
    const collections = await api.get<Collection[]>('/collections/');
    return collections.map(c => ({
      ...c,
      path: `/search/${c.handle}`,
    }));
  }, [api]);

  const getCollection = useCallback(async (handle: string) => {
    try {
      const collection = await api.get<Collection>(`/collections/${handle}/`);
      return {
        ...collection,
        path: `/search/${collection.handle}`,
      };
    } catch {
      return undefined;
    }
  }, [api]);

  return useMemo(() => ({ getCollections, getCollection }), [getCollections, getCollection]);
}

// ============================================================================
// MENU HOOK
// ============================================================================

interface MenuResponse {
  handle: string;
  items: { title: string; path: string }[];
}

export function useMenu() {
  const { api } = useEcommerceApi();

  const getMenu = useCallback(async (handle: string) => {
    try {
      const menu = await api.get<MenuResponse>(`/menus/?handle=${handle}`);
      return menu.items || [];
    } catch {
      return [];
    }
  }, [api]);

  return useMemo(() => ({ getMenu }), [getMenu]);
}

// ============================================================================
// AUTH HOOK API
// ============================================================================
    
import { 
  AuthResponse, 
  CreateOrderPayload, 
  LoginPayload, 
  Order, 
  RegisterPayload, 
  User 
} from '@/lib/ecomerce/foodshop/types';

export function useAuthApi() {
    const { api } = useEcommerceApi();

    const login = useCallback( async (data: LoginPayload) => {
        return api.post<AuthResponse>('/auth/login', {
            email: data.email,
            password: data.password
        });
    }, [api]);

    const register = useCallback( async (data: RegisterPayload) => {
        return api.post<AuthResponse>('/auth/register', data);
    }, [api]);

    const me = useCallback( async () => {
        return api.get<User>('/auth/me/');
    }, [api]);

    return useMemo(() => ({ login, register, me }), [login, register, me]);
}

export function useOrderApi() {
  const { api } = useEcommerceApi();

  const createOrder = useCallback(async (data: CreateOrderPayload) => {
    return api.post<Order>('/orders/', data);
  }, [api]);

  const listOrders = useCallback(async () => {
    return api.get<Order[]>('/orders/');
  }, [api]);

  const getOrder = useCallback(async (orderId: string) => {
    return api.get<Order>(`/orders/${orderId}`);
  }, [api]);

  const updateOrder = useCallback(async (orderId: string, data: { financialStatus?: string; fulfillmentStatus?: string }) => {
    return api.patch<Order>(`/orders/${orderId}`, data);
  }, [api]);

  const cancelOrder = useCallback(async (orderId: string) => {
    return api.post<Order>(`/orders/${orderId}/cancel`, {});
  }, [api]);

  return useMemo(() => ({ createOrder, listOrders, getOrder, updateOrder, cancelOrder }), [createOrder, listOrders, getOrder, updateOrder, cancelOrder]);
}

// ============================================================================
// CART HOOK (Authenticated Only)
// ============================================================================

export function useCartApi() {
  const { api, isAuthenticated, requireAuth } = useEcommerceApi();

  // Get current cart
  const getCart = useCallback(async (): Promise<Cart | undefined> => {
    if (!isAuthenticated) return undefined;
    return api.get<Cart>('/cart/');
  }, [api, isAuthenticated]);

  // Add item to cart
  const addItem = useCallback(async (productId: string, quantity: number = 1) => {
    requireAuth();
    return api.post<Cart>('/cart/lines/', {
      merchandiseId: productId,
      quantity
    });
  }, [api, requireAuth]);

  // Update item quantity
  const updateItem = useCallback(async (
    productId: string, 
    quantity: number
  ) => {
    requireAuth();
    return api.patch<Cart>(`/cart/lines/${productId}/`, {
      quantity
    });
  }, [api, requireAuth]);

  // Remove item
  const removeItem = useCallback(async (productId: string) => {
    requireAuth();
    return api.delete<Cart>(`/cart/lines/${productId}/`);
  }, [api, requireAuth]);

  // Remove multiple items
  const removeItems = useCallback(async (productIds: string[]) => {
    requireAuth();
    return api.delete<Cart>(`/cart/lines/`, { productIds });
  }, [api, requireAuth]);

  // Clear cart
  const clearCart = useCallback(async () => {
    requireAuth();
    // Use the base /cart endpoint if intended or reuse bulk delete with current IDs
    return api.delete<void>('/cart/');
  }, [api, requireAuth]);

  return useMemo(() => ({
    getCart,
    addItem,
    updateItem,
    removeItem,
    removeItems,
    clearCart,
    isAuthenticated,
  }), [getCart, addItem, updateItem, removeItem, removeItems, clearCart, isAuthenticated]);
}
