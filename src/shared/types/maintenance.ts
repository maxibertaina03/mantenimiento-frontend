export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MaintenanceLocation = 'INTERNAL' | 'EXTERNAL';

export interface MaintenanceDto {
  id: string;
  machineId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  location: MaintenanceLocation;
  externalLocation: string | null;
  scheduledFor: string | null;
  startedAt: string | null;
  completedAt: string | null;
  machineHoursSnapshot: string | null;
  technicianId: string | null;
  providerId: string | null;
  cost: string | null;
  currency: string | null;
  description: string | null;
  observations: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const MAINTENANCE_TYPE_LABEL: Record<MaintenanceType, string> = {
  PREVENTIVE: 'Preventivo',
  CORRECTIVE: 'Correctivo',
};

export const MAINTENANCE_STATUS_LABEL: Record<MaintenanceStatus, string> = {
  SCHEDULED: 'Programado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export const MAINTENANCE_STATUS_VARIANT: Record<
  MaintenanceStatus,
  'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
> = {
  SCHEDULED: 'secondary',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'outline',
};

export const MAINTENANCE_LOCATION_LABEL: Record<MaintenanceLocation, string> = {
  INTERNAL: 'Interno',
  EXTERNAL: 'Externo',
};
