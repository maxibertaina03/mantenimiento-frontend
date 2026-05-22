import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { machineKeys } from '../hooks/use-machines';
import { machinesApi, type CreateMachineBody } from '@/shared/api/machines.api';
import type { MachineDto } from '@/shared/types/machines';

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

const decimal = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Debe ser un decimal con hasta 2 decimales')
  .optional()
  .or(z.literal(''));

const schema = z.object({
  code: z.string().min(2).max(32),
  name: z.string().min(2).max(120),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  initialUsageHours: decimal,
  location: z.string().optional(),
  notes: z.string().optional(),
  preventiveIntervalHours: decimal,
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Si se pasa, el dialog edita en lugar de crear. */
  machine?: MachineDto;
}

export function MachineFormDialog({ open, onOpenChange, machine }: Props) {
  const isEdit = !!machine;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      brand: '',
      model: '',
      serialNumber: '',
      initialUsageHours: '',
      location: '',
      notes: '',
      preventiveIntervalHours: '',
    },
  });

  useEffect(() => {
    if (machine) {
      form.reset({
        code: machine.code,
        name: machine.name,
        brand: machine.brand ?? '',
        model: machine.model ?? '',
        serialNumber: machine.serialNumber ?? '',
        initialUsageHours: '',
        location: machine.location ?? '',
        notes: machine.notes ?? '',
        preventiveIntervalHours: machine.preventiveIntervalHours ?? '',
      });
    } else {
      form.reset();
    }
  }, [machine, form]);

  const create = useMutationWithFeedback({
    mutationFn: (body: CreateMachineBody) => machinesApi.create(body),
    successMessage: 'Máquina creada',
    invalidateKeys: [machineKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const update = useMutationWithFeedback({
    mutationFn: (body: Partial<CreateMachineBody>) => machinesApi.update(machine!.id, body),
    successMessage: 'Máquina actualizada',
    invalidateKeys: [machineKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const onSubmit = (values: FormValues) => {
    const payload: CreateMachineBody = {
      code: values.code,
      name: values.name,
      brand: values.brand || null,
      model: values.model || null,
      serialNumber: values.serialNumber || null,
      location: values.location || null,
      notes: values.notes || null,
      preventiveIntervalHours: values.preventiveIntervalHours || null,
    };
    if (!isEdit && values.initialUsageHours) {
      payload.initialUsageHours = values.initialUsageHours;
    }
    if (isEdit) {
      const { initialUsageHours: _drop, code: _code, ...rest } = payload;
      void _drop;
      void _code;
      update.mutate(rest);
    } else {
      create.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar máquina' : 'Nueva máquina'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modificar la información de la máquina. El código y horas iniciales no se editan acá.'
              : 'Registrar una nueva máquina en el inventario.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} placeholder="MAQ-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Compresor de aire" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº de serie</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && (
              <FormField
                control={form.control}
                name="initialUsageHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas iniciales</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="preventiveIntervalHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo preventivo (h)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Notas</FormLabel>
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
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {isEdit ? 'Guardar cambios' : 'Crear máquina'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
