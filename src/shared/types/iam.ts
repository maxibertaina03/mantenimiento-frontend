/**
 * Espejo de los enums del backend (Prisma). Mantenemos manualmente para evitar
 * dependencias del cliente Prisma en el frontend (decisión: dos folders sin shared/).
 */
export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN' | 'OPERATOR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  tenantId: string | null;
  fullName: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  TECHNICIAN: 'Técnico',
  OPERATOR: 'Operador',
};
