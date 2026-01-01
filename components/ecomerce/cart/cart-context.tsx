'use client';

import type { Cart, CartItem, Product, ProductVariant } from '@/lib/ecomerce/foodshop/types';
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
  selectedLineIds: string[]; // [NEW] Selected items for checkout
  
  // Actions
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  refreshCart: () => Promise<void>;
  toggleLineItem: (lineId: string) => void; // [NEW] Toggle selection
  selectAllResult: (selected: boolean) => void; // [NEW] Select all or none
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
    checkoutUrl: '/shop/checkout',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'VND' },
      totalAmount: { amount: '0', currencyCode: 'VND' },
      totalTaxAmount: { amount: '0', currencyCode: 'VND' },
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
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]); // [NEW]

  // Fetch cart on mount
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
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
  const addCartItem = useCallback((variant: ProductVariant, product: Product) => {
    // Optimistic update
    setCart(prev => {
      const currentCart = prev || createEmptyCart();
      const existingIndex = currentCart.lines.findIndex(
        item => item.merchandise.id === variant.id
      );

      let newLines: CartItem[];
      if (existingIndex >= 0) {
        newLines = currentCart.lines.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          quantity: 1,
          cost: {
            totalAmount: {
              amount: variant.price.amount,
              currencyCode: variant.price.currencyCode,
            },
          },
          merchandise: {
            id: variant.id,
            title: variant.title,
            selectedOptions: variant.selectedOptions,
            product: {
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
            },
          },
        };
        newLines = [...currentCart.lines, newItem];
      }

      const totalQuantity = newLines.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newLines.reduce(
        (sum, item) => sum + Number(item.cost.totalAmount.amount) * item.quantity,
        0
      );

      return {
        ...currentCart,
        lines: newLines,
        totalQuantity,
        cost: {
          ...currentCart.cost,
          totalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
          subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'VND' },
        },
      };
    });

    // Server sync
    cartApi.addItem(variant.id, 1)
      .then((updatedCart) => {
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

    // Find the line item and sync with server
    const lineItem = cart?.lines.find(item => item.merchandise.id === merchandiseId);
    if (lineItem?.id) {
      const newQuantity = updateType === 'delete' 
        ? 0 
        : updateType === 'plus' 
          ? lineItem.quantity + 1 
          : lineItem.quantity - 1;

      cartApi.updateItem(lineItem.id, newQuantity)
        .then((updatedCart) => {
           setCart(updatedCart);
        })
        .catch(err => {
          setError(err.message);
          refreshCart();
        });
    }
  }, [cart, cartApi, refreshCart]);

  // [NEW] Toggle selection
  const toggleLineItem = useCallback((lineId: string) => {
    setSelectedLineIds(prev => 
      prev.includes(lineId) 
        ? prev.filter(id => id !== lineId) 
        : [...prev, lineId]
    );
  }, []);

  // [NEW] Select All
  const selectAllResult = useCallback((selected: boolean) => {
    if (!cart) return;
    if (selected) {
      // Filter out undefined IDs just in case
      const allIds = cart.lines.map(item => item.id).filter((id): id is string => !!id);
      setSelectedLineIds(allIds);
    } else {
      setSelectedLineIds([]);
    }
  }, [cart]);

  // Sync selection with cart changes (remove IDs that are no longer in cart)
  useEffect(() => {
    if (cart) {
      const currentIds = cart.lines.map(item => item.id);
      setSelectedLineIds(prev => prev.filter(id => currentIds.includes(id)));
    }
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    isLoading,
    error,
    addCartItem,
    updateCartItem,
    refreshCart,
    selectedLineIds,
    toggleLineItem,
    selectAllResult,
  }), [cart, isLoading, error, addCartItem, updateCartItem, refreshCart, selectedLineIds, toggleLineItem, selectAllResult]);

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
