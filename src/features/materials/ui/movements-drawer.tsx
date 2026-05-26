import { ArrowDownRight, ArrowUpRight, Sliders, Flame } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { useMaterialMovements } from '../hooks/use-materials';
import {
  MATERIAL_UNIT_LABEL,
  MOVEMENT_TYPE_LABEL,
  MOVEMENT_TYPE_VARIANT,
  type MaterialDto,
  type StockMovementType,
} from '@/shared/types/materials';
import { formatDate } from '@/shared/lib/utils';

const ICON: Record<StockMovementType, React.ComponentType<{ className?: string }>> = {
  INBOUND: ArrowUpRight,
  OUTBOUND: ArrowDownRight,
  ADJUSTMENT: Sliders,
  CONSUMPTION: Flame,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: MaterialDto;
}

export function MovementsDrawer({ open, onOpenChange, material }: Props) {
  const { data, isLoading } = useMaterialMovements(open ? material.id : undefined);
  const unit = MATERIAL_UNIT_LABEL[material.unit];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{material.name}</SheetTitle>
          <SheetDescription>
            Historial de movimientos. Stock actual:{' '}
            <b className="tabular-nums">
              {material.stock} {unit}
            </b>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : !data || data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin movimientos registrados.</p>
          ) : (
            <ul className="divide-y">
              {data.map((m) => {
                const Icon = ICON[m.type];
                const isOut = m.type === 'OUTBOUND' || m.type === 'CONSUMPTION';
                return (
                  <li key={m.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Badge variant={MOVEMENT_TYPE_VARIANT[m.type]}>
                              {MOVEMENT_TYPE_LABEL[m.type]}
                            </Badge>
                            <span className={isOut ? 'text-destructive' : 'text-emerald-600'}>
                              {isOut ? '−' : '+'}
                              {m.quantity} {unit}
                            </span>
                          </div>
                          {m.reason && (
                            <p className="mt-0.5 text-xs text-muted-foreground">{m.reason}</p>
                          )}
                          {m.reference && (
                            <p className="text-xs text-muted-foreground">Ref: {m.reference}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium tabular-nums">
                          {m.stockAfter} {unit}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
