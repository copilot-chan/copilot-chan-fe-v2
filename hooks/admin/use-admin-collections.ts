'use client';

import { useState, useEffect } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Collection } from '@/lib/ecomerce/foodshop/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { useMemo, useCallback } from 'react';

export function useAdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { token } = useAuth();
  
  const adminClient = useMemo(() => createAdminApiClient({ token }), [token]);

  const fetchCollections = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await adminClient.getCollections();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
    } finally {
      setLoading(false);
    }
  }, [adminClient, token]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const deleteCollection = useCallback(async (id: string) => {
    try {
      await adminClient.deleteCollection(id);
      setCollections(prev => prev.filter(c => c.id !== id));
      
      toast.success("Collection deleted");
      fetchCollections(); 
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete collection"); // Show backend error message
      throw err;
    }
  }, [adminClient, fetchCollections]);

  return useMemo(() => ({ collections, loading, error, refresh: fetchCollections, deleteCollection }), [collections, loading, error, fetchCollections, deleteCollection]);
}
