import { useAuth } from '@clerk/clerk-react';
import { Outlet } from '@tanstack/react-router';
import { Skeleton } from '@/shared/ui/skeleton';

export function RequireAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-32 w-64" />
      </div>
    );
  }

  if (!isSignedIn) {
    window.location.href = '/sign-in';
    return null;
  }

  return <Outlet />;
}
