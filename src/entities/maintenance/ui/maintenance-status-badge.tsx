import { Badge } from '@/shared/ui/badge';
import {
  MAINTENANCE_STATUS_LABEL,
  MAINTENANCE_STATUS_VARIANT,
  type MaintenanceStatus,
} from '@/shared/types/maintenance';

export function MaintenanceStatusBadge({ status }: { status: MaintenanceStatus }) {
  return (
    <Badge variant={MAINTENANCE_STATUS_VARIANT[status]}>{MAINTENANCE_STATUS_LABEL[status]}</Badge>
  );
}
