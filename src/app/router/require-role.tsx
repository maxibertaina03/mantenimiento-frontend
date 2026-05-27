import { useNavigate, Outlet } from '@tanstack/react-router';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import { Skeleton } from '@/shared/ui/skeleton';
import type { UserRole } from '@/shared/types/iam';

interface RequireRoleProps {
  roles: UserRole[];
}

export function RequireRole({ roles }: RequireRoleProps) {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }
  if (!user || !roles.includes(user.role)) {
    navigate({ to: '/dashboard', replace: true });
    return null;
  }
  return <Outlet />;
}
