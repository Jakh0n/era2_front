import type { TaskStatus } from "@/entities/generation-task";
import { cn } from "@/shared/lib/utils";

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: "В очереди",
  running: "Идёт",
  done: "Готово",
  failed: "Ошибка",
  canceled: "Отменено",
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  queued: "text-[#8A7F78]",
  running: "text-[#E85420]",
  done: "text-emerald-400",
  failed: "text-[#FF5F57]",
  canceled: "text-[#5A504A]",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "text-[13px] font-medium leading-none whitespace-nowrap",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
