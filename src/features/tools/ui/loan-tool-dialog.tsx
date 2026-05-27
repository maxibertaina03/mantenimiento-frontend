import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutationWithFeedback } from '@/shared/hooks/use-mutation-with-feedback';
import { toolsApi } from '@/shared/api/tools.api';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';
import { UserSelector } from '@/shared/ui/user-selector';

const schema = z.object({
  responsibleId: z.string().min(1, 'Selecciona un responsable'),
  expectedAt: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: ToolDto;
}

export function LoanToolDialog({ open, onOpenChange, tool }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { responsibleId: '', expectedAt: '', notes: '' },
  });

  const mutation = useMutationWithFeedback({
    mutationFn: (values: FormValues) =>
      toolsApi.loan(tool.id, {
        responsibleId: values.responsibleId,
        expectedAt: values.expectedAt ? new Date(values.expectedAt).toISOString() : null,
        notes: values.notes || null,
      }),
    successMessage: 'Herramienta prestada',
    invalidateKeys: [toolKeys.all],
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prestar — {tool.name}</DialogTitle>
          <DialogDescription>
            Registrar el préstamo activo. Al cerrar el préstamo, la herramienta vuelve a estado
            disponible.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="responsibleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <FormControl>
                    <UserSelector
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Seleccionar responsable"
                      roles={['TECHNICIAN', 'OPERATOR']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de devolución esperada</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
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
                Prestar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
