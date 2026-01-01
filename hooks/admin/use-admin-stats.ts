'use client';

import { useState, useEffect } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { AdminStats } from '@/lib/ecomerce/foodshop/types';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // TODO: Get token from AuthContext
        const client = createAdminApiClient({ token: 'mock-token' }); 
        const data = await client.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
