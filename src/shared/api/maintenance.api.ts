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
    getData<Paginated<MaintenanceDto>>('/maintenance', params as Record<string, unknown>),
  get: (id: string) => getData<MaintenanceDto>(`/maintenance/${id}`),
  schedule: (body: ScheduleMaintenanceBody) =>
    postData<MaintenanceDto, ScheduleMaintenanceBody>('/maintenance', body),
  update: (id: string, body: Partial<ScheduleMaintenanceBody> & { observations?: string | null }) =>
    patchData<MaintenanceDto, typeof body>(`/maintenance/${id}`, body),
  start: (id: string) => postData<MaintenanceDto>(`/maintenance/${id}/start`),
  complete: (id: string, body: CompleteMaintenanceBody) =>
    postData<MaintenanceDto, CompleteMaintenanceBody>(`/maintenance/${id}/complete`, body),
  cancel: (id: string, reason?: string) =>
    postData<MaintenanceDto, { reason?: string }>(`/maintenance/${id}/cancel`, { reason }),
};
