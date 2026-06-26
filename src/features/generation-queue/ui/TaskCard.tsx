import { cn } from "@/shared/lib/utils";
import { StatusBadge } from "./StatusBadge";
import {
  TaskItemProps,
  TaskMetaLine,
  TaskPreview,
  TaskPrompt,
  TaskProgressPercent,
  TaskRunningProgress,
  TaskStatusMessages,
  TaskItemActions,
  taskItemShellClass,
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
        taskItemShellClass,
        "flex flex-col gap-3 p-4 min-[1024px]:hidden",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <TaskPreview task={task} />
        <div className="min-w-0 flex-1 space-y-2">
          <TaskPrompt
            prompt={task.prompt}
            className="whitespace-normal line-clamp-2 lg:truncate"
          />
          <TaskMetaLine task={task} />
        </div>
      </div>

      <TaskStatusMessages task={task} />

      {isRunning && (
        <div className="space-y-2">
          <TaskRunningProgress task={task} />
          <div className="flex items-center justify-between text-[13px]">
            <StatusBadge status="running" />
            <TaskProgressPercent progress={task.progress} />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex gap-3",
          isRunning ? "justify-end" : "items-center justify-between",
        )}
      >
        {!isRunning && <StatusBadge status={task.status} />}
        <TaskItemActions task={task} callbacks={callbacks} />
      </div>
    </article>
  );
}
