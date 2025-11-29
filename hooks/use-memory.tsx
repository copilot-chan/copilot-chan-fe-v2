import useSWRInfinite from 'swr/infinite';
import useSWRMutation from 'swr/mutation';
import { authFetcher } from '@/lib/api';
import type { Memory, MemoriesResponse } from '@/types/api';
import { AppError } from '@/lib/error';

const PAGE_SIZE = 20;

// Key generator cho pagination
export const getMemoryPaginationKey = (
  pageIndex: number,
  previousPageData: MemoriesResponse | null,
  token: string | null
) => {
  // Nếu không có token, không fetch
  if (!token) return null;

  // Nếu đã hết data, stop
  if (previousPageData && !previousPageData.has_more) return null;

  // Return key với page number
  const page = pageIndex + 1;
  return [`/api/memory/all?page=${page}&page_size=${PAGE_SIZE}`, token];
};

export function useMemories(token: string | null) {
  const { data, error, size, setSize, isLoading, isValidating, mutate } = 
    useSWRInfinite<MemoriesResponse>(
      (pageIndex, previousPageData) => 
        getMemoryPaginationKey(pageIndex, previousPageData, token),
      authFetcher,
      {
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }
    );

  // Flatten tất cả memories từ các pages
  const memories = data ? data.flatMap(page => page.results) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.results?.length === 0;
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.has_more);
  const total = data?.[0]?.count ?? 0;

  return {
    memories,
    total,
    error,
    isLoading,
    isLoadingMore,
    isValidating,
    isReachingEnd,
    size,
    setSize,
    mutate,
  };
}

// Hook delete memory với optimistic update
export function useDeleteMemory(token: string | null) {
  const { trigger, isMutating } = useSWRMutation(
    'delete-memory',
    async (_key: string, { arg }: { arg: string }) => {
      const response = await fetch(`/api/memory/${arg}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.cause || errorMessage;
        } catch (e) {
          // Ignore parse error
        }
        throw new AppError(errorMessage);
      }

      return response.json();
    }
  );

  return {
    deleteMemory: trigger,
    isDeleting: isMutating,
  };
}