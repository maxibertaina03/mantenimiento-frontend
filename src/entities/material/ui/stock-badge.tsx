import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { MATERIAL_UNIT_LABEL, type MaterialDto } from '@/shared/types/materials';

interface Props {
  material: Pick<MaterialDto, 'stock' | 'minStock' | 'unit' | 'isLowStock'>;
  /** Compacto para celdas de tabla. */
  compact?: boolean;
}

export function StockBadge({ material, compact = false }: Props) {
  const variant = material.isLowStock ? 'destructive' : 'success';
  const unit = MATERIAL_UNIT_LABEL[material.unit];
  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant={variant} className="tabular-nums">
        {material.isLowStock && <AlertTriangle className="mr-1 h-3 w-3" />}
        {material.stock} {unit}
      </Badge>
      {!compact && (
        <span className="text-xs text-muted-foreground">mín {material.minStock}</span>
      )}
    </div>
  );
}
