import { useMaintenanceList } from '../hooks/use-maintenance';
import { MaintenanceStatusBadge } from '@/entities/maintenance/ui/maintenance-status-badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { formatDate } from '@/shared/lib/utils';
import { MAINTENANCE_TYPE_LABEL } from '@/shared/types/maintenance';

export function MaintenanceHistoryTable({ machineId }: { machineId: string }) {
  const { data, isLoading } = useMaintenanceList({ machineId, pageSize: 50 });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <Card>
      <CardContent className="p-0">
        {!data || data.items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Sin mantenimientos registrados.</p>
        ) : (
          <ul className="divide-y">
            {data.items.map((m) => (
              <li key={m.id} className="flex items-center justify-between p-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MaintenanceStatusBadge status={m.status} />
                    <Badge variant="outline">{MAINTENANCE_TYPE_LABEL[m.type]}</Badge>
                    {m.location === 'EXTERNAL' && (
                      <Badge variant="secondary">Externo</Badge>
                    )}
                  </div>
                  {m.description && <p className="text-muted-foreground">{m.description}</p>}
                  <div className="text-xs text-muted-foreground">
                    Programado: {formatDate(m.scheduledFor)}
                    {m.completedAt && ` · Cerrado: ${formatDate(m.completedAt)}`}
                    {m.machineHoursSnapshot && ` · ${m.machineHoursSnapshot} h`}
                  </div>
                </div>
                {m.cost && (
                  <div className="text-right">
                    <div className="font-medium">
                      {m.currency ?? ''} {m.cost}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
