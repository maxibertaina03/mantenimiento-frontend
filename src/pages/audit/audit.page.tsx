import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { DataTable } from '@/shared/ui/data-table';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';

import { useAuditLogsList } from '@/features/audit/hooks/use-audit';
import {
  AUDIT_ACTION_LABEL,
  AUDIT_ACTION_VARIANT,
  type AuditAction,
  type AuditLogDto,
} from '@/shared/types/audit';
import { formatDate } from '@/shared/lib/utils';

const ENTITY_TYPES = [
  'ALL',
  'Machine',
  'MaintenanceOrder',
  'Material',
  'Tool',
  'Provider',
  'User',
] as const;
type EntityFilter = (typeof ENTITY_TYPES)[number];

export default function AuditPage() {
  const [entityType, setEntityType] = useState<EntityFilter>('ALL');
  const [action, setAction] = useState<AuditAction | 'ALL'>('ALL');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const params = useMemo(
    () => ({
      pageSize: 100,
      entityType: entityType === 'ALL' ? undefined : entityType,
      action: action === 'ALL' ? undefined : action,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(to).toISOString() : undefined,
    }),
    [entityType, action, from, to],
  );

  const { data, isLoading } = useAuditLogsList(params);

  const columns = useMemo<ColumnDef<AuditLogDto>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Acción',
        cell: ({ row }) => (
          <Badge variant={AUDIT_ACTION_VARIANT[row.original.action]}>
            {AUDIT_ACTION_LABEL[row.original.action]}
          </Badge>
        ),
      },
      { accessorKey: 'entityType', header: 'Entidad' },
      {
        accessorKey: 'entityId',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.entityId?.slice(0, 8) ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'actorId',
        header: 'Actor',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.actorId?.slice(0, 8) ?? 'sistema'}
          </span>
        ),
      },
      {
        id: 'payload',
        header: 'Detalle',
        cell: ({ row }) => <PayloadCell payload={row.original.payload} />,
      },
    ],
    [],
  );

  const clearFilters = () => {
    setEntityType('ALL');
    setAction('ALL');
    setFrom('');
    setTo('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Auditoría</h1>
        <p className="text-sm text-muted-foreground">
          Registro inmutable de acciones realizadas en el sistema.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="Entidad" />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === 'ALL' ? 'Todas las entidades' : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={action} onValueChange={(v) => setAction(v as never)}>
            <SelectTrigger>
              <SelectValue placeholder="Acción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las acciones</SelectItem>
              {(Object.keys(AUDIT_ACTION_LABEL) as AuditAction[]).map((a) => (
                <SelectItem key={a} value={a}>
                  {AUDIT_ACTION_LABEL[a]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Desde"
          />
          <Input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Hasta"
          />
          <Button variant="outline" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable columns={columns} data={data?.items ?? []} pageSize={20} />
      )}
    </div>
  );
}

function PayloadCell({ payload }: { payload: unknown }) {
  if (payload === null || payload === undefined) return <span className="text-muted-foreground">—</span>;
  const text = JSON.stringify(payload);
  const truncated = text.length > 60 ? text.slice(0, 60) + '…' : text;
  return (
    <span title={text} className="font-mono text-xs text-muted-foreground">
      {truncated}
    </span>
  );
}
