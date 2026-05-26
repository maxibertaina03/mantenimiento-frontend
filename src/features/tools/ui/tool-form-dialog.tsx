import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { toolsApi, type CreateToolBody } from '@/shared/api/tools.api';
import { toolKeys } from '../hooks/use-tools';
import type { ToolDto } from '@/shared/types/tools';

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
  code: z.string().min(2).max(32),
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  observations: z.string().optional(),
  acquiredAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool?: ToolDto;
}

export function ToolFormDialog({ open, onOpenChange, tool }: Props) {
  const isEdit = !!tool;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      brand: '',
      model: '',
      serialNumber: '',
      location: '',
      observations: '',
      acquiredAt: '',
    },
  });

  useEffect(() => {
    if (tool) {
      form.reset({
        code: tool.code,
        name: tool.name,
        description: tool.description ?? '',
        brand: tool.brand ?? '',
        model: tool.model ?? '',
        serialNumber: tool.serialNumber ?? '',
        location: tool.location ?? '',
        observations: tool.observations ?? '',
        acquiredAt: tool.acquiredAt ? tool.acquiredAt.slice(0, 10) : '',
      });
    } else {
      form.reset();
    }
  }, [tool, form]);

  const create = useMutationWithFeedback({
    mutationFn: (body: CreateToolBody) => toolsApi.create(body),
    successMessage: 'Herramienta registrada',
    invalidateKeys: [toolKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const update = useMutationWithFeedback({
    mutationFn: (body: Partial<CreateToolBody>) => toolsApi.update(tool!.id, body),
    successMessage: 'Herramienta actualizada',
    invalidateKeys: [toolKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const onSubmit = (values: FormValues) => {
    const payload: CreateToolBody = {
      code: values.code,
      name: values.name,
      description: values.description || null,
      brand: values.brand || null,
      model: values.model || null,
      serialNumber: values.serialNumber || null,
      location: values.location || null,
      observations: values.observations || null,
      acquiredAt: values.acquiredAt ? new Date(values.acquiredAt).toISOString() : null,
    };
    if (isEdit) {
      const { code: _c, ...rest } = payload;
      void _c;
      update.mutate(rest);
    } else {
      create.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar herramienta' : 'Nueva herramienta'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modificar metadatos. El estado se cambia desde las acciones.'
              : 'Registrar una herramienta nueva en el inventario.'}
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
                    <Input {...field} disabled={isEdit} placeholder="HER-001" />
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
                    <Input {...field} />
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
            <FormField
              control={form.control}
              name="acquiredAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de alta</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <Textarea {...field} rows={2} />
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
                    <Textarea {...field} rows={2} />
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
                {isEdit ? 'Guardar cambios' : 'Crear herramienta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
