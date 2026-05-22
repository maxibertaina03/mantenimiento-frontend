import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { navigation } from '@/shared/config/navigation';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import { Separator } from '@/shared/ui/separator';

export function Sidebar() {
  const { data: user } = useCurrentUser();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="h-6 w-6 rounded bg-primary" />
        <span className="font-semibold tracking-tight">Mantenimiento2</span>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-4">
        {navigation.map((group) => {
          const visible = group.items.filter(
            (item) => !item.roles || (user && item.roles.includes(user.role)),
          );
          if (visible.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-1">
                {visible.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Separator className="mt-3" />
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
