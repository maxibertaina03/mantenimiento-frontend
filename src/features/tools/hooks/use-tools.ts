import { useQuery } from '@tanstack/react-query';
import { toolsApi, type ToolListParams } from '@/shared/api/tools.api';

export const toolKeys = {
  all: ['tools'] as const,
  list: (params: ToolListParams) => ['tools', 'list', params] as const,
  detail: (id: string) => ['tools', 'detail', id] as const,
  loans: (id: string) => ['tools', id, 'loans'] as const,
};

export function useToolsList(params: ToolListParams = {}) {
  return useQuery({
    queryKey: toolKeys.list(params),
    queryFn: () => toolsApi.list(params),
  });
}

export function useTool(id: string | undefined) {
  return useQuery({
    queryKey: id ? toolKeys.detail(id) : ['tools', 'detail', '__nil__'],
    queryFn: () => toolsApi.get(id!),
    enabled: !!id,
  });
}

export function useToolLoans(id: string | undefined) {
  return useQuery({
    queryKey: id ? toolKeys.loans(id) : ['tools', 'loans', '__nil__'],
    queryFn: () => toolsApi.loans(id!),
    enabled: !!id,
  });
}
