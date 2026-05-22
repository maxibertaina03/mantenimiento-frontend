import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/shared/types/api';

interface FeedbackOptions<T, V> extends UseMutationOptions<T, ApiError, V> {
  successMessage?: string;
  invalidateKeys?: readonly unknown[][];
}

/**
 * Wrapper sobre `useMutation` que estandariza:
 *  - Mensaje de éxito como toast.
 *  - Invalidación de queries afectadas.
 *  - El error ya viene tipado como ApiError y el toast por defecto lo muestra el QueryClient.
 */
export function useMutationWithFeedback<T, V>(opts: FeedbackOptions<T, V>) {
  const qc = useQueryClient();
  const { successMessage, invalidateKeys, onSuccess, ...rest } = opts;

  return useMutation<T, ApiError, V>({
    ...rest,
    onSuccess: async (data, variables, context) => {
      if (invalidateKeys) {
        await Promise.all(invalidateKeys.map((key) => qc.invalidateQueries({ queryKey: key })));
      }
      if (successMessage) toast.success(successMessage);
      await onSuccess?.(data, variables, context);
    },
  });
}
