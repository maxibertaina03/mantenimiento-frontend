import { deleteData, getData, patchData, postData } from './http';
import type {
  ToolDetailDto,
  ToolDto,
  ToolLoanDto,
  ToolStatus,
} from '@/shared/types/tools';
import type { Paginated } from '@/shared/types/api';

export interface ToolListParams {
  page?: number;
  pageSize?: number;
  status?: ToolStatus;
  search?: string;
}

export interface CreateToolBody {
  code: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  location?: string | null;
  observations?: string | null;
  acquiredAt?: string | null;
}

export type UpdateToolBody = Partial<Omit<CreateToolBody, 'code'>>;

export type AdminToolStatus = Exclude<ToolStatus, 'ON_LOAN'>;

export interface LoanToolBody {
  responsibleId: string;
  expectedAt?: string | null;
  notes?: string | null;
}

export const toolsApi = {
  list: (params: ToolListParams = {}) =>
    getData<Paginated<ToolDto>>('/tools', params as Record<string, unknown>),
  get: (id: string) => getData<ToolDetailDto>(`/tools/${id}`),
  create: (body: CreateToolBody) => postData<ToolDto, CreateToolBody>('/tools', body),
  update: (id: string, body: UpdateToolBody) =>
    patchData<ToolDto, UpdateToolBody>(`/tools/${id}`, body),
  changeStatus: (id: string, status: AdminToolStatus, reason?: string) =>
    patchData<ToolDto, { status: AdminToolStatus; reason?: string }>(`/tools/${id}/status`, {
      status,
      reason,
    }),
  loan: (id: string, body: LoanToolBody) =>
    postData<{ tool: ToolDto; loan: ToolLoanDto }, LoanToolBody>(`/tools/${id}/loans`, body),
  return: (id: string) =>
    postData<{ tool: ToolDto; loan: ToolLoanDto }>(`/tools/${id}/return`),
  loans: (id: string, params: { page?: number; pageSize?: number } = {}) =>
    getData<ToolLoanDto[]>(`/tools/${id}/loans`, params),
  remove: (id: string) => deleteData(`/tools/${id}`),
};
