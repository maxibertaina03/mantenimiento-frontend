import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { maintenanceApi } from '@/shared/api/maintenance.api';
import { maintenanceKeys } from '../hooks/use-maintenance';
import { useMachinesList } from '@/features/machines/hooks/use-machines';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { UserSelector } from '@/shared/ui/user-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const schema = z
  .object({
    machineId: z.string().uuid({ message: 'Seleccioná una máquina' }),
    type: z.enum(['PREVENTIVE', 'CORRECTIVE']),
    location: z.enum(['INTERNAL', 'EXTERNAL']),
    externalLocation: z.string().optional(),
    scheduledFor: z.string().optional(),
    technicianId: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (v) => v.location !== 'EXTERNAL' || !!v.externalLocation?.trim(),
    { message: 'Indicá la ubicación externa', path: ['externalLocation'] },
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMachineId?: string;
}

export function ScheduleMaintenanceDialog({ open, onOpenChange, defaultMachineId }: Props) {
  const { data: machines } = useMachinesList({ pageSize: 100 });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      machineId: defaultMachineId ?? '',
      type: 'PREVENTIVE',
      location: 'INTERNAL',
      externalLocation: '',
      scheduledFor: '',
      technicianId: '',
      description: '',
    },
  });

  useEffect(() => {
    if (defaultMachineId) form.setValue('machineId', defaultMachineId);
  }, [defaultMachineId, form]);

  const mutation = useMutationWithFeedback({
    mutationFn: (values: FormValues) =>
      maintenanceApi.schedule({
        machineId: values.machineId,
        type: values.type,
        location: values.location,
        externalLocation: values.externalLocation || null,
        scheduledFor: values.scheduledFor ? new Date(values.scheduledFor).toISOString() : null,
        technicianId: values.technicianId || null,
        description: values.description || null,
      }),
    successMessage: 'Mantenimiento programado',
    invalidateKeys: [maintenanceKeys.all],
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  const watchLocation = form.watch('location');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Programar mantenimiento</DialogTitle>
          <DialogDescription>
            Generar una orden de mantenimiento (preventivo o correctivo) sobre una máquina.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="grid gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Máquina</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar máquina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(machines?.items ?? []).map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.code} · {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PREVENTIVE">Preventivo</SelectItem>
                      <SelectItem value="CORRECTIVE">Correctivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INTERNAL">Interno</SelectItem>
                      <SelectItem value="EXTERNAL">Externo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchLocation === 'EXTERNAL' && (
              <FormField
                control={form.control}
                name="externalLocation"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Ubicación externa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Taller del proveedor" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Fecha programada</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technicianId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Técnico (opcional)</FormLabel>
                  <FormControl>
                    <UserSelector
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      placeholder="Seleccionar técnico"
                      roles={['TECHNICIAN']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Tareas a realizar..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                Programar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
