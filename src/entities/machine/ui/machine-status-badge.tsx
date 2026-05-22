import { Badge } from '@/shared/ui/badge';
import {
  MACHINE_STATUS_LABEL,
  MACHINE_STATUS_VARIANT,
  type MachineStatus,
} from '@/shared/types/machines';

export function MachineStatusBadge({ status }: { status: MachineStatus }) {
  return <Badge variant={MACHINE_STATUS_VARIANT[status]}>{MACHINE_STATUS_LABEL[status]}</Badge>;
}
