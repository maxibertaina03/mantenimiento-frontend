import { useQuery } from '@tanstack/react-query';
import { materialsApi, type MaterialListParams } from '@/shared/api/materials.api';

export const materialKeys = {
  all: ['materials'] as const,
  list: (params: MaterialListParams) => ['materials', 'list', params] as const,
  detail: (id: string) => ['materials', 'detail', id] as const,
  movements: (id: string) => ['materials', id, 'movements'] as const,
};

export function useMaterialsList(params: MaterialListParams = {}) {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: () => materialsApi.list(params),
  });
}

export function useMaterial(id: string | undefined) {
  return useQuery({
    queryKey: id ? materialKeys.detail(id) : ['materials', 'detail', '__nil__'],
    queryFn: () => materialsApi.get(id!),
    enabled: !!id,
  });
}

export function useMaterialMovements(id: string | undefined) {
  return useQuery({
    queryKey: id ? materialKeys.movements(id) : ['materials', 'movements', '__nil__'],
    queryFn: () => materialsApi.movements(id!),
    enabled: !!id,
  });
}
