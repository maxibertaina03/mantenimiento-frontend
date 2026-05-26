import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Search,
  MoreHorizontal,
  HandCoins,
  Undo2,
  Pencil,
  Wrench,
  Trash2,
  CheckCircle2,
  Ban,
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
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
  DropdownMenuLabel,
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

import { useToolsList, toolKeys } from '@/features/tools/hooks/use-tools';
import { ToolFormDialog } from '@/features/tools/ui/tool-form-dialog';
import { LoanToolDialog } from '@/features/tools/ui/loan-tool-dialog';
import { ToolStatusBadge } from '@/entities/tool/ui/tool-status-badge';

import { toolsApi, type AdminToolStatus } from '@/shared/api/tools.api';
import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import type { ToolDto, ToolStatus } from '@/shared/types/tools';

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ToolStatus | 'ALL'>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ToolDto | undefined>(undefined);
  const [loanFor, setLoanFor] = useState<ToolDto | undefined>(undefined);
  const [deleteFor, setDeleteFor] = useState<ToolDto | undefined>(undefined);

  const { data, isLoading } = useToolsList({
    search: search || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    pageSize: 50,
  });

  const returnMutation = useMutationWithFeedback({
    mutationFn: (id: string) => toolsApi.return(id),
    successMessage: 'Herramienta devuelta',
    invalidateKeys: [toolKeys.all],
  });

  const statusMutation = useMutationWithFeedback({
    mutationFn: (vars: { id: string; status: AdminToolStatus }) =>
      toolsApi.changeStatus(vars.id, vars.status),
    successMessage: 'Estado actualizado',
    invalidateKeys: [toolKeys.all],
  });

  const removeMutation = useMutationWithFeedback({
    mutationFn: (id: string) => toolsApi.remove(id),
    successMessage: 'Herramienta eliminada',
    invalidateKeys: [toolKeys.all],
    onSuccess: () => setDeleteFor(undefined),
  });

  const columns = useMemo<ColumnDef<ToolDto>[]>(
    () => [
      { accessorKey: 'code', header: 'Código' },
      { accessorKey: 'name', header: 'Nombre' },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <ToolStatusBadge status={row.original.status} />,
      },
      { accessorKey: 'brand', header: 'Marca' },
      { accessorKey: 'location', header: 'Ubicación' },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const t = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {t.status === 'AVAILABLE' && (
                  <DropdownMenuItem onSelect={() => setLoanFor(t)}>
                    <HandCoins className="mr-2 h-4 w-4" /> Prestar
                  </DropdownMenuItem>
                )}
                {t.status === 'ON_LOAN' && (
                  <DropdownMenuItem onSelect={() => returnMutation.mutate(t.id)}>
                    <Undo2 className="mr-2 h-4 w-4" /> Devolver
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Estado administrativo</DropdownMenuLabel>
                <DropdownMenuItem
                  disabled={t.status === 'ON_LOAN' || t.status === 'AVAILABLE'}
                  onSelect={() => statusMutation.mutate({ id: t.id, status: 'AVAILABLE' })}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar disponible
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={t.status === 'ON_LOAN' || t.status === 'IN_REPAIR'}
                  onSelect={() => statusMutation.mutate({ id: t.id, status: 'IN_REPAIR' })}
                >
                  <Wrench className="mr-2 h-4 w-4" /> En reparación
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={t.status === 'ON_LOAN' || t.status === 'OUT_OF_SERVICE'}
                  onSelect={() => statusMutation.mutate({ id: t.id, status: 'OUT_OF_SERVICE' })}
                >
                  <Ban className="mr-2 h-4 w-4" /> Fuera de servicio
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(t);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setDeleteFor(t)}
                  disabled={t.status === 'ON_LOAN'}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [returnMutation, statusMutation],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Herramientas</h1>
          <p className="text-sm text-muted-foreground">
            Inventario individual con historial de préstamos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva herramienta
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, nombre o nº de serie"
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as never)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="AVAILABLE">Disponible</SelectItem>
            <SelectItem value="ON_LOAN">Prestada</SelectItem>
            <SelectItem value="IN_REPAIR">En reparación</SelectItem>
            <SelectItem value="OUT_OF_SERVICE">Fuera de servicio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyMessage="Sin herramientas registradas"
        />
      )}

      <ToolFormDialog open={formOpen} onOpenChange={setFormOpen} tool={editing} />

      {loanFor && (
        <LoanToolDialog
          open={!!loanFor}
          onOpenChange={(o) => !o && setLoanFor(undefined)}
          tool={loanFor}
        />
      )}

      <AlertDialog open={!!deleteFor} onOpenChange={(o) => !o && setDeleteFor(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar herramienta?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteFor &&
                `Esta acción marca como eliminada "${deleteFor.name}" (${deleteFor.code}). El historial de préstamos se conserva.`}
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
