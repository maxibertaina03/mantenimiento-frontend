import { getData } from './http';
import type { DashboardStatsDto } from '@/shared/types/dashboard';

export const dashboardApi = {
  stats: () => getData<DashboardStatsDto>('/dashboard/stats'),
};
