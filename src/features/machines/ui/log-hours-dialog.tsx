import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { machinesApi } from '@/shared/api/machines.api';
import type { MachineDto } from '@/shared/types/machines';
import { machineKeys } from '../hooks/use-machines';

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

const buildSchema = (current: string) =>
  z.object({
    hoursAfter: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Debe ser decimal')
      .refine((v) => Number(v) > Number(current), `Debe ser mayor a ${current}`),
    notes: z.string().optional(),
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine: MachineDto;
}

export function LogHoursDialog({ open, onOpenChange, machine }: Props) {
  const schema = buildSchema(machine.usageHours);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { hoursAfter: '', notes: '' },
  });

  const mutation = useMutationWithFeedback({
    mutationFn: (values: FormValues) =>
      machinesApi.logHours(machine.id, {
        hoursAfter: values.hoursAfter,
        notes: values.notes || null,
      }),
    successMessage: 'Horas registradas',
    invalidateKeys: [machineKeys.all],
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar horas — {machine.name}</DialogTitle>
          <DialogDescription>
            Lectura actual del contador: <b>{machine.usageHours} h</b>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="hoursAfter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva lectura (h)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`> ${machine.usageHours}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
