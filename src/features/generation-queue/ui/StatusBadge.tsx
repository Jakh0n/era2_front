import type { TaskStatus } from "@/entities/generation-task";
import { cn } from "@/shared/lib/utils";
import { STATUS_LABELS, STATUS_STYLES } from "../lib/queueLabels";

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(STATUS_STYLES[status], className)}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
