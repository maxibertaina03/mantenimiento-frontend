import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { providersApi, type CreateProviderBody } from '@/shared/api/providers.api';
import { providerKeys } from '../hooks/use-providers';
import {
  PROVIDER_SERVICE_LABEL,
  type ProviderDto,
  type ProviderServiceType,
} from '@/shared/types/providers';

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

const SERVICE_TYPES = Object.keys(PROVIDER_SERVICE_LABEL) as ProviderServiceType[];

const schema = z.object({
  name: z.string().min(2).max(120),
  taxId: z.string().optional(),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  serviceType: z.enum(SERVICE_TYPES as [ProviderServiceType, ...ProviderServiceType[]]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: ProviderDto;
}

export function ProviderFormDialog({ open, onOpenChange, provider }: Props) {
  const isEdit = !!provider;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      taxId: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
      serviceType: 'MAINTENANCE',
      notes: '',
    },
  });

  useEffect(() => {
    if (provider) {
      form.reset({
        name: provider.name,
        taxId: provider.taxId ?? '',
        contactName: provider.contactName ?? '',
        phone: provider.phone ?? '',
        email: provider.email ?? '',
        address: provider.address ?? '',
        serviceType: provider.serviceType,
        notes: provider.notes ?? '',
      });
    } else {
      form.reset();
    }
  }, [provider, form]);

  const create = useMutationWithFeedback({
    mutationFn: (body: CreateProviderBody) => providersApi.create(body),
    successMessage: 'Proveedor registrado',
    invalidateKeys: [providerKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const update = useMutationWithFeedback({
    mutationFn: (body: Partial<CreateProviderBody>) =>
      providersApi.update(provider!.id, body),
    successMessage: 'Proveedor actualizado',
    invalidateKeys: [providerKeys.all],
    onSuccess: () => onOpenChange(false),
  });

  const onSubmit = (values: FormValues) => {
    const payload: CreateProviderBody = {
      name: values.name,
      taxId: values.taxId || null,
      contactName: values.contactName || null,
      phone: values.phone || null,
      email: values.email || null,
      address: values.address || null,
      serviceType: values.serviceType,
      notes: values.notes || null,
    };
    if (isEdit) update.mutate(payload);
    else create.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
          <DialogDescription>
            Datos de contacto y tipo de servicio que provee.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Nombre / Razón social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUIT / RUT</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de servicio</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {PROVIDER_SERVICE_LABEL[t]}
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
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                {isEdit ? 'Guardar cambios' : 'Crear proveedor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
