import { useQuery } from '@tanstack/react-query';
import { auditApi, type AuditLogsListParams } from '@/shared/api/audit.api';

export const auditKeys = {
  all: ['audit-logs'] as const,
  list: (params: AuditLogsListParams) => ['audit-logs', 'list', params] as const,
};

export function useAuditLogsList(params: AuditLogsListParams = {}) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditApi.list(params),
  });
}
