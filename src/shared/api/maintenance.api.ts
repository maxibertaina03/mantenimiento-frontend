import { getData, patchData, postData } from './http';
import type {
  MaintenanceDto,
  MaintenanceLocation,
  MaintenanceStatus,
  MaintenanceType,
} from '@/shared/types/maintenance';
import type { Paginated } from '@/shared/types/api';

export interface MaintenanceListParams {
  page?: number;
  pageSize?: number;
  machineId?: string;
  status?: MaintenanceStatus;
  type?: MaintenanceType;
  technicianId?: string;
  providerId?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
}

export interface ScheduleMaintenanceBody {
  machineId: string;
  type: MaintenanceType;
  location: MaintenanceLocation;
  externalLocation?: string | null;
  scheduledFor?: string | null;
  technicianId?: string | null;
  providerId?: string | null;
  description?: string | null;
}

export interface CompleteMaintenanceBody {
  machineHoursSnapshot: string;
  cost?: string | null;
  currency?: string | null;
  observations?: string | null;
}

export const maintenanceApi = {
  list: (params: MaintenanceListParams = {}) =>
    getData<Paginated<MaintenanceDto>>('/maintenance-orders', params as Record<string, unknown>),
  get: (id: string) => getData<MaintenanceDto>(`/maintenance-orders/${id}`),
  schedule: (body: ScheduleMaintenanceBody) =>
    postData<MaintenanceDto, ScheduleMaintenanceBody>('/maintenance-orders', body),
  update: (id: string, body: Partial<ScheduleMaintenanceBody> & { observations?: string | null }) =>
    patchData<MaintenanceDto, typeof body>(`/maintenance-orders/${id}`, body),
  start: (id: string) => patchData<MaintenanceDto>(`/maintenance-orders/${id}/start`),
  complete: (id: string, body: CompleteMaintenanceBody) =>
    patchData<MaintenanceDto, CompleteMaintenanceBody>(`/maintenance-orders/${id}/complete`, body),
  cancel: (id: string, reason?: string) =>
    patchData<MaintenanceDto, { reason?: string }>(`/maintenance-orders/${id}/cancel`, { reason }),
};
