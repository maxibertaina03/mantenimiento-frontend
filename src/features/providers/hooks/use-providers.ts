import { useQuery } from '@tanstack/react-query';
import { providersApi, type ProviderListParams } from '@/shared/api/providers.api';

export const providerKeys = {
  all: ['providers'] as const,
  list: (params: ProviderListParams) => ['providers', 'list', params] as const,
  detail: (id: string) => ['providers', 'detail', id] as const,
  history: (id: string) => ['providers', id, 'history'] as const,
};

export function useProvidersList(params: ProviderListParams = {}) {
  return useQuery({
    queryKey: providerKeys.list(params),
    queryFn: () => providersApi.list(params),
  });
}

export function useProvider(id: string | undefined) {
  return useQuery({
    queryKey: id ? providerKeys.detail(id) : ['providers', 'detail', '__nil__'],
    queryFn: () => providersApi.get(id!),
    enabled: !!id,
  });
}

export function useProviderHistory(id: string | undefined) {
  return useQuery({
    queryKey: id ? providerKeys.history(id) : ['providers', 'history', '__nil__'],
    queryFn: () => providersApi.history(id!),
    enabled: !!id,
  });
}
