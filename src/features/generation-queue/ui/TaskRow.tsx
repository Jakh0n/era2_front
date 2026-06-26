import { cn } from "@/shared/lib/utils";
import { ProgressBar } from "./ProgressBar";
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

export type TaskRowProps = TaskItemProps;

export function TaskRow({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskRowProps) {
  const callbacks = { onCancel, onRetry, onDownload, onDelete };
  const isRunning = task.status === "running";

  return (
    <article
      className={cn(
        taskItemShellClass,
        "hidden items-center gap-4 px-4 py-3.5 min-[1024px]:flex",
        className,
      )}
    >
      <TaskPreview task={task} />

      <div className="min-w-0 flex-1 space-y-2">
        <TaskPrompt prompt={task.prompt} />
        <TaskMetaLine task={task} />
        <TaskStatusMessages task={task} />
        {isRunning && (
          <TaskRunningProgress task={task} className="max-w-md" />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex min-w-[5.5rem] flex-col items-end gap-1">
          {isRunning && <TaskProgressPercent progress={task.progress} />}
          <StatusBadge status={task.status} />
        </div>
        <TaskItemActions task={task} callbacks={callbacks} />
      </div>
    </article>
  );
}
