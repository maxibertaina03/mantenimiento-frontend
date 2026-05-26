import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { MaintenanceStatusBadge } from '@/entities/maintenance/ui/maintenance-status-badge';
import { useProviderHistory } from '../hooks/use-providers';
import {
  MAINTENANCE_TYPE_LABEL,
} from '@/shared/types/maintenance';
import { formatDate } from '@/shared/lib/utils';
import type { ProviderDto } from '@/shared/types/providers';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ProviderDto;
}

export function ProviderHistoryDrawer({ open, onOpenChange, provider }: Props) {
  const { data, isLoading } = useProviderHistory(open ? provider.id : undefined);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{provider.name}</SheetTitle>
          <SheetDescription>Historial de mantenimientos realizados.</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : !data || data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin trabajos registrados.</p>
          ) : (
            <ul className="divide-y">
              {data.map((m) => (
                <li key={m.id} className="py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MaintenanceStatusBadge status={m.status} />
                    <Badge variant="outline">{MAINTENANCE_TYPE_LABEL[m.type]}</Badge>
                  </div>
                  {m.description && (
                    <p className="mt-1 text-muted-foreground">{m.description}</p>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {m.completedAt
                      ? `Cerrado: ${formatDate(m.completedAt)}`
                      : m.scheduledFor
                        ? `Programado: ${formatDate(m.scheduledFor)}`
                        : `Creado: ${formatDate(m.createdAt)}`}
                    {m.cost && ` · ${m.currency ?? ''} ${m.cost}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
