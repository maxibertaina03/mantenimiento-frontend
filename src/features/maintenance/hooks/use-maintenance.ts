import { useQuery } from '@tanstack/react-query';
import { maintenanceApi, type MaintenanceListParams } from '@/shared/api/maintenance.api';

export const maintenanceKeys = {
  all: ['maintenance'] as const,
  list: (params: MaintenanceListParams) => ['maintenance', 'list', params] as const,
  detail: (id: string) => ['maintenance', 'detail', id] as const,
};

export function useMaintenanceList(params: MaintenanceListParams = {}) {
  return useQuery({
    queryKey: maintenanceKeys.list(params),
    queryFn: () => maintenanceApi.list(params),
  });
}

export function useMaintenance(id: string | undefined) {
  return useQuery({
    queryKey: id ? maintenanceKeys.detail(id) : ['maintenance', 'detail', '__nil__'],
    queryFn: () => maintenanceApi.get(id!),
    enabled: !!id,
  });
}
