import { deleteData, getData, patchData, postData } from './http';
import type {
  MaterialDto,
  MaterialUnit,
  StockMovementDto,
  StockMovementType,
} from '@/shared/types/materials';
import type { Paginated } from '@/shared/types/api';

export interface MaterialListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  lowStockOnly?: boolean;
}

export interface CreateMaterialBody {
  code: string;
  name: string;
  description?: string | null;
  unit: MaterialUnit;
  initialStock?: string;
  minStock?: string;
  location?: string | null;
}

export type UpdateMaterialBody = Partial<Omit<CreateMaterialBody, 'code' | 'initialStock'>> & {
  unit?: MaterialUnit;
};

export interface RegisterMovementBody {
  type: StockMovementType;
  quantity: string;
  adjustmentSign?: 1 | -1;
  reason?: string | null;
  reference?: string | null;
}

export const materialsApi = {
  list: (params: MaterialListParams = {}) =>
    getData<Paginated<MaterialDto>>('/materials', params as Record<string, unknown>),
  get: (id: string) => getData<MaterialDto>(`/materials/${id}`),
  create: (body: CreateMaterialBody) =>
    postData<MaterialDto, CreateMaterialBody>('/materials', body),
  update: (id: string, body: UpdateMaterialBody) =>
    patchData<MaterialDto, UpdateMaterialBody>(`/materials/${id}`, body),
  registerMovement: (id: string, body: RegisterMovementBody) =>
    postData<{ material: MaterialDto; movement: StockMovementDto }, RegisterMovementBody>(
      `/materials/${id}/movements`,
      body,
    ),
  movements: (id: string, params: { page?: number; pageSize?: number } = {}) =>
    getData<StockMovementDto[]>(`/materials/${id}/movements`, params),
  remove: (id: string) => deleteData(`/materials/${id}`),
};
