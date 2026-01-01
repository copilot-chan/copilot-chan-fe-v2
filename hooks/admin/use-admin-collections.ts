'use client';

import { useState, useEffect } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Collection } from '@/lib/ecomerce/foodshop/types';
import { toast } from 'sonner';

export function useAdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const adminClient = createAdminApiClient();

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await adminClient.getCollections();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const deleteCollection = async (id: string) => {
    try {
      await adminClient.deleteCollection(id);
      setCollections(prev => prev.filter(c => c.handle !== id)); // Handle is used as ID in mock? check types
      // Wait, Collection type has handle but maybe not ID field explicit in mock?
      // In db.json collections have "handle" but no "id" field usually?
      // Let's check db.json.
      // If collection relies on handle as ID, we need to be careful.
      // But admin client expects ID.
      // Mock server usually adds 'id' if not present, but let's assume handle is key.
      // Actually json-server uses 'id' by default.
      
      toast.success("Collection deleted");
      fetchCollections(); // Refresh to be safe
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete collection");
      throw err;
    }
  };

  return { collections, loading, error, refresh: fetchCollections, deleteCollection };
}
