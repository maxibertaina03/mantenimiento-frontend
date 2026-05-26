import { useClerk } from '@clerk/clerk-react';
import { LogOut, Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import { useThemeStore } from '@/shared/store/theme.store';
import { ROLE_LABELS } from '@/shared/types/iam';

export function UserMenu() {
  const { signOut } = useClerk();
  const { data: user } = useCurrentUser();
  const { theme, setTheme } = useThemeStore();

  const initials =
    user?.fullName
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.fullName} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{user?.fullName ?? '—'}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user?.username ?? user?.email ?? '—'}
          </span>
          {user?.role ? (
            <span className="mt-1 inline-flex w-fit rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              {ROLE_LABELS[user.role]}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Tema</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setTheme('light')} className="gap-2">
          <Sun className="h-4 w-4" /> Claro {theme === 'light' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme('dark')} className="gap-2">
          <Moon className="h-4 w-4" /> Oscuro {theme === 'dark' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme('system')} className="gap-2">
          <Monitor className="h-4 w-4" /> Sistema {theme === 'system' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => void signOut({ redirectUrl: '/sign-in' })}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
