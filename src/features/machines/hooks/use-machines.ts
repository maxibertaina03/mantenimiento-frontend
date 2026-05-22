import { useQuery } from '@tanstack/react-query';
import { machinesApi, type MachineListParams } from '@/shared/api/machines.api';

export const machineKeys = {
  all: ['machines'] as const,
  list: (params: MachineListParams) => ['machines', 'list', params] as const,
  detail: (id: string) => ['machines', 'detail', id] as const,
  usageLogs: (id: string) => ['machines', id, 'usage-logs'] as const,
  preventiveAlerts: () => ['machines', 'preventive-alerts'] as const,
};

export function useMachinesList(params: MachineListParams = {}) {
  return useQuery({
    queryKey: machineKeys.list(params),
    queryFn: () => machinesApi.list(params),
  });
}

export function useMachine(id: string | undefined) {
  return useQuery({
    queryKey: id ? machineKeys.detail(id) : ['machines', 'detail', '__nil__'],
    queryFn: () => machinesApi.get(id!),
    enabled: !!id,
  });
}

export function usePreventiveAlerts() {
  return useQuery({
    queryKey: machineKeys.preventiveAlerts(),
    queryFn: () => machinesApi.preventiveAlerts(),
  });
}

export function useUsageLogs(machineId: string | undefined) {
  return useQuery({
    queryKey: machineId ? machineKeys.usageLogs(machineId) : ['machines', 'usage-logs', '__nil__'],
    queryFn: () => machinesApi.usageLogs(machineId!),
    enabled: !!machineId,
  });
}
