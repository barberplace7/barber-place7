import { QueryClient } from '@tanstack/react-query';

// Cache time constants
export const CACHE_TIMES = {
  REALTIME: 30 * 1000,      // 30 seconds
  SHORT: 2 * 60 * 1000,     // 2 minutes
  MEDIUM: 5 * 60 * 1000,    // 5 minutes
  LONG: 10 * 60 * 1000,     // 10 minutes
  SESSION: 30 * 60 * 1000,  // 30 minutes
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.MEDIUM,
      gcTime: CACHE_TIMES.LONG,  // Replaced cacheTime (deprecated in v5)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx client errors
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      onError: (error: any) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      retry: 0,
      onError: (error: any) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
