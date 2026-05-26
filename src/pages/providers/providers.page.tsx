import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Search,
  MoreHorizontal,
  History,
  Pencil,
  Power,
  PowerOff,
  Trash2,
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { DataTable } from '@/shared/ui/data-table';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
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

import { useProvidersList, providerKeys } from '@/features/providers/hooks/use-providers';
import { ProviderFormDialog } from '@/features/providers/ui/provider-form-dialog';
import { ProviderHistoryDrawer } from '@/features/providers/ui/provider-history-drawer';

import { providersApi } from '@/shared/api/providers.api';
import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import {
  PROVIDER_SERVICE_LABEL,
  type ProviderDto,
  type ProviderServiceType,
} from '@/shared/types/providers';

export default function ProvidersPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProviderServiceType | 'ALL'>('ALL');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderDto | undefined>(undefined);
  const [historyFor, setHistoryFor] = useState<ProviderDto | undefined>(undefined);
  const [deleteFor, setDeleteFor] = useState<ProviderDto | undefined>(undefined);

  const { data, isLoading } = useProvidersList({
    search: search || undefined,
    serviceType: typeFilter === 'ALL' ? undefined : typeFilter,
    active: activeFilter === 'ALL' ? undefined : activeFilter === 'ACTIVE',
    pageSize: 50,
  });

  const toggleMutation = useMutationWithFeedback({
    mutationFn: (vars: { id: string; active: boolean }) =>
      providersApi.toggleActive(vars.id, vars.active),
    successMessage: 'Estado actualizado',
    invalidateKeys: [providerKeys.all],
  });

  const removeMutation = useMutationWithFeedback({
    mutationFn: (id: string) => providersApi.remove(id),
    successMessage: 'Proveedor eliminado',
    invalidateKeys: [providerKeys.all],
    onSuccess: () => setDeleteFor(undefined),
  });

  const columns = useMemo<ColumnDef<ProviderDto>[]>(
    () => [
      { accessorKey: 'name', header: 'Nombre' },
      {
        accessorKey: 'serviceType',
        header: 'Servicio',
        cell: ({ row }) => (
          <Badge variant="outline">{PROVIDER_SERVICE_LABEL[row.original.serviceType]}</Badge>
        ),
      },
      { accessorKey: 'taxId', header: 'CUIT/RUT' },
      { accessorKey: 'contactName', header: 'Contacto' },
      { accessorKey: 'phone', header: 'Teléfono' },
      {
        accessorKey: 'active',
        header: 'Activo',
        cell: ({ row }) =>
          row.original.active ? (
            <Badge variant="success">Activo</Badge>
          ) : (
            <Badge variant="secondary">Inactivo</Badge>
          ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setHistoryFor(p)}>
                  <History className="mr-2 h-4 w-4" /> Ver historial
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(p);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toggleMutation.mutate({ id: p.id, active: !p.active })}
                >
                  {p.active ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" /> Desactivar
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" /> Activar
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setDeleteFor(p)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [toggleMutation],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Proveedores</h1>
          <p className="text-sm text-muted-foreground">
            Proveedores externos para mantenimientos y compras.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo proveedor
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, CUIT o contacto"
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as never)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo de servicio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los servicios</SelectItem>
            {(Object.keys(PROVIDER_SERVICE_LABEL) as ProviderServiceType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {PROVIDER_SERVICE_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={activeFilter} onValueChange={(v) => setActiveFilter(v as never)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="ACTIVE">Activos</SelectItem>
            <SelectItem value="INACTIVE">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyMessage="Sin proveedores registrados"
        />
      )}

      <ProviderFormDialog open={formOpen} onOpenChange={setFormOpen} provider={editing} />

      {historyFor && (
        <ProviderHistoryDrawer
          open={!!historyFor}
          onOpenChange={(o) => !o && setHistoryFor(undefined)}
          provider={historyFor}
        />
      )}

      <AlertDialog open={!!deleteFor} onOpenChange={(o) => !o && setDeleteFor(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteFor &&
                `Esta acción marca como eliminado "${deleteFor.name}". Los mantenimientos asociados se conservan en su historial.`}
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
