import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { maintenanceApi } from '@/shared/api/maintenance.api';
import { maintenanceKeys } from '../hooks/use-maintenance';
import { machineKeys } from '@/features/machines/hooks/use-machines';
import type { MaintenanceDto } from '@/shared/types/maintenance';

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

const schema = z.object({
  machineHoursSnapshot: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Decimal con hasta 2 decimales'),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Decimal con hasta 2 decimales')
    .optional()
    .or(z.literal('')),
  currency: z.string().max(8).optional(),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: MaintenanceDto;
}

export function CompleteMaintenanceDialog({ open, onOpenChange, order }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { machineHoursSnapshot: '', cost: '', currency: 'ARS', observations: '' },
  });

  const mutation = useMutationWithFeedback({
    mutationFn: (values: FormValues) =>
      maintenanceApi.complete(order.id, {
        machineHoursSnapshot: values.machineHoursSnapshot,
        cost: values.cost || null,
        currency: values.currency || null,
        observations: values.observations || null,
      }),
    successMessage: 'Mantenimiento completado',
    invalidateKeys: [maintenanceKeys.all, machineKeys.all],
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completar mantenimiento</DialogTitle>
          <DialogDescription>
            Registrar el cierre del mantenimiento. Si es preventivo, las horas se usan para
            recalcular la próxima alerta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="grid gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="machineHoursSnapshot"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Horas del contador al cierre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1250.50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
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
                Marcar como completado
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
