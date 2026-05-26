import { Badge } from '@/shared/ui/badge';
import { TOOL_STATUS_LABEL, TOOL_STATUS_VARIANT, type ToolStatus } from '@/shared/types/tools';

export function ToolStatusBadge({ status }: { status: ToolStatus }) {
  return <Badge variant={TOOL_STATUS_VARIANT[status]}>{TOOL_STATUS_LABEL[status]}</Badge>;
}
