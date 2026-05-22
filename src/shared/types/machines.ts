export type MachineStatus =
  | 'OPERATIONAL'
  | 'INTERNAL_MAINTENANCE'
  | 'EXTERNAL_MAINTENANCE'
  | 'OUT_OF_SERVICE';

export interface MachineDto {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  status: MachineStatus;
  usageHours: string;
  location: string | null;
  responsibleId: string | null;
  notes: string | null;
  preventiveIntervalHours: string | null;
  lastPreventiveAtHours: string | null;
  preventiveDue: boolean;
  hoursUntilPreventive: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsageLogDto {
  id: string;
  machineId: string;
  hoursBefore: string;
  hoursAfter: string;
  delta: string;
  notes: string | null;
  createdById: string;
  createdAt: string;
}

export interface PreventiveAlertDto {
  machine: MachineDto;
  overdueByHours: string;
}

export const MACHINE_STATUS_LABEL: Record<MachineStatus, string> = {
  OPERATIONAL: 'Operativa',
  INTERNAL_MAINTENANCE: 'Mant. interno',
  EXTERNAL_MAINTENANCE: 'Mant. externo',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

export const MACHINE_STATUS_VARIANT: Record<
  MachineStatus,
  'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
> = {
  OPERATIONAL: 'success',
  INTERNAL_MAINTENANCE: 'warning',
  EXTERNAL_MAINTENANCE: 'warning',
  OUT_OF_SERVICE: 'destructive',
};
