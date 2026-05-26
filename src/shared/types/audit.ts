export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATE_CHANGE'
  | 'STOCK_MOVEMENT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'PERMISSION_CHANGE';

export interface AuditLogDto {
  id: string;
  actorId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  payload: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  tenantId: string | null;
  createdAt: string;
}

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  CREATE: 'Creación',
  UPDATE: 'Edición',
  DELETE: 'Eliminación',
  STATE_CHANGE: 'Cambio de estado',
  STOCK_MOVEMENT: 'Movimiento de stock',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  EXPORT: 'Exportación',
  IMPORT: 'Importación',
  PERMISSION_CHANGE: 'Cambio de permisos',
};

export const AUDIT_ACTION_VARIANT: Record<
  AuditAction,
  'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
> = {
  CREATE: 'success',
  UPDATE: 'secondary',
  DELETE: 'destructive',
  STATE_CHANGE: 'warning',
  STOCK_MOVEMENT: 'default',
  LOGIN: 'outline',
  LOGOUT: 'outline',
  EXPORT: 'outline',
  IMPORT: 'outline',
  PERMISSION_CHANGE: 'warning',
};
