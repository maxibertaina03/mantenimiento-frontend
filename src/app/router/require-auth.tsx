import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { Skeleton } from '@/shared/ui/skeleton';

export function RequireAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/sign-in' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Skeleton className="h-32 w-64" />
        <p className="text-xs text-muted-foreground">Cargando autenticación...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return <Outlet />;
}
