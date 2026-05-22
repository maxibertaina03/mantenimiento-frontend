import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Pencil } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Separator } from '@/shared/ui/separator';
import { Badge } from '@/shared/ui/badge';

import { useMachine, useUsageLogs } from '@/features/machines/hooks/use-machines';
import { MachineFormDialog } from '@/features/machines/ui/machine-form-dialog';
import { LogHoursDialog } from '@/features/machines/ui/log-hours-dialog';
import { MachineStatusBadge } from '@/entities/machine/ui/machine-status-badge';
import { MaintenanceHistoryTable } from '@/features/maintenance/ui/maintenance-history-table';
import { formatDate } from '@/shared/lib/utils';

export default function MachineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: machine, isLoading } = useMachine(id);
  const { data: usageLogs } = useUsageLogs(id);
  const [editOpen, setEditOpen] = useState(false);
  const [logHoursOpen, setLogHoursOpen] = useState(false);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!machine) return <p className="text-muted-foreground">Máquina no encontrada</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/machines')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="flex-1" />
        <Button variant="outline" onClick={() => setLogHoursOpen(true)}>
          <Clock className="mr-2 h-4 w-4" /> Registrar horas
        </Button>
        <Button onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3">
                {machine.name}
                <MachineStatusBadge status={machine.status} />
                {machine.preventiveDue && <Badge variant="destructive">Preventivo vencido</Badge>}
              </CardTitle>
              <CardDescription className="mt-1 font-mono">{machine.code}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-3">
            <Field label="Marca">{machine.brand ?? '—'}</Field>
            <Field label="Modelo">{machine.model ?? '—'}</Field>
            <Field label="Nº de serie">{machine.serialNumber ?? '—'}</Field>
            <Field label="Ubicación">{machine.location ?? '—'}</Field>
            <Field label="Horas de uso">
              <span className="tabular-nums">{machine.usageHours} h</span>
            </Field>
            <Field label="Intervalo preventivo">
              {machine.preventiveIntervalHours ? `${machine.preventiveIntervalHours} h` : '—'}
            </Field>
            <Field label="Último preventivo">
              {machine.lastPreventiveAtHours ? `${machine.lastPreventiveAtHours} h` : '—'}
            </Field>
            <Field label="Horas hasta próx. preventivo">
              {machine.hoursUntilPreventive ?? '—'}
            </Field>
            <Field label="Alta">{formatDate(machine.createdAt)}</Field>
          </dl>
          {machine.notes && (
            <>
              <Separator className="my-4" />
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{machine.notes}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="maintenance">
        <TabsList>
          <TabsTrigger value="maintenance">Mantenimientos</TabsTrigger>
          <TabsTrigger value="usage">Historial de horas</TabsTrigger>
        </TabsList>
        <TabsContent value="maintenance">
          <MaintenanceHistoryTable machineId={machine.id} />
        </TabsContent>
        <TabsContent value="usage">
          <Card>
            <CardContent className="p-4 text-sm">
              {!usageLogs || usageLogs.length === 0 ? (
                <p className="text-muted-foreground">Sin registros de horas todavía.</p>
              ) : (
                <ul className="divide-y">
                  {usageLogs.map((log) => (
                    <li key={log.id} className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium">
                          {log.hoursBefore} → {log.hoursAfter} h
                          <span className="ml-2 text-emerald-600">+{log.delta}</span>
                        </div>
                        {log.notes && <div className="text-xs text-muted-foreground">{log.notes}</div>}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MachineFormDialog open={editOpen} onOpenChange={setEditOpen} machine={machine} />
      <LogHoursDialog open={logHoursOpen} onOpenChange={setLogHoursOpen} machine={machine} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}
