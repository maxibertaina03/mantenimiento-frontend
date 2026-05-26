import { getData } from './http';
import type { AuditAction, AuditLogDto } from '@/shared/types/audit';
import type { Paginated } from '@/shared/types/api';

export interface AuditLogsListParams {
  page?: number;
  pageSize?: number;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  action?: AuditAction;
  from?: string;
  to?: string;
}

export const auditApi = {
  list: (params: AuditLogsListParams = {}) =>
    getData<Paginated<AuditLogDto>>('/audit-logs', params as Record<string, unknown>),
};
