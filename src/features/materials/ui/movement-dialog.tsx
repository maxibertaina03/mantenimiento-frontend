import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { materialsApi } from '@/shared/api/materials.api';
import { materialKeys } from '../hooks/use-materials';
import {
  isOutgoingMovement,
  MATERIAL_UNIT_LABEL,
  MOVEMENT_TYPE_LABEL,
  type MaterialDto,
  type StockMovementType,
} from '@/shared/types/materials';

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

const buildSchema = (currentStock: string) =>
  z
    .object({
      type: z.enum(['INBOUND', 'OUTBOUND', 'ADJUSTMENT', 'CONSUMPTION']),
      quantity: z.string().regex(/^\d+(\.\d{1,4})?$/, 'Decimal con hasta 4 decimales'),
      adjustmentSign: z.enum(['1', '-1']).optional(),
      reason: z.string().optional(),
      reference: z.string().optional(),
    })
    .refine(
      (v) => v.type !== 'ADJUSTMENT' || !!v.adjustmentSign,
      { message: 'Indicá si el ajuste suma o resta', path: ['adjustmentSign'] },
    )
    .refine(
      (v) => {
        // Validación local: si descuenta stock, la cantidad no puede exceder el actual.
        const goesOut =
          isOutgoingMovement(v.type) ||
          (v.type === 'ADJUSTMENT' && v.adjustmentSign === '-1');
        if (!goesOut) return true;
        return Number(v.quantity) <= Number(currentStock);
      },
      { message: 'No alcanza el stock disponible', path: ['quantity'] },
    );

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: MaterialDto;
  /** Tipo preseleccionado. */
  defaultType?: StockMovementType;
}

export function MovementDialog({ open, onOpenChange, material, defaultType }: Props) {
  const schema = useMemo(() => buildSchema(material.stock), [material.stock]);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType ?? 'INBOUND',
      quantity: '',
      adjustmentSign: undefined,
      reason: '',
      reference: '',
    },
  });

  const watchType = form.watch('type');

  const mutation = useMutationWithFeedback({
    mutationFn: (values: FormValues) =>
      materialsApi.registerMovement(material.id, {
        type: values.type,
        quantity: values.quantity,
        adjustmentSign:
          values.type === 'ADJUSTMENT' && values.adjustmentSign
            ? ((Number(values.adjustmentSign) as 1 | -1) ?? undefined)
            : undefined,
        reason: values.reason || null,
        reference: values.reference || null,
      }),
    successMessage: 'Movimiento registrado',
    invalidateKeys: [materialKeys.all],
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  const unitLabel = MATERIAL_UNIT_LABEL[material.unit];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar movimiento — {material.name}</DialogTitle>
          <DialogDescription>
            Stock actual:{' '}
            <b className="tabular-nums">
              {material.stock} {unitLabel}
            </b>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="grid gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.keys(MOVEMENT_TYPE_LABEL) as Array<keyof typeof MOVEMENT_TYPE_LABEL>
                      ).map((t) => (
                        <SelectItem key={t} value={t}>
                          {MOVEMENT_TYPE_LABEL[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === 'ADJUSTMENT' && (
              <FormField
                control={form.control}
                name="adjustmentSign"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Signo del ajuste</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Sumar (+)</SelectItem>
                        <SelectItem value="-1">Restar (−)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad ({unitLabel})</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Remito, OT, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Motivo</FormLabel>
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
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
