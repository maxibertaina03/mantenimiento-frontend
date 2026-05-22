import { deleteData, getData, patchData, postData } from './http';
import type {
  MachineDto,
  MachineStatus,
  PreventiveAlertDto,
  UsageLogDto,
} from '@/shared/types/machines';
import type { Paginated } from '@/shared/types/api';

export interface MachineListParams {
  page?: number;
  pageSize?: number;
  status?: MachineStatus;
  responsibleId?: string;
  search?: string;
}

export interface CreateMachineBody {
  code: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  initialUsageHours?: string;
  location?: string | null;
  responsibleId?: string | null;
  notes?: string | null;
  preventiveIntervalHours?: string | null;
}

export type UpdateMachineBody = Partial<CreateMachineBody>;

export const machinesApi = {
  list: (params: MachineListParams = {}) =>
    getData<Paginated<MachineDto>>('/machines', params as Record<string, unknown>),
  get: (id: string) => getData<MachineDto>(`/machines/${id}`),
  create: (body: CreateMachineBody) => postData<MachineDto, CreateMachineBody>('/machines', body),
  update: (id: string, body: UpdateMachineBody) =>
    patchData<MachineDto, UpdateMachineBody>(`/machines/${id}`, body),
  changeStatus: (id: string, status: MachineStatus, reason?: string) =>
    patchData<MachineDto, { status: MachineStatus; reason?: string }>(
      `/machines/${id}/status`,
      { status, reason },
    ),
  logHours: (id: string, body: { hoursAfter: string; notes?: string | null }) =>
    postData<{ machine: MachineDto; log: UsageLogDto }, typeof body>(
      `/machines/${id}/usage-logs`,
      body,
    ),
  usageLogs: (id: string, params: { page?: number; pageSize?: number } = {}) =>
    getData<UsageLogDto[]>(`/machines/${id}/usage-logs`, params),
  remove: (id: string) => deleteData(`/machines/${id}`),
  preventiveAlerts: () => getData<PreventiveAlertDto[]>('/machines/preventive-alerts'),
};
