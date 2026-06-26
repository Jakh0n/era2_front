import { cn } from "@/shared/lib/utils";
import { StatusBadge } from "./StatusBadge";
import {
  TaskItemProps,
  TaskMetaLine,
  TaskPreview,
  TaskPrompt,
  TaskProgressPercent,
  TaskRunningProgress,
  TaskItemActions,
  getTaskItemShellClass,
} from "./taskItemShared";

export type TaskCardProps = TaskItemProps;

export function TaskCard({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskCardProps) {
  const callbacks = { onCancel, onRetry, onDownload, onDelete };
  const isRunning = task.status === "running";

  return (
    <article
      className={cn(
        getTaskItemShellClass(task.status),
        "flex flex-col gap-3 p-4 min-[1024px]:hidden",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <TaskPreview task={task} />
        <div className="min-w-0 flex-1 space-y-2">
          <TaskPrompt
            prompt={task.prompt}
            className="whitespace-normal line-clamp-2"
          />
          <TaskMetaLine task={task} />
        </div>
      </div>

      {isRunning && <TaskRunningProgress task={task} />}

      <div className="flex items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-1">
          <StatusBadge status={task.status} />
          {isRunning && <TaskProgressPercent progress={task.progress} />}
        </div>
        <TaskItemActions task={task} callbacks={callbacks} />
      </div>
    </article>
  );
}
