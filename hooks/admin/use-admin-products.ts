'use client';

import { useState, useEffect } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Product } from '@/lib/ecomerce/foodshop/types';
import { ApiClient } from '@/lib/ecomerce/foodshop/api/client';
import { createApiClient } from '@/lib/ecomerce/foodshop/api/client'; // Import base client for GetProducts

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Helper to init api client
  const adminClient = createAdminApiClient();
  const publicClient = createApiClient(); // Use public client for fetching list (reused endpoint logic)

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // NOTE: Client side fetch from /products (public) or /admin/products (if distinct)
      // For now we use the public /products endpoint which returns all products
      const data = await publicClient.get<Product[]>('/products');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
        await adminClient.deleteProduct(id);
        // Optimistic update
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
        console.error("Delete failed", err);
        throw err;
    }
  };

  return { products, loading, error, refresh: fetchProducts, deleteProduct };
}
