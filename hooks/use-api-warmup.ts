import useSWR from 'swr';
import { useAuth } from '@/components/providers/auth-provider';

const warmupFetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
     throw new Error('Warmup failed');
  }
  return true;
};

export function useApiWarmup() {
  const { token } = useAuth();

  useSWR(
    token ? ['/api/memory/warmup', token] : null,
    warmupFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false, 
      dedupingInterval: 1000 * 60 * 60, // 1 hour deduplication
    }
  );
}
