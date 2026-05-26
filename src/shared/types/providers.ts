export type ProviderServiceType =
  | 'MAINTENANCE'
  | 'PARTS'
  | 'TOOLS'
  | 'MATERIALS'
  | 'CONSULTING'
  | 'OTHER';

export interface ProviderDto {
  id: string;
  name: string;
  taxId: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  serviceType: ProviderServiceType;
  notes: string | null;
  active: boolean;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const PROVIDER_SERVICE_LABEL: Record<ProviderServiceType, string> = {
  MAINTENANCE: 'Mantenimiento',
  PARTS: 'Repuestos',
  TOOLS: 'Herramientas',
  MATERIALS: 'Materiales',
  CONSULTING: 'Consultoría',
  OTHER: 'Otro',
};
