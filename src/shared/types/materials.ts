export type MaterialUnit =
  | 'UNIT'
  | 'KILOGRAM'
  | 'GRAM'
  | 'LITER'
  | 'MILLILITER'
  | 'METER'
  | 'CENTIMETER'
  | 'BOX'
  | 'PACK';

export type StockMovementType = 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'CONSUMPTION';

export interface MaterialDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  unit: MaterialUnit;
  stock: string;
  minStock: string;
  isLowStock: boolean;
  location: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementDto {
  id: string;
  materialId: string;
  type: StockMovementType;
  quantity: string;
  stockAfter: string;
  reason: string | null;
  reference: string | null;
  createdById: string;
  createdAt: string;
}

export const MATERIAL_UNIT_LABEL: Record<MaterialUnit, string> = {
  UNIT: 'unidad',
  KILOGRAM: 'kg',
  GRAM: 'g',
  LITER: 'l',
  MILLILITER: 'ml',
  METER: 'm',
  CENTIMETER: 'cm',
  BOX: 'caja',
  PACK: 'pack',
};

export const MOVEMENT_TYPE_LABEL: Record<StockMovementType, string> = {
  INBOUND: 'Entrada',
  OUTBOUND: 'Salida',
  ADJUSTMENT: 'Ajuste',
  CONSUMPTION: 'Consumo',
};

export const MOVEMENT_TYPE_VARIANT: Record<
  StockMovementType,
  'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
> = {
  INBOUND: 'success',
  OUTBOUND: 'warning',
  ADJUSTMENT: 'secondary',
  CONSUMPTION: 'destructive',
};

/** Devuelve `true` si el tipo de movimiento descuenta stock (signo negativo fijo). */
export function isOutgoingMovement(t: StockMovementType): boolean {
  return t === 'OUTBOUND' || t === 'CONSUMPTION';
}
