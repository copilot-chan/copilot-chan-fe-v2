'use client';

import type { Cart, CartItem, Product } from '@/lib/ecomerce/foodshop/types';
import { useCartApi } from '@/components/providers/ecommerce-api-provider';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ============================================================================
// TYPES
// ============================================================================

type UpdateType = 'plus' | 'minus' | 'delete';

interface CartContextType {
  cart: Cart | undefined;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addCartItem: (product: Product, quantity?: number) => void;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// HELPERS
// ============================================================================

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    totalQuantity: 0,
    lines: [],
    cost: {
      totalAmount: { amount: '0', currencyCode: 'VND' },
    },
  };
}

// ============================================================================
// PROVIDER
// ============================================================================

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartApi = useCartApi();
  const [cart, setCart] = useState<Cart | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart on mount
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      if (data) {
        // Ensure totalQuantity is calculated correctly
        data.totalQuantity = data.lines.reduce((sum, item) => sum + item.quantity, 0);
      }
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  }, [cartApi]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add item - optimistic update
  const addCartItem = useCallback((product: Product, quantity: number = 1) => {
    // Optimistic update
    setCart(prev => {
      const currentCart = prev || createEmptyCart();
      const existingIndex = currentCart.lines.findIndex(
        item => item.merchandise.id === product.id
      );

      let newLines: CartItem[];
      if (existingIndex >= 0) {
        newLines = currentCart.lines.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          quantity: quantity,
          cost: {
            totalAmount: {
              amount: (Number(product.price.amount) * quantity).toString(),
              currencyCode: product.price.currencyCode,
            },
          },
          merchandise: {
            id: product.id,
            title: product.title,
            product: {
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
              price: product.price
            },
          },
        };
        newLines = [...currentCart.lines, newItem];
      }

      const totalQuantity = newLines.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newLines.reduce(
        (sum, item) => sum + Number(item.cost.totalAmount.amount),
        0
      );

      return {
        ...currentCart,
        lines: newLines,
        totalQuantity,
        cost: {
          ...currentCart.cost,
          totalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
        },
      };
    });

    // Server sync
    cartApi.addItem(product.id, quantity)
      .then((updatedCart) => {
        if (updatedCart) {
          updatedCart.totalQuantity = updatedCart.lines.reduce((sum, item) => sum + item.quantity, 0);
        }
        setCart(updatedCart);
      })
      .catch(err => {
        setError(err.message);
        refreshCart(); // Rollback on error
      });
  }, [cartApi, refreshCart]);

  // Update item - optimistic update
  const updateCartItem = useCallback((merchandiseId: string, updateType: UpdateType) => {
    setCart(prev => {
      if (!prev) return prev;

      const newLines = prev.lines
        .map(item => {
          if (item.merchandise.id !== merchandiseId) return item;

          if (updateType === 'delete') return null;
          
          const newQuantity = updateType === 'plus' 
            ? item.quantity + 1 
            : item.quantity - 1;
          
          if (newQuantity <= 0) return null;

          return { ...item, quantity: newQuantity };
        })
        .filter(Boolean) as CartItem[];

      const totalQuantity = newLines.reduce((sum, item) => sum + item.quantity, 0);

      // Estimate costs (imperfect, but good enough for optimistic)
      // Real cost comes from server
      return {
        ...prev,
        lines: newLines,
        totalQuantity,
      };
    });

    // Sync with server
    const lineItem = cart?.lines.find(item => item.merchandise.id === merchandiseId);
    if (!lineItem) return;

    if (updateType === 'delete') {
      cartApi.removeItem(merchandiseId)
        .then((updatedCart) => {
          if (updatedCart) {
            updatedCart.totalQuantity = updatedCart.lines.reduce((sum, item) => sum + item.quantity, 0);
          }
          setCart(updatedCart);
        })
        .catch(err => {
          setError(err.message);
          refreshCart();
        });
      return;
    }

    const newQuantity = updateType === 'plus' 
        ? lineItem.quantity + 1 
        : lineItem.quantity - 1;

    if (newQuantity <= 0) {
      cartApi.removeItem(merchandiseId)
        .then((updatedCart) => {
          if (updatedCart) {
            updatedCart.totalQuantity = updatedCart.lines.reduce((sum, item) => sum + item.quantity, 0);
          }
          setCart(updatedCart);
        })
        .catch(err => {
          setError(err.message);
          refreshCart();
        });
    } else {
      cartApi.updateItem(merchandiseId, newQuantity)
        .then((updatedCart) => {
          if (updatedCart) {
            updatedCart.totalQuantity = updatedCart.lines.reduce((sum, item) => sum + item.quantity, 0);
          }
          setCart(updatedCart);
        })
        .catch(err => {
          setError(err.message);
          refreshCart();
        });
    }
  }, [cart, cartApi, refreshCart]);


  const value = useMemo(() => ({
    cart,
    isLoading,
    error,
    addCartItem,
    updateCartItem,
    refreshCart,
  }), [cart, isLoading, error, addCartItem, updateCartItem, refreshCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
