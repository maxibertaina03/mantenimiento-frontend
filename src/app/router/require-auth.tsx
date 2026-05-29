import { useAuth } from '@clerk/clerk-react';
import { Outlet } from '@tanstack/react-router';
import { Skeleton } from '@/shared/ui/skeleton';

export function RequireAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  console.log('[RequireAuth] Auth state:', { isLoaded, isSignedIn });

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Skeleton className="h-32 w-64" />
        <p className="text-xs text-muted-foreground">Cargando autenticación...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    console.log('[RequireAuth] No autorizado, redirigiendo a sign-in');
    window.location.href = '/sign-in';
    return null;
  }

  return <Outlet />;
}
