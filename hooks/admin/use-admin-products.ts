'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Product } from '@/lib/ecomerce/foodshop/types';
import { createApiClient } from '@/lib/ecomerce/foodshop/api/client';
import { useAuth } from '@/components/providers/auth-provider';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { token } = useAuth();
  
  const adminClient = useMemo(() => createAdminApiClient({ token }), [token]);
  const publicClient = useMemo(() => createApiClient({ token }), [token]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await publicClient.get<Product[]>('/products/');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    if (token) {
        fetchProducts();
    }
  }, [token, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
        await adminClient.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
        console.error("Delete failed", err);
        throw err;
    }
  }, [adminClient]);

  return useMemo(() => ({ 
    products, 
    loading, 
    error, 
    refresh: fetchProducts, 
    deleteProduct 
  }), [products, loading, error, fetchProducts, deleteProduct]);
}
