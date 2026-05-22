import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/shared/api/auth-token';

/**
 * Bridge: registra el `getToken` de Clerk en el cliente HTTP, sin acoplar
 * el módulo `shared/api` al SDK de Clerk. Renderiza children sin envolver.
 */
export function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    setAuthTokenGetter(() => getToken());
  }, [getToken, isLoaded]);

  return <>{children}</>;
}
