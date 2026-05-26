export interface DashboardStatsDto {
  machines: {
    total: number;
    operational: number;
    inMaintenance: number;
    outOfService: number;
    preventiveDue: number;
  };
  maintenance: {
    pending: number;
    scheduled: number;
    inProgress: number;
    completedLast30d: number;
  };
  tools: {
    total: number;
    available: number;
    onLoan: number;
    inRepair: number;
  };
  materials: {
    total: number;
    lowStock: number;
  };
}
