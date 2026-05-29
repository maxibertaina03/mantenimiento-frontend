import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Play, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { DataTable } from '@/shared/ui/data-table';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Badge } from '@/shared/ui/badge';

import { useMaintenanceList, maintenanceKeys } from '@/features/maintenance/hooks/use-maintenance';
import { ScheduleMaintenanceDialog } from '@/features/maintenance/ui/schedule-maintenance-dialog';
import { CompleteMaintenanceDialog } from '@/features/maintenance/ui/complete-maintenance-dialog';
import { MaintenanceStatusBadge } from '@/entities/maintenance/ui/maintenance-status-badge';
import { useMachinesList, machineKeys } from '@/features/machines/hooks/use-machines';

import { maintenanceApi } from '@/shared/api/maintenance.api';
import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { formatDate } from '@/shared/lib/utils';
import {
  MAINTENANCE_TYPE_LABEL,
  type MaintenanceDto,
  type MaintenanceStatus,
  type MaintenanceType,
} from '@/shared/types/maintenance';

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | 'ALL'>('ALL');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [completeFor, setCompleteFor] = useState<MaintenanceDto | undefined>(undefined);

  const { data: machines } = useMachinesList({ pageSize: 100 });
  const machineMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of machines?.items ?? []) map.set(m.id, `${m.code} · ${m.name}`);
    return map;
  }, [machines]);

  const { data, isLoading } = useMaintenanceList({
    pageSize: 50,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    type: typeFilter === 'ALL' ? undefined : typeFilter,
  });

  const startMutation = useMutationWithFeedback({
    mutationFn: (id: string) => maintenanceApi.start(id),
    successMessage: 'Mantenimiento iniciado',
    invalidateKeys: [maintenanceKeys.all, machineKeys.all],
  });

  const columns = useMemo<ColumnDef<MaintenanceDto>[]>(
    () => [
      {
        accessorKey: 'machineId',
        header: 'Máquina',
        cell: ({ row }) => (
          <button
            className="text-left hover:underline"
            onClick={() => navigate({ to: '/machines/$id', params: { id: row.original.machineId } })}
          >
            {machineMap.get(row.original.machineId) ?? row.original.machineId}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => (
          <Badge variant="outline">{MAINTENANCE_TYPE_LABEL[row.original.type]}</Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <MaintenanceStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'location',
        header: 'Ubicación',
        cell: ({ row }) =>
          row.original.location === 'EXTERNAL' ? (
            <Badge variant="secondary">Externo</Badge>
          ) : (
            <span className="text-muted-foreground">Interno</span>
          ),
      },
      {
        accessorKey: 'scheduledFor',
        header: 'Programado',
        cell: ({ row }) => formatDate(row.original.scheduledFor),
      },
      {
        accessorKey: 'completedAt',
        header: 'Cerrado',
        cell: ({ row }) => formatDate(row.original.completedAt),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const o = row.original;
          const canStart = o.status === 'SCHEDULED';
          const canComplete = o.status === 'SCHEDULED' || o.status === 'IN_PROGRESS';
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canStart && (
                  <DropdownMenuItem onSelect={() => startMutation.mutate(o.id)}>
                    <Play className="mr-2 h-4 w-4" /> Iniciar
                  </DropdownMenuItem>
                )}
                {canComplete && (
                  <DropdownMenuItem onSelect={() => setCompleteFor(o)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Completar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [machineMap, navigate, startMutation],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mantenimientos</h1>
          <p className="text-sm text-muted-foreground">
            Órdenes de mantenimiento preventivo y correctivo.
          </p>
        </div>
        <Button onClick={() => setScheduleOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Programar
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as never)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              <SelectItem value="SCHEDULED">Programado</SelectItem>
              <SelectItem value="IN_PROGRESS">En curso</SelectItem>
              <SelectItem value="COMPLETED">Completado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as never)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los tipos</SelectItem>
              <SelectItem value="PREVENTIVE">Preventivo</SelectItem>
              <SelectItem value="CORRECTIVE">Correctivo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable columns={columns} data={data?.items ?? []} emptyMessage="Sin mantenimientos" />
      )}

      <ScheduleMaintenanceDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
      {completeFor && (
        <CompleteMaintenanceDialog
          open={!!completeFor}
          onOpenChange={(o) => !o && setCompleteFor(undefined)}
          order={completeFor}
        />
      )}
    </div>
  );
}
