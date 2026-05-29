import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/shared/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => {
        const status = (error as unknown as ApiError).statusCode;
        if (status >= 400 && status < 500) return false;
        return count < 2;
      },
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const apiError = error as unknown as ApiError;
        toast.error(apiError.message ?? 'Algo salió mal', {
          description: apiError.code,
        });
      },
    },
  },
});
