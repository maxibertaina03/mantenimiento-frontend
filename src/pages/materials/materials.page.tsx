import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Search,
  AlertTriangle,
  MoreHorizontal,
  ArrowDownUp,
  History,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
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
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

import { useMaterialsList, materialKeys } from '@/features/materials/hooks/use-materials';
import { MaterialFormDialog } from '@/features/materials/ui/material-form-dialog';
import { MovementDialog } from '@/features/materials/ui/movement-dialog';
import { MovementsDrawer } from '@/features/materials/ui/movements-drawer';
import { StockBadge } from '@/entities/material/ui/stock-badge';

import { materialsApi } from '@/shared/api/materials.api';
import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { MATERIAL_UNIT_LABEL, type MaterialDto } from '@/shared/types/materials';

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MaterialDto | undefined>(undefined);
  const [movementFor, setMovementFor] = useState<MaterialDto | undefined>(undefined);
  const [drawerFor, setDrawerFor] = useState<MaterialDto | undefined>(undefined);
  const [deleteFor, setDeleteFor] = useState<MaterialDto | undefined>(undefined);

  const { data, isLoading } = useMaterialsList({
    search: search || undefined,
    lowStockOnly: lowStockOnly || undefined,
    pageSize: 50,
  });

  const removeMutation = useMutationWithFeedback({
    mutationFn: (id: string) => materialsApi.remove(id),
    successMessage: 'Material eliminado',
    invalidateKeys: [materialKeys.all],
    onSuccess: () => setDeleteFor(undefined),
  });

  const lowStockCount = useMemo(
    () => (data?.items ?? []).filter((m) => m.isLowStock).length,
    [data],
  );

  const columns = useMemo<ColumnDef<MaterialDto>[]>(
    () => [
      { accessorKey: 'code', header: 'Código' },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <button
            className="text-left font-medium hover:underline"
            onClick={() => setDrawerFor(row.original)}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        id: 'stock',
        header: 'Stock',
        cell: ({ row }) => <StockBadge material={row.original} compact />,
      },
      {
        accessorKey: 'minStock',
        header: 'Mínimo',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.minStock} {MATERIAL_UNIT_LABEL[row.original.unit]}
          </span>
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
                <DropdownMenuItem onSelect={() => setMovementFor(m)}>
                  <ArrowDownUp className="mr-2 h-4 w-4" /> Registrar movimiento
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDrawerFor(m)}>
                  <History className="mr-2 h-4 w-4" /> Ver movimientos
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
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Materiales</h1>
          <p className="text-sm text-muted-foreground">
            Inventario de materiales con stock y movimientos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo material
        </Button>
      </div>

      {lowStockCount > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              {lowStockCount} material{lowStockCount > 1 ? 'es' : ''} con stock por debajo del
              mínimo
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código o nombre"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="low-stock-only"
            checked={lowStockOnly}
            onCheckedChange={(v) => setLowStockOnly(v === true)}
          />
          <Label htmlFor="low-stock-only" className="cursor-pointer">
            Sólo stock bajo
          </Label>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyMessage="Sin materiales registrados"
        />
      )}

      <MaterialFormDialog open={formOpen} onOpenChange={setFormOpen} material={editing} />

      {movementFor && (
        <MovementDialog
          open={!!movementFor}
          onOpenChange={(o) => !o && setMovementFor(undefined)}
          material={movementFor}
        />
      )}

      {drawerFor && (
        <MovementsDrawer
          open={!!drawerFor}
          onOpenChange={(o) => !o && setDrawerFor(undefined)}
          material={drawerFor}
        />
      )}

      <AlertDialog open={!!deleteFor} onOpenChange={(o) => !o && setDeleteFor(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar material?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteFor &&
                `Esta acción marca como eliminado "${deleteFor.name}" (${deleteFor.code}). Queda registrada en auditoría.`}
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
