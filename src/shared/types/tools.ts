export type ToolStatus = 'AVAILABLE' | 'ON_LOAN' | 'IN_REPAIR' | 'OUT_OF_SERVICE';
export type ToolLoanStatus = 'ACTIVE' | 'RETURNED' | 'LOST';

export interface ToolDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  status: ToolStatus;
  location: string | null;
  observations: string | null;
  acquiredAt: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ToolLoanDto {
  id: string;
  toolId: string;
  responsibleId: string;
  loanedAt: string;
  expectedAt: string | null;
  returnedAt: string | null;
  status: ToolLoanStatus;
  notes: string | null;
  tenantId: string | null;
  createdAt: string;
}

export interface ToolDetailDto {
  tool: ToolDto;
  activeLoan: ToolLoanDto | null;
}

export const TOOL_STATUS_LABEL: Record<ToolStatus, string> = {
  AVAILABLE: 'Disponible',
  ON_LOAN: 'Prestada',
  IN_REPAIR: 'En reparación',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

export const TOOL_STATUS_VARIANT: Record<
  ToolStatus,
  'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
> = {
  AVAILABLE: 'success',
  ON_LOAN: 'warning',
  IN_REPAIR: 'secondary',
  OUT_OF_SERVICE: 'destructive',
};
