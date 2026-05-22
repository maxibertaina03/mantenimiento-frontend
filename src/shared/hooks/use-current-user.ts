import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { iamApi } from '@/shared/api/iam.api';
import type { UserDto } from '@/shared/types/iam';

/**
 * Devuelve el usuario autenticado (UserDto del backend, no el de Clerk).
 * Sólo dispara la query cuando Clerk ya cargó el estado de auth.
 */
export function useCurrentUser() {
  const { isLoaded, isSignedIn } = useAuth();
  return useQuery<UserDto>({
    queryKey: ['iam', 'me'],
    queryFn: () => iamApi.me(),
    enabled: isLoaded && isSignedIn === true,
    staleTime: 60_000,
  });
}
