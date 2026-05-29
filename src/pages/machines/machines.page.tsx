import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Search, AlertTriangle, MoreHorizontal, Clock, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { DataTable } from '@/shared/ui/data-table';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

import { useMachinesList, usePreventiveAlerts, machineKeys } from '@/features/machines/hooks/use-machines';
import { MachineFormDialog } from '@/features/machines/ui/machine-form-dialog';
import { LogHoursDialog } from '@/features/machines/ui/log-hours-dialog';
import { MachineStatusBadge } from '@/entities/machine/ui/machine-status-badge';

import { machinesApi } from '@/shared/api/machines.api';
import type { MachineDto } from '@/shared/types/machines';
import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';

export default function MachinesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MachineDto | undefined>(undefined);
  const [logHoursFor, setLogHoursFor] = useState<MachineDto | undefined>(undefined);
  const [deleteFor, setDeleteFor] = useState<MachineDto | undefined>(undefined);

  const { data, isLoading } = useMachinesList({ search: search || undefined, pageSize: 50 });
  const { data: alerts } = usePreventiveAlerts();

  const removeMutation = useMutationWithFeedback({
    mutationFn: (id: string) => machinesApi.remove(id),
    successMessage: 'Máquina eliminada',
    invalidateKeys: [machineKeys.all],
    onSuccess: () => setDeleteFor(undefined),
  });

  const columns = useMemo<ColumnDef<MachineDto>[]>(
    () => [
      { accessorKey: 'code', header: 'Código' },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <button
            className="text-left font-medium hover:underline"
            onClick={() => navigate({ to: '/machines/$id', params: { id: row.original.id } })}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <MachineStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'usageHours',
        header: 'Horas',
        cell: ({ row }) => <span className="tabular-nums">{row.original.usageHours} h</span>,
      },
      {
        id: 'preventive',
        header: 'Preventivo',
        cell: ({ row }) =>
          row.original.preventiveDue ? (
            <span className="inline-flex items-center gap-1 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Vencido
            </span>
          ) : row.original.hoursUntilPreventive ? (
            <span className="text-muted-foreground">en {row.original.hoursUntilPreventive} h</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      { accessorKey: 'location', header: 'Ubicación' },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const m = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setLogHoursFor(m)}>
                  <Clock className="mr-2 h-4 w-4" /> Registrar horas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(m);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setDeleteFor(m)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Máquinas</h1>
          <p className="text-sm text-muted-foreground">
            Inventario y estado operativo de las máquinas.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva máquina
        </Button>
      </div>

      {alerts && alerts.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Mantenimientos preventivos
              vencidos ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1">
              {alerts.slice(0, 5).map((a) => (
                <li key={a.machine.id} className="flex items-center justify-between">
                  <button
                    className="text-left hover:underline"
                    onClick={() => navigate({ to: '/machines/$id', params: { id: a.machine.id } })}
                  >
                    {a.machine.code} · {a.machine.name}
                  </button>
                  <span className="tabular-nums text-amber-700">+{a.overdueByHours} h</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, nombre o nº de serie"
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyMessage="Sin máquinas registradas"
        />
      )}

      <MachineFormDialog open={formOpen} onOpenChange={setFormOpen} machine={editing} />

      {logHoursFor && (
        <LogHoursDialog
          open={!!logHoursFor}
          onOpenChange={(o) => !o && setLogHoursFor(undefined)}
          machine={logHoursFor}
        />
      )}

      <AlertDialog open={!!deleteFor} onOpenChange={(o) => !o && setDeleteFor(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar máquina?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteFor &&
                `Esta acción marca como eliminada la máquina "${deleteFor.name}" (${deleteFor.code}). La acción queda registrada en auditoría.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteFor && removeMutation.mutate(deleteFor.id)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
