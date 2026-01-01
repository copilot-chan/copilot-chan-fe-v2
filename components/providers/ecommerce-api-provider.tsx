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
      login(); // Trigger login flow
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
}

export function useProducts() {
  const { api } = useEcommerceApi();

  const getProducts = useCallback(async (params: ProductsParams = {}) => {
    const { query, collection, sortKey, reverse, limit } = params;
    const queryParams = new URLSearchParams();
    
    if (query) queryParams.set('q', query);
    // Use _like for regex match on array (json-server convention for loose matching) or 'collections' for exact containment
    if (collection) queryParams.set('collections_like', collection);
    if (sortKey) {
      queryParams.set('_sort', sortKey);
      queryParams.set('_order', reverse ? 'desc' : 'asc');
    }
    if (limit) queryParams.set('_limit', limit.toString());
    
    const endpoint = `/products${queryParams.toString() ? '?' + queryParams : ''}`;
    return api.get<Product[]>(endpoint);
  }, [api]);

  const getProduct = useCallback(async (handle: string) => {
    const products = await api.get<Product[]>(`/products?handle=${handle}`);
    return products[0];
  }, [api]);

  const getRecommendations = useCallback(async (productId: string) => {
    const products = await api.get<Product[]>('/products?_limit=5');
    return products.filter(p => p.id !== productId).slice(0, 4);
  }, [api]);

  return { getProducts, getProduct, getRecommendations };
}

// ============================================================================
// COLLECTIONS HOOK
// ============================================================================

export function useCollections() {
  const { api } = useEcommerceApi();

  const getCollections = useCallback(async () => {
    const collections = await api.get<Collection[]>('/collections');
    return collections.map(c => ({
      ...c,
      path: `/shop/search/${c.handle}`,
    }));
  }, [api]);

  const getCollection = useCallback(async (handle: string) => {
    const collections = await api.get<Collection[]>(`/collections?handle=${handle}`);
    const collection = collections[0];
    if (!collection) return undefined;
    return {
      ...collection,
      path: `/shop/search/${collection.handle}`,
    };
  }, [api]);

  return { getCollections, getCollection };
}

// ============================================================================
// MENU HOOK
// ============================================================================


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
      const menus = await api.get<MenuResponse[]>(`/menus?handle=${handle}`);
      return menus.length > 0 ? menus[0].items : [];
    } catch {
      return [];
    }
  }, [api]);

  return { getMenu };
}

// ============================================================================
// CART HOOK (Requires Auth for mutations)
// ============================================================================

const CART_ID_KEY = 'ecommerce_cart_id';

