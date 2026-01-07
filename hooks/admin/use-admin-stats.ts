'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { AdminStats } from '@/lib/ecomerce/foodshop/types';
import { useAuth } from '@/components/providers/auth-provider';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { token } = useAuth();
  const client = useMemo(() => createAdminApiClient({ token }), [token]);

  const fetchStats = useCallback(async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const data = await client.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setLoading(false);
      }
  }, [client, token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return useMemo(() => ({ stats, loading, error }), [stats, loading, error]);
}
