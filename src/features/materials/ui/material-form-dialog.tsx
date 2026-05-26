import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { materialsApi, type CreateMaterialBody } from '@/shared/api/materials.api';
import { materialKeys } from '../hooks/use-materials';
import { MATERIAL_UNIT_LABEL, type MaterialDto } from '@/shared/types/materials';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const decimal = z
  .string()
  .regex(/^\d+(\.\d{1,4})?$/, 'Decimal con hasta 4 decimales')
  .optional()
  .or(z.literal(''));

const schema = z.object({
  code: z.string().min(2).max(32),
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  unit: z.enum([
    'UNIT',
    'KILOGRAM',
    'GRAM',
    'LITER',
    'MILLILITER',
    'METER',
    'CENTIMETER',
    'BOX',
    'PACK',
  ]),
  initialStock: decimal,
  minStock: decimal,
  location: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: MaterialDto;
}

export function MaterialFormDialog({ open, onOpenChange, material }: Props) {
  const isEdit = !!material;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      unit: 'UNIT',
      initialStock: '',
      minStock: '',
      location: '',
    },
  });

  useEffect(() => {
    if (material) {
      form.reset({
        code: material.code,
        name: material.name,
        description: material.description ?? '',
        unit: material.unit,
        initialStock: '',
        minStock: material.minStock,
        location: material.location ?? '',
      });
    } else {
      form.reset();
    }
  }, [material, form]);

  const create = useMutationWithFeedback({
    mutationFn: (body: CreateMaterialBody) => materialsApi.create(body),
    successMessage: 'Material registrado',
    invalidateKeys: [materialKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const update = useMutationWithFeedback({
    mutationFn: (body: Partial<CreateMaterialBody>) => materialsApi.update(material!.id, body),
    successMessage: 'Material actualizado',
    invalidateKeys: [materialKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const onSubmit = (values: FormValues) => {
    if (isEdit) {
      update.mutate({
        name: values.name,
        description: values.description || null,
        unit: values.unit,
        minStock: values.minStock || '0',
        location: values.location || null,
      });
    } else {
      create.mutate({
        code: values.code,
        name: values.name,
        description: values.description || null,
        unit: values.unit,
        initialStock: values.initialStock || '0',
        minStock: values.minStock || '0',
        location: values.location || null,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar material' : 'Nuevo material'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'El stock se modifica registrando movimientos, no desde acá.'
              : 'Registrar un material nuevo en el inventario.'}
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
                    <Input {...field} disabled={isEdit} placeholder="MAT-001" />
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
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de medida</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(MATERIAL_UNIT_LABEL) as Array<keyof typeof MATERIAL_UNIT_LABEL>).map(
                        (u) => (
                          <SelectItem key={u} value={u}>
                            {MATERIAL_UNIT_LABEL[u]}
                          </SelectItem>
                        ),
                      )}
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
                  <FormControl>
                    <Input {...field} placeholder="Depósito A · Estantería 3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && (
              <FormField
                control={form.control}
                name="initialStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock inicial</FormLabel>
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
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock mínimo (alerta)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" />
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
                {isEdit ? 'Guardar cambios' : 'Crear material'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