export function useCartApi() {
  const { api, isAuthenticated, requireAuth } = useEcommerceApi();

  // Get cart ID from localStorage
  const getCartId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CART_ID_KEY);
  }, []);

  // Save cart ID to localStorage
  const saveCartId = useCallback((cartId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_ID_KEY, cartId);
    }
  }, []);

  // Get current cart
  const getCart = useCallback(async (): Promise<Cart | undefined> => {
    const cartId = getCartId();
    if (!cartId) return undefined;
    
    try {
      return await api.get<Cart>(`/carts/${cartId}`);
    } catch {
      return undefined;
    }
  }, [api, getCartId]);

  // Create new cart
  const createCart = useCallback(async (): Promise<Cart> => {
    const newCart: Omit<Cart, 'id'> & { id: string } = {
      id: crypto.randomUUID(),
      checkoutUrl: '/shop/checkout',
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'VND' },
        totalAmount: { amount: '0', currencyCode: 'VND' },
        totalTaxAmount: { amount: '0', currencyCode: 'VND' },
      },
      lines: [],
      totalQuantity: 0,
    };
    
    const cart = await api.post<Cart>('/carts', newCart);
    saveCartId(cart.id!);
    return cart;
  }, [api, saveCartId]);

  // Helper to recalculate cart totals
  const recalculateCart = (cart: Cart): Cart => {
    const totalAmount = cart.lines.reduce(
      (sum, item) => sum + Number(item.cost.totalAmount.amount),
      0
    );
    
    return {
      ...cart,
      totalQuantity: cart.lines.reduce((sum, item) => sum + item.quantity, 0),
      cost: {
        ...cart.cost,
        subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
        totalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
        totalTaxAmount: { amount: '0', currencyCode: 'VND' }, // Simplify tax for now
      }
    };
  };

  // Add item to cart (requires auth)
  const addItem = useCallback(async (merchandiseId: string, quantity: number = 1) => {
    requireAuth();
    
    let cart = await getCart();
    if (!cart) {
      cart = await createCart();
    }

    // Need product info for price
    // Since we don't have a direct "get variant" API easily accessible here without a loop,
    // We assume the caller might want to pass price, but for security, we should fetch.
    // However, json-server is limited. We will fetch all products to find the variant (heavy but works for demo)
    // Optimization: In real app, backend handles this. Here we simulate backend logic in client.
    
    // Find existing item
    const existingIndex = cart.lines.findIndex(
      item => item.merchandise.id === merchandiseId
    );

    // Get price info - tricky with json-server structure. 
    // We will cheat slightly and assume we can get the product details from the merchandise stored?
    // No, we need to fetch the product to get the price.
    // LET'S TRY: Fetch all products and find the variant.
    const products = await api.get<Product[]>('/products'); 
    let variantPrice = '0';
    let productInfo: any = {};
    let variantInfo: any = {};

    for (const p of products) {
        const v = p.variants.find(v => v.id === merchandiseId);
        if (v) {
            variantPrice = v.price.amount;
            productInfo = p;
            variantInfo = v;
            break;
        }
    }

    if (existingIndex >= 0) {
      const item = cart.lines[existingIndex]!;
      item.quantity += quantity;
      item.cost.totalAmount.amount = (Number(variantPrice) * item.quantity).toString();
    } else {
      cart.lines.push({
        id: crypto.randomUUID(),
        quantity,
        cost: { totalAmount: { amount: (Number(variantPrice) * quantity).toString(), currencyCode: 'VND' } },
        merchandise: {
          id: merchandiseId,
          title: variantInfo.title || '',
          selectedOptions: variantInfo.selectedOptions || [],
          product: {
              id: productInfo.id || '',
              handle: productInfo.handle || '',
              title: productInfo.title || '',
              featuredImage: productInfo.featuredImage || { url: '', altText: '', width: 0, height: 0 }
          },
        },
      });
    }

    cart = recalculateCart(cart);
    
    return api.patch<Cart>(`/carts/${cart.id}`, cart);
  }, [api, requireAuth, getCart, createCart]);

  // Update item quantity (requires auth)
  const updateItem = useCallback(async (
    lineId: string, 
    quantity: number
  ) => {
    requireAuth();
    
    let cart = await getCart();
    if (!cart) return undefined;

    if (quantity <= 0) {
      cart.lines = cart.lines.filter(item => item.id !== lineId);
    } else {
      const item = cart.lines.find(item => item.id === lineId);
      if (item) {
        item.quantity = quantity;
        
        // Re-calculate line cost based on unit price (deduced from previous total / previous quantity)
        // Or fetch price again. reliable way: fetch price again or store unit price.
        // Storing unit price is better but schema doesn't have it.
        // We will reverse engineer unit price from current total / current quantity (unsafe if 0)
        // OR fetch product again. Let's fetch product again to be safe.
        
        const products = await api.get<Product[]>('/products');
        const v = products.flatMap(p => p.variants).find(v => v.id === item.merchandise.id);
        const unitPrice = v ? Number(v.price.amount) : 0;
        
        item.cost.totalAmount.amount = (unitPrice * quantity).toString();
      }
    }

    cart = recalculateCart(cart);
    
    return api.patch<Cart>(`/carts/${cart.id}`, cart);
  }, [api, requireAuth, getCart]);

  // Remove item (requires auth)
  const removeItem = useCallback(async (lineId: string) => {
    return updateItem(lineId, 0);
  }, [updateItem]);

  // Clear cart
  const clearCart = useCallback(async () => {
    const cart = await getCart();
    if (!cart) return;
    
    cart.lines = [];
    cart.totalQuantity = 0;
    cart.cost = {
        subtotalAmount: { amount: '0', currencyCode: 'VND' },
        totalAmount: { amount: '0', currencyCode: 'VND' },
        totalTaxAmount: { amount: '0', currencyCode: 'VND' },
    };
    
    return api.patch<Cart>(`/carts/${cart.id}`, cart);
  }, [api, getCart]);

  return useMemo(() => ({
    getCart,
    createCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isAuthenticated,
  }), [getCart, createCart, addItem, updateItem, removeItem, clearCart, isAuthenticated]);
}
