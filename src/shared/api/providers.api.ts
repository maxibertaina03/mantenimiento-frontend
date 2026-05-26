import { deleteData, getData, patchData, postData } from './http';
import type { ProviderDto, ProviderServiceType } from '@/shared/types/providers';
import type { MaintenanceDto } from '@/shared/types/maintenance';
import type { Paginated } from '@/shared/types/api';

export interface ProviderListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  serviceType?: ProviderServiceType;
  active?: boolean;
}

export interface CreateProviderBody {
  name: string;
  taxId?: string | null;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  serviceType: ProviderServiceType;
  notes?: string | null;
}

export type UpdateProviderBody = Partial<CreateProviderBody>;

export const providersApi = {
  list: (params: ProviderListParams = {}) =>
    getData<Paginated<ProviderDto>>('/providers', params as Record<string, unknown>),
  get: (id: string) => getData<ProviderDto>(`/providers/${id}`),
  create: (body: CreateProviderBody) =>
    postData<ProviderDto, CreateProviderBody>('/providers', body),
  update: (id: string, body: UpdateProviderBody) =>
    patchData<ProviderDto, UpdateProviderBody>(`/providers/${id}`, body),
  toggleActive: (id: string, active: boolean) =>
    patchData<ProviderDto, { active: boolean }>(`/providers/${id}/active`, { active }),
  history: (id: string, params: { page?: number; pageSize?: number } = {}) =>
    getData<MaintenanceDto[]>(`/providers/${id}/history`, params),
  remove: (id: string) => deleteData(`/providers/${id}`),
};
